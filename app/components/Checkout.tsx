import { useState } from 'react';
import { ArrowLeft, CreditCard, Wallet, DollarSign, CheckCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Separator } from '@/app/components/ui/separator';
import { useStore } from '@/app/store/useStore';
import { toast } from 'sonner';

interface CheckoutProps {
  onNavigate: (view: string) => void;
}

export function Checkout({ onNavigate }: CheckoutProps) {
  const cart = useStore((state) => state.cart);
  const placeOrder = useStore((state) => state.placeOrder);
  const user = useStore((state) => state.user);
  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.zipCode) {
      toast.error('Please fill in all shipping information');
      return;
    }
    setStep('payment');
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate payment processing
    if (paymentMethod === 'credit-card') {
      if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCvv) {
        toast.error('Please fill in all payment information');
        return;
      }
    }

    // Place order
    placeOrder({
      items: cart,
      total,
      status: 'processing',
      shippingAddress: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
      paymentMethod
    });

    setStep('success');
    toast.success('Order placed successfully!');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-20">
            <p className="text-lg mb-4">Please login to checkout</p>
            <Button onClick={() => onNavigate('login')}>Login</Button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-20">
            <p className="text-lg mb-4">Your cart is empty</p>
            <Button onClick={() => onNavigate('products')}>Continue Shopping</Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-20">
            <CheckCircle className="h-20 w-20 mx-auto mb-4 text-green-500" />
            <h2 className="text-3xl mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your order. We'll send you a confirmation email shortly.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => onNavigate('account')} className="bg-amber-700 hover:bg-amber-800">
                View Orders
              </Button>
              <Button variant="outline" onClick={() => onNavigate('products')}>
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
        <Button variant="ghost" onClick={() => onNavigate('cart')} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {step === 'info' ? (
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

                    <Button type="submit" className="w-full bg-amber-700 hover:bg-amber-800">
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
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2 border rounded-lg p-4">
                        <RadioGroupItem value="credit-card" id="credit-card" />
                        <Label htmlFor="credit-card" className="flex items-center gap-2 cursor-pointer flex-1">
                          <CreditCard className="h-5 w-5" />
                          Credit/Debit Card
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2 border rounded-lg p-4">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer flex-1">
                          <Wallet className="h-5 w-5" />
                          PayPal
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2 border rounded-lg p-4">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer flex-1">
                          <DollarSign className="h-5 w-5" />
                          Cash on Delivery
                        </Label>
                      </div>
                    </RadioGroup>

                    {paymentMethod === 'credit-card' && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardNumber">Card Number *</Label>
                          <Input
                            id="cardNumber"
                            name="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="cardExpiry">Expiry Date *</Label>
                            <Input
                              id="cardExpiry"
                              name="cardExpiry"
                              placeholder="MM/YY"
                              value={formData.cardExpiry}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="cardCvv">CVV *</Label>
                            <Input
                              id="cardCvv"
                              name="cardCvv"
                              placeholder="123"
                              value={formData.cardCvv}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep('info')}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button type="submit" className="flex-1 bg-amber-700 hover:bg-amber-800">
                        Place Order
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
                    {cart.map(item => (
                      <div key={item.product.id} className="flex justify-between text-sm">
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
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
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