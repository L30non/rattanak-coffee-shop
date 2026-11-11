import { ArrowLeft, Phone, Mail, Facebook, Send, Clock } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/app/components/ui/alert";
import { useStore } from "@/app/store/useStore";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";

interface CheckoutUnavailableProps {
  onNavigate: (view: string) => void;
}

export function CheckoutUnavailable({ onNavigate }: CheckoutUnavailableProps) {
  const { t } = useI18n();

  const cart = useStore((state) => state.cart);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-20">
            <p className="text-lg mb-4">{t("Your cart is empty")}</p>
            <Button onClick={() => onNavigate("products")}>
              {t("Continue Shopping")}
            </Button>
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
          {t("Back to Cart")}
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact / notice column */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("Contact Us to Place Your Order")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="bg-amber-50 border-amber-200">
                  <AlertTitle>
                    {t("Online payment is currently unavailable")}
                  </AlertTitle>
                  <AlertDescription>
                    {t("We're not able to take payments through the website right now. Please reach out to us directly using the items in your cart below, and we'll help you complete your order.")}
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-brand mt-0.5" />
                    <div>
                      <p className="font-medium">
                        <a
                          href="tel:+85512667778"
                          className="hover:text-brand transition-colors"
                        >
                          +855 12 667 778
                        </a>
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Clock className="h-3.5 w-3.5" />
                        {t("Mon - Sat, 8AM - 5PM")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-brand mt-0.5" />
                    <a
                      href="mailto:info@rattanakcoffee.com"
                      className="font-medium hover:text-brand transition-colors"
                    >
                      {t("info@rattanakcoffee.com")}
                    </a>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex gap-3">
                      <a
                        href="https://www.facebook.com/rattanakcoffeeroaster"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-700 hover:text-brand transition-colors"
                        aria-label={t("Facebook")}
                      >
                        <Facebook className="h-5 w-5" />
                        {t("Facebook")}
                      </a>
                      <a
                        href="https://t.me/rattanak_coffee"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-700 hover:text-brand transition-colors"
                        aria-label={t("Telegram")}
                      >
                        <Send className="h-5 w-5" />
                        {t("Telegram")}
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>{t("Your Order")}</CardTitle>
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
                          {formatPrice((item.product.price * item.quantity))}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>{t("Subtotal")}</span>
                    <span className="text-brand-deep">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {t("Final total (including shipping) will be confirmed when we get in touch with you.")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
