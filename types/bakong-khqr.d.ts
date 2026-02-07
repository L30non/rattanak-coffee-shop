declare module "bakong-khqr" {
  export interface IndividualInfo {
    bakongAccountID: string;
    merchantName: string;
    merchantCity: string;
    acquiringBank: string;
    currency: number;
    amount: number;
    expirationTimestamp?: number;
    mobileNumber?: string;
    storeLabel?: string;
    terminalLabel?: string;
    purposeOfTransaction?: string;
    languagePreference?: string;
    merchantNameAlternateLanguage?: string;
    merchantCityAlternateLanguage?: string;
    billNumber?: string;
  }

  export interface KHQRResponse {
    status: {
      code: number;
      message?: string;
    };
    data?: {
      qr: string;
      md5: string;
    };
  }

  export class BakongKHQR {
    generateIndividual(info: IndividualInfo): KHQRResponse;
    generateMerchant(info: Record<string, unknown>): KHQRResponse;
  }

  export const khqrData: {
    currency: {
      usd: number;
      khr: number;
    };
    [key: string]: unknown;
  };
}
