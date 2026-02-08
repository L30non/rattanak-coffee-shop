"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import {
  QrCode,
  CheckCircle,
  Loader2,
  AlertCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

const QR_EXPIRY_SECONDS = 5 * 60; // 5 minutes
const POLL_INTERVAL_MS = 3000; // Check every 3 seconds

interface KHQRData {
  qrCode: string;
  md5: string;
  amount: number;
  currency: string;
}

interface BakongPaymentProps {
  amount: number;
  orderId?: string;
  onVerified?: (transactionId: string) => void;
}

export function BakongPayment({
  amount,
  orderId,
  onVerified,
}: BakongPaymentProps) {
  const [khqrData, setKhqrData] = useState<KHQRData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(QR_EXPIRY_SECONDS);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const isExpired = secondsLeft <= 0;

  // Start / restart countdown
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSecondsLeft(QR_EXPIRY_SECONDS);

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  // Auto-verify payment via polling
  const checkPaymentStatus = useCallback(async () => {
    if (!khqrData || isVerified || isExpired) return;

    try {
      const response = await fetch("/api/bakong/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ md5: khqrData.md5 }),
      });

      const result = await response.json();

      if (result.verified && result.transactionId) {
        // Stop polling IMMEDIATELY
        if (pollRef.current) {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

        setIsVerified(true);
        toast.success("Payment received! Processing your order...");

        if (onVerified) {
          onVerified(result.transactionId);
        }
      }
    } catch (err) {
      // Continue polling on error - don't show error to user for background checks
    }
  }, [khqrData, isVerified, isExpired, onVerified]);

  // Start polling when QR is generated
  useEffect(() => {
    if (khqrData && !isVerified && !isExpired) {
      // Initial check after 2 seconds
      const initialTimeout = setTimeout(() => {
        checkPaymentStatus();
      }, 2000);

      // Then poll every POLL_INTERVAL_MS
      pollRef.current = setInterval(checkPaymentStatus, POLL_INTERVAL_MS);

      return () => {
        clearTimeout(initialTimeout);
        if (pollRef.current) {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
      };
    } else if (isVerified || isExpired) {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    }
  }, [khqrData, isVerified, isExpired, checkPaymentStatus]);

  // Stop polling when expired
  useEffect(() => {
    if (isExpired && pollRef.current) {
      clearInterval(pollRef.current);
    }
  }, [isExpired]);

  // Generate KHQR via server API
  const generateQRCode = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    setIsVerified(false);

    try {
      const response = await fetch("/api/bakong/generate-khqr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, billNumber: orderId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate QR code");
      }

      const result: KHQRData = await response.json();
      setKhqrData(result);
      startTimer();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate QR code";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  }, [amount, orderId, startTimer]);

  // Auto-generate on mount
  useEffect(() => {
    generateQRCode();
  }, [generateQRCode]);

  // Format seconds → mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Timer colour based on remaining time
  const timerColor =
    secondsLeft <= 30
      ? "text-red-600"
      : secondsLeft <= 60
        ? "text-orange-500"
        : "text-gray-700";

  // ── Loading state ──
  if (isGenerating) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-[#5F1B2C] mb-4" />
            <p className="text-gray-600">Generating QR code...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ── Error state (no QR data yet) ──
  if (error && !khqrData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button
            onClick={generateQRCode}
            className="w-full mt-4"
            variant="outline"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  // ── Main QR display ──
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5 text-[#5F1B2C]" />
          Bakong KHQR Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Instructions */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">How to Pay</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Open your banking app (ABA, ACLEDA, Wing, etc.)</li>
            <li>Select &quot;Scan QR&quot; or &quot;Bakong QR&quot;</li>
            <li>Scan the QR code below</li>
            <li>Complete the payment in your app</li>
            <li>Wait for automatic verification (no action needed)</li>
          </ol>
        </div>

        {khqrData && (
          <div className="flex flex-col items-center space-y-4">
            {/* Countdown Timer */}
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
                isExpired
                  ? "bg-red-50 border-red-300"
                  : secondsLeft <= 60
                    ? "bg-orange-50 border-orange-300"
                    : "bg-gray-50 border-gray-200"
              }`}
            >
              <Clock className={`h-4 w-4 ${timerColor}`} />
              {isExpired ? (
                <span className="text-sm font-medium text-red-600">
                  QR Code Expired
                </span>
              ) : (
                <>
                  <span className={`text-sm font-medium ${timerColor}`}>
                    Expires in
                  </span>
                  <span className={`text-lg font-mono font-bold ${timerColor}`}>
                    {formatTime(secondsLeft)}
                  </span>
                </>
              )}
            </div>

            {/* QR Code */}
            <div
              className={`p-6 bg-white border-2 rounded-lg transition-opacity ${
                isExpired ? "border-red-300 opacity-40" : "border-gray-200"
              }`}
            >
              <div className="flex flex-col items-center">
                <QRCodeSVG
                  value={khqrData.qrCode}
                  size={250}
                  level="M"
                  includeMargin
                  bgColor="#ffffff"
                  fgColor={isExpired ? "#999999" : "#000000"}
                />
                {!isExpired && (
                  <p className="text-xs text-gray-500 mt-2">
                    Scan with your banking app
                  </p>
                )}
              </div>
            </div>

            {/* Payment Details */}
            <div className="w-full p-4 bg-gray-50 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold text-[#5F1B2C]">
                  ${khqrData.amount.toFixed(2)} {khqrData.currency}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Merchant:</span>
                <span className="font-medium">Rattanak Coffee Shop</span>
              </div>
              {orderId && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-mono text-xs">
                    {orderId.substring(0, 8)}
                  </span>
                </div>
              )}
            </div>

            {/* Verification status */}
            {isVerified ? (
              <Alert className="bg-green-50 border-green-200 w-full">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Payment verified successfully! Your order is being processed.
                </AlertDescription>
              </Alert>
            ) : isExpired ? (
              <>
                <Alert variant="destructive" className="w-full">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    QR code has expired. Please generate a new one to continue.
                  </AlertDescription>
                </Alert>
                <Button
                  onClick={generateQRCode}
                  className="w-full bg-[#5F1B2C] hover:bg-[#3d1620]"
                  size="lg"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate New QR Code
                </Button>
              </>
            ) : (
              <div className="w-full p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-blue-800">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>
                    Waiting for payment... Checking automatically every 3
                    seconds
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
