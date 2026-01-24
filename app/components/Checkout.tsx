import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Truck,
  CheckCircle,
  QrCode,
  Smartphone,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Separator } from "@/app/components/ui/separator";
import { useStore, type PaymentMethod } from "@/app/store/useStore";
import { useCreateOrder } from "@/app/hooks/useProducts";
import { toast } from "sonner";
import {
  generateOrderKHQR,
  convertUSDtoKHR,
  formatCurrency,
  type KHQRResult,
} from "@/utils/bakong/khqr";
import { QRCodeSVG } from "qrcode.react";

interface CheckoutProps {
  onNavigate: (view: string) => void;
}

export function Checkout({ onNavigate }: CheckoutProps) {
  const cart = useStore((state) => state.cart);
  const clearCart = useStore((state) => state.clearCart);
  const addOrder = useStore((state) => state.addOrder);
  const user = useStore((state) => state.user);
  const createOrderMutation = useCreateOrder();

  const [step, setStep] = useState<"info" | "payment" | "success">("info");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bakong");
  const [khqrData, setKhqrData] = useState<KHQRResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  });

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  const totalKHR = convertUSDtoKHR(total);

  // Generate KHQR when payment step is reached and Bakong is selected
  useEffect(() => {
    if (step === "payment" && paymentMethod === "bakong") {
      const orderId = `ORD-${Date.now()}`;
      const qrData = generateOrderKHQR(total, orderId, "USD");
      setKhqrData(qrData);
    }
  }, [step, paymentMethod, total]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.zipCode
    ) {
      toast.error("Please fill in all shipping information");
      return;
    }
    setStep("payment");
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const shippingAddress = `${formData.address}, ${formData.city}, ${formData.zipCode}`;

      // Create order via API
      const orderData = {
        user_id: user?.id || "",
        status:
          paymentMethod === "cash"
            ? ("pending" as const)
            : ("processing" as const),
        total,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        items: cart.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
      };

      const createdOrder = await createOrderMutation.mutateAsync(orderData);

      // Add to local store for UI
      addOrder({
        ...createdOrder,
        items: cart,
      });

      // Clear cart
      clearCart();

      setStep("success");
      toast.success("Order placed successfully!");
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
      console.error("Order error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-20">
            <p className="text-lg mb-4">Please login to checkout</p>
            <Button onClick={() => onNavigate("login")}>Login</Button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && step !== "success") {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-20">
            <p className="text-lg mb-4">Your cart is empty</p>
            <Button onClick={() => onNavigate("products")}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-20">
            <CheckCircle className="h-20 w-20 mx-auto mb-4 text-green-500" />
            <h2 className="text-3xl mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your order. We&apos;ll send you a confirmation email
              shortly.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => onNavigate("account")}
                className="bg-amber-700 hover:bg-amber-800"
              >
                View Orders
              </Button>
              <Button variant="outline" onClick={() => onNavigate("products")}>
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => onNavigate("cart")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {step === "info" ? (
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitInfo} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code *</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-amber-700 hover:bg-amber-800"
                    >
                      Continue to Payment
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitPayment} className="space-y-6">
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(v) =>
                        setPaymentMethod(v as PaymentMethod)
                      }
                    >
                      <div
                        className={`flex items-center space-x-2 border rounded-lg p-4 ${paymentMethod === "bakong" ? "border-amber-500 bg-amber-50" : ""}`}
                      >
                        <RadioGroupItem value="bakong" id="bakong" />
                        <Label
                          htmlFor="bakong"
                          className="flex items-center gap-2 cursor-pointer flex-1"
                        >
                          <QrCode className="h-5 w-5 text-amber-700" />
                          <div>
                            <span className="font-medium">Bakong (KHQR)</span>
                            <p className="text-xs text-gray-500">
                              Scan with any banking app in Cambodia
                            </p>
                          </div>
                        </Label>
                      </div>

                      <div
                        className={`flex items-center space-x-2 border rounded-lg p-4 ${paymentMethod === "cash" ? "border-amber-500 bg-amber-50" : ""}`}
                      >
                        <RadioGroupItem value="cash" id="cash" />
                        <Label
                          htmlFor="cash"
                          className="flex items-center gap-2 cursor-pointer flex-1"
                        >
                          <Truck className="h-5 w-5 text-amber-700" />
                          <div>
                            <span className="font-medium">
                              Cash on Delivery
                            </span>
                            <p className="text-xs text-gray-500">
                              Pay when you receive your order
                            </p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>

                    {/* Bakong KHQR Code */}
                    {paymentMethod === "bakong" && khqrData && (
                      <div className="space-y-4 p-6 bg-white border-2 border-amber-200 rounded-xl">
                        <div className="text-center">
                          <h3 className="font-semibold text-lg mb-2">
                            Scan to Pay with Bakong
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Use any banking app (ABA, ACLEDA, Wing, etc.) to
                            scan this QR code
                          </p>
                        </div>

                        <div className="flex justify-center">
                          <div className="bg-white p-4 rounded-lg shadow-md">
                            <QRCodeSVG
                              value={khqrData.qrString}
                              size={200}
                              level="H"
                              includeMargin
                            />
                          </div>
                        </div>

                        <div className="text-center space-y-2">
                          <p className="text-2xl font-bold text-amber-900">
                            {formatCurrency(total, "USD")}
                          </p>
                          <p className="text-sm text-gray-500">
                            ≈ {formatCurrency(totalKHR, "KHR")}
                          </p>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                          <Smartphone className="h-4 w-4" />
                          <span>Or open Bakong app:</span>
                          <a
                            href={khqrData.deepLink}
                            className="text-amber-700 underline hover:text-amber-800"
                          >
                            Pay with Bakong
                          </a>
                        </div>

                        <p className="text-xs text-center text-gray-500">
                          After payment, click &quot;Place Order&quot; to
                          confirm your order. We&apos;ll verify your payment
                          within 24 hours.
                        </p>
                      </div>
                    )}

                    {/* Cash on Delivery Info */}
                    {paymentMethod === "cash" && (
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Truck className="h-5 w-5 text-amber-700 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-amber-900">
                              Cash on Delivery
                            </h4>
                            <p className="text-sm text-amber-700 mt-1">
                              Please prepare exact amount:{" "}
                              <strong>{formatCurrency(total, "USD")}</strong>
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                              Our delivery partner will collect payment when
                              your order arrives.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep("info")}
                        className="flex-1"
                        disabled={isProcessing}
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-amber-700 hover:bg-amber-800"
                        disabled={isProcessing}
                      >
                        {isProcessing ? "Processing..." : "Place Order"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="space-y-2">
                    {cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-gray-600">
                          {item.product.name} x{item.quantity}
                        </span>
                        <span className="font-medium">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-amber-900">${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
