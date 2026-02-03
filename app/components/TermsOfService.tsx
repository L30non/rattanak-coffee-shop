import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import { ArrowLeft } from "lucide-react";

interface TermsOfServiceProps {
  onNavigate: (view: string) => void;
}

export function TermsOfService({ onNavigate }: TermsOfServiceProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => onNavigate("home")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Terms of Service</CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                Last Updated: February 3, 2026
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-700">
                Welcome to Rattanak Coffee Shop. By accessing or using our
                website and services, you agree to be bound by these Terms of
                Service.
              </p>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>1. Use of Service</AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>
                      You must be at least 18 years old to use our service. By
                      using our service, you represent and warrant that you meet
                      this age requirement.
                    </p>
                    <p>
                      You are responsible for maintaining the confidentiality of
                      your account and password. You agree to accept
                      responsibility for all activities that occur under your
                      account.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>2. Product Information</AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>
                      We strive to provide accurate product descriptions and
                      pricing. However, we do not warrant that product
                      descriptions or other content is accurate, complete,
                      reliable, current, or error-free.
                    </p>
                    <p>
                      All prices are in USD and are subject to change without
                      notice. We reserve the right to modify or discontinue
                      products at any time.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>3. Orders and Payment</AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>
                      We accept cash on delivery as our primary payment method.
                      Payment is due at the time of delivery.
                    </p>
                    <p>
                      We reserve the right to refuse or cancel any order for any
                      reason, including limitations on quantities available for
                      purchase, inaccuracies in product or pricing information,
                      or problems identified by our fraud detection systems.
                    </p>
                    <p>
                      A 10% VAT (Value Added Tax) is applied to all orders, and
                      shipping costs may apply for orders under $100.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>4. Shipping and Delivery</AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>
                      We aim to process and ship orders within 2-3 business
                      days. Delivery times vary based on your location.
                    </p>
                    <p>
                      You will receive a tracking number once your order has
                      been shipped. All shipping addresses must be complete and
                      accurate.
                    </p>
                    <p>
                      Free shipping is available for orders over $100. Orders
                      under $100 incur a $10 shipping fee.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>5. Returns and Refunds</AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>
                      Please refer to our Refund Policy for detailed information
                      about returns and refunds. Generally, we accept returns
                      within 30 days of delivery for unopened products.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger>6. Intellectual Property</AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>
                      All content on this website, including text, graphics,
                      logos, images, and software, is the property of Rattanak
                      Coffee Shop and is protected by international copyright
                      laws.
                    </p>
                    <p>
                      You may not reproduce, distribute, modify, create
                      derivative works of, or exploit any content without our
                      express written permission.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7">
                  <AccordionTrigger>
                    7. Limitation of Liability
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>
                      Rattanak Coffee Shop shall not be liable for any indirect,
                      incidental, special, consequential, or punitive damages
                      resulting from your use of or inability to use the
                      service.
                    </p>
                    <p>
                      Our total liability to you for all claims arising from or
                      related to the service shall not exceed the amount you
                      paid us in the past twelve months.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8">
                  <AccordionTrigger>8. Changes to Terms</AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>
                      We reserve the right to modify these Terms of Service at
                      any time. Changes will be effective immediately upon
                      posting to the website.
                    </p>
                    <p>
                      Your continued use of the service after changes are posted
                      constitutes your acceptance of the modified terms.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-9">
                  <AccordionTrigger>9. Contact Information</AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>
                      If you have any questions about these Terms of Service,
                      please contact us at:
                    </p>
                    <p className="font-medium">
                      Email: legal@rattanakcoffee.com
                      <br />
                      Phone: +1 (555) 123-4567
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
