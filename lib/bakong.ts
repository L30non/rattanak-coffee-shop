import { BakongKHQR, khqrData, IndividualInfo } from "bakong-khqr";

export interface KHQRGenerationResult {
  qrCode: string;
  md5: string;
  amount: number;
  currency: string;
}

/**
 * Generates a Bakong KHQR code for payment
 * Must be called from server-side only (API routes)
 * @param amount - The payment amount in USD
 * @param billNumber - Optional order/bill reference number
 * @returns KHQR code string, MD5 hash, and payment details
 */
export function generateBakongKHQR(
  amount: number,
  billNumber?: string,
): KHQRGenerationResult {
  const accountId = process.env.BAKONG_ACCOUNT_ID;
  const merchantName = process.env.BAKONG_MERCHANT_NAME;
  const merchantCity = process.env.BAKONG_MERCHANT_CITY;
  const mobileNumber = process.env.BAKONG_MOBILE_NUMBER;

  if (!accountId || !merchantName || !merchantCity) {
    throw new Error(
      "Missing Bakong configuration. Please set BAKONG_ACCOUNT_ID, BAKONG_MERCHANT_NAME, and BAKONG_MERCHANT_CITY in environment variables.",
    );
  }

  // Ensure amount is a valid number rounded to 2 decimal places
  const sanitizedAmount = Math.round(amount * 100) / 100;
  if (!sanitizedAmount || sanitizedAmount <= 0) {
    throw new Error("Amount must be greater than 0");
  }

  // 5-minute expiration matching the client-side QR timer
  const expirationTimestamp = Date.now() + 5 * 60 * 1000;

  const individualInfo: IndividualInfo = {
    bakongAccountID: accountId,
    merchantName: merchantName,
    merchantCity: merchantCity,
    acquiringBank: "National Bank of Cambodia",
    currency: khqrData.currency.usd,
    amount: sanitizedAmount,
    expirationTimestamp,
    mobileNumber: mobileNumber || undefined,
    storeLabel: "Rattanak Coffee",
    terminalLabel: "Online_Store",
    purposeOfTransaction: "oversea",
    languagePreference: "en",
    merchantNameAlternateLanguage: "រតនៈ កាហ្វេ",
    merchantCityAlternateLanguage: "ភ្នំពេញ",
    billNumber: billNumber || undefined,
  };

  const khqr = new BakongKHQR();
  const response = khqr.generateIndividual(individualInfo);

  if (response.status.code !== 0 || !response.data) {
    throw new Error(response.status.message || "Failed to generate KHQR code");
  }

  const qrCodeData = response.data as { qr: string; md5: string };

  return {
    qrCode: qrCodeData.qr,
    md5: qrCodeData.md5,
    amount: sanitizedAmount,
    currency: "USD",
  };
}

/**
 * Verifies a Bakong KHQR payment by checking the transaction via MD5 hash
 * Calls the NBC Bakong API: POST /v1/check_transaction_by_md5
 * Must be called from server-side only (API routes)
 * @param md5Hash - The MD5 hash of the KHQR transaction
 * @returns Promise with verification result
 */
export async function verifyBakongPayment(md5Hash: string): Promise<{
  verified: boolean;
  transactionId?: string;
  error?: string;
}> {
  const apiUrl = process.env.BAKONG_PROD_BASE_API_URL_MD5;
  const token = process.env.BAKONG_TOKEN;

  console.log("[Bakong] Verifying payment - md5:", md5Hash);
  console.log("[Bakong] API URL:", apiUrl ? "configured" : "MISSING");
  console.log("[Bakong] Token:", token ? `configured (${token.length} chars)` : "MISSING");

  if (!apiUrl || !token) {
    const error = "Missing Bakong API configuration. Please set BAKONG_PROD_BASE_API_URL_MD5 and BAKONG_TOKEN in environment variables.";
    console.error("[Bakong]", error);
    throw new Error(error);
  }

  try {
    console.log("[Bakong] Calling NBC API:", apiUrl);
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ md5: md5Hash }),
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    console.log("[Bakong] NBC API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Bakong] API error - Status:", response.status, "Body:", errorText);
      return {
        verified: false,
        error: `Bakong API returned status ${response.status}: ${errorText.substring(0, 100)}`,
      };
    }

    const data = await response.json();
    console.log("[Bakong] NBC API response data:", JSON.stringify(data));

    // The NBC API returns responseCode 0 for success and includes transaction hash
    if (data.responseCode === 0 && data.data) {
      console.log("[Bakong] ✓ Payment verified! Transaction:", data.data.hash || data.data.transactionId);
      return {
        verified: true,
        transactionId:
          data.data.hash || data.data.transactionId || `BKG-${Date.now()}`,
      };
    }

    // Payment not found or not yet completed
    console.log("[Bakong] Payment not verified - Code:", data.responseCode, "Message:", data.responseMessage);
    return {
      verified: false,
      error:
        data.responseMessage ||
        "Payment not yet received. Please complete the payment and try again.",
    };
  } catch (err) {
    console.error("[Bakong] Exception during verification:", err);
    if (err instanceof Error && err.name === "TimeoutError") {
      return {
        verified: false,
        error: "Request timed out. Please try again.",
      };
    }
    return {
      verified: false,
      error: err instanceof Error ? err.message : "Failed to verify payment",
    };
  }
}

/**
 * Get Bakong configuration status
 * @returns Object indicating if Bakong is properly configured
 */
export function isBakongConfigured(): boolean {
  return !!(
    process.env.BAKONG_ACCOUNT_ID &&
    process.env.BAKONG_MERCHANT_NAME &&
    process.env.BAKONG_MERCHANT_CITY
  );
}
