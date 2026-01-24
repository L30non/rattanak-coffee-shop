/**
 * Bakong KHQR Payment Utility
 * Generates KHQR (Khmer QR) codes for Bakong payment system
 *
 * Note: This is a simplified implementation. For production, you should:
 * 1. Use the official bakong-khqr npm package
 * 2. Register as a merchant with the National Bank of Cambodia
 * 3. Implement proper payment verification via Bakong API
 */

export interface KHQRData {
  merchantName: string;
  merchantId: string; // Bakong account ID (phone number or account number)
  amount: number;
  currency: "USD" | "KHR";
  transactionRef?: string;
  terminalLabel?: string;
  storeLabel?: string;
}

export interface KHQRResult {
  qrString: string;
  deepLink: string;
}

// Currency codes for KHQR
const CURRENCY_CODES = {
  USD: "840",
  KHR: "116",
} as const;

/**
 * Generate a simplified KHQR string
 * In production, use the official bakong-khqr package for proper EMVCo QR generation
 */
export function generateKHQR(data: KHQRData): KHQRResult {
  const {
    merchantName,
    merchantId,
    amount,
    currency,
    transactionRef = `TXN${Date.now()}`,
    storeLabel = "Rattanak Coffee Shop",
  } = data;

  // Format amount based on currency (KHR has no decimals, USD has 2)
  const formattedAmount =
    currency === "KHR" ? Math.round(amount).toString() : amount.toFixed(2);

  // Build simplified QR payload (EMVCo format)
  // Note: This is a simplified version. Production should use proper EMVCo encoding
  const qrPayload = [
    "00020101", // Payload Format Indicator
    "010212", // Point of Initiation Method (12 = dynamic)
    `29${String(26 + merchantId.length + merchantName.length).padStart(2, "0")}`, // Merchant Account Info
    `0006bakong`, // Bakong identifier
    `01${String(merchantId.length).padStart(2, "0")}${merchantId}`, // Merchant ID
    `5303${CURRENCY_CODES[currency]}`, // Transaction Currency
    `54${String(formattedAmount.length).padStart(2, "0")}${formattedAmount}`, // Transaction Amount
    "5802KH", // Country Code
    `59${String(merchantName.length).padStart(2, "0")}${merchantName}`, // Merchant Name
    `60${String(storeLabel.length).padStart(2, "0")}${storeLabel}`, // Merchant City
    `62${String(4 + transactionRef.length).padStart(2, "0")}05${String(transactionRef.length).padStart(2, "0")}${transactionRef}`, // Additional Data
  ].join("");

  // Calculate CRC16 checksum (simplified - production should use proper CRC16-CCITT)
  const crc = calculateCRC16(qrPayload + "6304");
  const qrString = qrPayload + "6304" + crc;

  // Generate Bakong deep link for mobile app
  const deepLink = `bakong://pay?data=${encodeURIComponent(qrString)}`;

  return {
    qrString,
    deepLink,
  };
}

/**
 * Calculate CRC16-CCITT checksum for KHQR
 * This is the checksum algorithm used in EMVCo QR codes
 */
function calculateCRC16(data: string): string {
  let crc = 0xffff;
  const polynomial = 0x1021;

  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ polynomial;
      } else {
        crc <<= 1;
      }
    }
    crc &= 0xffff;
  }

  return crc.toString(16).toUpperCase().padStart(4, "0");
}

/**
 * Merchant configuration
 * In production, these should come from environment variables
 */
export const MERCHANT_CONFIG = {
  merchantName: "Rattanak Coffee",
  merchantId: process.env.NEXT_PUBLIC_BAKONG_MERCHANT_ID || "855123456789", // Example Bakong account
  defaultCurrency: "USD" as const,
};

/**
 * Generate a KHQR code for a specific order amount
 */
export function generateOrderKHQR(
  amount: number,
  orderId: string,
  currency: "USD" | "KHR" = "USD",
): KHQRResult {
  return generateKHQR({
    merchantName: MERCHANT_CONFIG.merchantName,
    merchantId: MERCHANT_CONFIG.merchantId,
    amount,
    currency,
    transactionRef: orderId,
    storeLabel: "Rattanak Coffee Shop",
  });
}

/**
 * Convert USD to KHR (approximate rate)
 * In production, fetch live rates from an API
 */
export function convertUSDtoKHR(usd: number): number {
  const EXCHANGE_RATE = 4100; // Approximate USD to KHR rate
  return Math.round(usd * EXCHANGE_RATE);
}

/**
 * Format currency display
 */
export function formatCurrency(
  amount: number,
  currency: "USD" | "KHR",
): string {
  if (currency === "KHR") {
    return `${Math.round(amount).toLocaleString()} ៛`;
  }
  return `$${amount.toFixed(2)}`;
}
