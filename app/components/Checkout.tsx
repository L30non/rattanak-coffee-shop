import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Truck, CheckCircle, MapPin, QrCode } from "lucide-react";
import { BakongPayment } from "@/app/components/BakongPayment";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Separator } from "@/app/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { useStore, Address } from "@/app/store/useStore";
import { useCreateOrder } from "@/app/hooks/useProducts";
import { toast } from "sonner";

interface CheckoutProps {
  onNavigate: (view: string) => void;
}

export function Checkout({ onNavigate }: CheckoutProps) {
  const cart = useStore((state) => state.cart);
  const clearCart = useStore((state) => state.clearCart);
  const user = useStore((state) => state.user);
  const addresses = useStore((state) => state.addresses);
  const setAddresses = useStore((state) => state.setAddresses);
  const createOrderMutation = useCreateOrder();

  const [step, setStep] = useState<"info" | "payment" | "success">("info");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "bakong">("cash");
  const [bakongVerified, setBakongVerified] = useState(false);
  const [bakongTransactionId, setBakongTransactionId] = useState<string | null>(
    null,
  );
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
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
  const shipping = subtotal > 100 ? 0 : 1;
  const tax = subtotal * 0.1; // 10% VAT
  const total = subtotal + shipping + tax;

  // Load saved addresses on mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch("/api/addresses");
        if (response.ok) {
          const data = await response.json();
          setAddresses(data.addresses || []);
          // Auto-select default address if exists
          const defaultAddr = data.addresses?.find(
            (a: Address) => a.is_default,
          );
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
            populateFormFromAddress(defaultAddr);
          }
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const populateFormFromAddress = (address: Address) => {
    setFormData((prev) => ({
      ...prev,
      phone: address.phone || prev.phone,
      address: `${address.street_line_1}${address.street_line_2 ? ", " + address.street_line_2 : ""}`,
      city: address.city,
      zipCode: address.zip_code,
    }));
  };

  const handleAddressSelect = (addressId: string) => {
    if (addressId === "manual") {
      setSelectedAddressId(null);
      setFormData((prev) => ({
        ...prev,
        phone: "",
        address: "",
        city: "",
        zipCode: "",
      }));
      return;
    }

    const selectedAddress = addresses.find((a) => a.id === addressId);
    if (selectedAddress) {
      setSelectedAddressId(addressId);
      populateFormFromAddress(selectedAddress);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // If user manually edits address fields, clear address selection
    // (phone is excluded since it can be changed independently)
    if (["address", "city", "zipCode"].includes(e.target.name)) {
      setSelectedAddressId(null);
    }
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

  const handleBakongVerified = (transactionId: string) => {
    setBakongVerified(true);
    setBakongTransactionId(transactionId);
  };

  const handleSubmitPayment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // For Bakong, ensure payment is verified first
    if (paymentMethod === "bakong" && !bakongVerified) {
      toast.error("Please complete and verify your Bakong payment first.");
      return;
    }

    setIsProcessing(true);

    try {
      const shippingAddress = `${formData.address}, ${formData.city}, ${formData.zipCode}`;

      const orderData = {
        user_id: user?.id || "",
        status:
          paymentMethod === "bakong"
            ? ("processing" as const)
            : ("pending" as const),
        total,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tax_amount: tax,
        shipping_cost: shipping,
        items: cart.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
      };

      await createOrderMutation.mutateAsync(orderData);

      clearCart();
      setStep("success");
      toast.success(
        paymentMethod === "bakong"
          ? "Payment received! Order placed successfully!"
          : "Order placed successfully!",
      );
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
      console.error("Order error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Auto-submit order once Bakong payment is verified
  useEffect(() => {
    if (bakongVerified && bakongTransactionId && paymentMethod === "bakong") {
      handleSubmitPayment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bakongVerified, bakongTransactionId]);

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
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-50 py-8"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-20">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="h-20 w-20 mx-auto mb-4 text-green-500" />
            </motion.div>
            <h2 className="text-3xl mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your order. We&apos;ll send you a confirmation email
              shortly.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => onNavigate("account")}
                className="bg-[#5F1B2C] hover:bg-[#4a1523]"
              >
                View Orders
              </Button>
              <Button variant="outline" onClick={() => onNavigate("products")}>
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
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
            <AnimatePresence mode="wait">
              {step === "info" ? (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
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

                        {/* Saved Address Selector */}
                        {addresses.length > 0 && (
                          <div>
                            <Label htmlFor="saved-address">
                              <MapPin className="inline h-4 w-4 mr-1" />
                              Use Saved Address
                            </Label>
                            <Select
                              value={selectedAddressId || "manual"}
                              onValueChange={handleAddressSelect}
                            >
                              <SelectTrigger id="saved-address">
                                <SelectValue placeholder="Select a saved address" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="manual">
                                  Enter address manually
                                </SelectItem>
                                {addresses.map((address) => (
                                  <SelectItem
                                    key={address.id}
                                    value={address.id}
                                  >
                                    {address.label || "Saved Address"} -{" "}
                                    {address.city},{" "}
                                    {address.state || address.zip_code}
                                    {address.is_default && " (Default)"}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

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
                          className="w-full bg-[#5F1B2C] hover:bg-[#4a1523]"
                        >
                          Continue to Payment
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Method</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Payment Method Selector */}
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setPaymentMethod("cash");
                            setBakongVerified(false);
                            setBakongTransactionId(null);
                          }}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            paymentMethod === "cash"
                              ? "border-[#5F1B2C] bg-rose-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Truck
                              className={`h-5 w-5 ${
                                paymentMethod === "cash"
                                  ? "text-[#5F1B2C]"
                                  : "text-gray-400"
                              }`}
                            />
                            <div>
                              <p
                                className={`font-medium text-sm ${
                                  paymentMethod === "cash"
                                    ? "text-[#3d1620]"
                                    : "text-gray-700"
                                }`}
                              >
                                Cash on Delivery
                              </p>
                              <p className="text-xs text-gray-500">
                                Pay when delivered
                              </p>
                            </div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setPaymentMethod("bakong");
                          }}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            paymentMethod === "bakong"
                              ? "border-[#5F1B2C] bg-rose-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <QrCode
                              className={`h-5 w-5 ${
                                paymentMethod === "bakong"
                                  ? "text-[#5F1B2C]"
                                  : "text-gray-400"
                              }`}
                            />
                            <div>
                              <p
                                className={`font-medium text-sm ${
                                  paymentMethod === "bakong"
                                    ? "text-[#3d1620]"
                                    : "text-gray-700"
                                }`}
                              >
                                Bakong KHQR
                              </p>
                              <p className="text-xs text-gray-500">
                                Scan &amp; pay instantly
                              </p>
                            </div>
                          </div>
                        </button>
                      </div>

                      {/* Payment Method Content */}
                      {paymentMethod === "cash" ? (
                        <form
                          onSubmit={handleSubmitPayment}
                          className="space-y-6"
                        >
                          <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg">
                            <div className="flex items-start gap-3">
                              <Truck className="h-5 w-5 text-[#5F1B2C] mt-0.5" />
                              <div>
                                <h4 className="font-medium text-[#3d1620]">
                                  Cash on Delivery
                                </h4>
                                <p className="text-sm text-[#5F1B2C] mt-1">
                                  Please prepare exact amount:{" "}
                                  <strong>${total.toFixed(2)}</strong>
                                </p>
                                <p className="text-xs text-gray-600 mt-2">
                                  Our delivery partner will collect payment when
                                  your order arrives.
                                </p>
                              </div>
                            </div>
                          </div>

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
                              className="flex-1 bg-[#5F1B2C] hover:bg-[#4a1523]"
                              disabled={isProcessing}
                            >
                              {isProcessing ? "Processing..." : "Place Order"}
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <div className="space-y-4">
                          <BakongPayment
                            amount={total}
                            onVerified={handleBakongVerified}
                          />

                          {isProcessing && (
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 py-2">
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#5F1B2C] border-t-transparent" />
                              Creating your order...
                            </div>
                          )}

                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setStep("info")}
                            className="w-full"
                            disabled={isProcessing}
                          >
                            Back to Shipping Info
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
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
                    <span className="text-gray-600">Tax (10% VAT)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-[#3d1620]">${total.toFixed(2)}</span>
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
