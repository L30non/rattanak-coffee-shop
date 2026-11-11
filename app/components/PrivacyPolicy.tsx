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
import { ArrowLeft, Shield, Lock, Eye, Database } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface PrivacyPolicyProps {
  onNavigate: (view: string) => void;
}

export function PrivacyPolicy({ onNavigate }: PrivacyPolicyProps) {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => onNavigate("home")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("Back to Home")}
        </Button>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{t("Privacy Policy")}</CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                {t("Last Updated: February 3, 2026")}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-700">
                {t("At Rattanak Coffee Shop, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase.")}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-8">
                <Card className="text-center p-4">
                  <Shield className="h-8 w-8 mx-auto mb-2 text-brand" />
                  <p className="text-sm font-medium">{t("Secure Data")}</p>
                </Card>
                <Card className="text-center p-4">
                  <Lock className="h-8 w-8 mx-auto mb-2 text-brand" />
                  <p className="text-sm font-medium">{t("Encrypted")}</p>
                </Card>
                <Card className="text-center p-4">
                  <Eye className="h-8 w-8 mx-auto mb-2 text-brand" />
                  <p className="text-sm font-medium">{t("Transparent")}</p>
                </Card>
                <Card className="text-center p-4">
                  <Database className="h-8 w-8 mx-auto mb-2 text-brand" />
                  <p className="text-sm font-medium">{t("Protected")}</p>
                </Card>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>{t("1. Information We Collect")}</AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p className="font-medium">{t("Personal Information:")}</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>{t("Name and email address")}</li>
                      <li>{t("Shipping address")}</li>
                      <li>{t("Phone number")}</li>
                      <li>{t("Order history and preferences")}</li>
                    </ul>
                    <p className="font-medium mt-4">{t("Technical Information:")}</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>{t("IP address")}</li>
                      <li>{t("Browser type and version")}</li>
                      <li>{t("Device information")}</li>
                      <li>{t("Usage data and analytics")}</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    {t("2. How We Use Your Information")}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>{t("We use the information we collect to:")}</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>{t("Process and fulfill your orders")}</li>
                      <li>{t("Send order confirmations and tracking information")}</li>
                      <li>{t("Communicate with you about products and services")}</li>
                      <li>{t("Improve our website and customer experience")}</li>
                      <li>{t("Detect and prevent fraud or security issues")}</li>
                      <li>{t("Comply with legal obligations")}</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    {t("3. Data Storage and Security")}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>
                      {t("We store your data securely using industry-standard encryption and security measures. Your information is stored on secure servers provided by Supabase, a trusted third-party service provider.")}
                    </p>
                    <p>
                      {t("We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.")}
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    {t("4. Sharing Your Information")}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>{t("We may share your information with:")}</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>
                        <strong>{t("Service Providers:")}</strong> {t("Third-party vendors who assist us in operating our website and conducting business (e.g., payment processors, shipping companies)")}
                      </li>
                      <li>
                        <strong>{t("Legal Requirements:")}</strong> {t("When required by law or to protect our rights")}
                      </li>
                      <li>
                        <strong>{t("Business Transfers:")}</strong> {t("In connection with a merger, sale, or acquisition")}
                      </li>
                    </ul>
                    <p className="mt-2">
                      {t("We do not sell or rent your personal information to third parties for marketing purposes.")}
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>{t("5. Cookies and Tracking")}</AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>
                      {t("We use cookies and similar tracking technologies to improve your browsing experience and analyze website traffic.")}
                    </p>
                    <p>
                      {t("You can control cookies through your browser settings. However, disabling cookies may affect the functionality of our website.")}
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger>{t("6. Your Rights")}</AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>{t("You have the right to:")}</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>{t("Access your personal data")}</li>
                      <li>{t("Correct inaccurate data")}</li>
                      <li>{t("Request deletion of your data")}</li>
                      <li>{t("Object to processing of your data")}</li>
                      <li>{t("Request data portability")}</li>
                      <li>{t("Withdraw consent at any time")}</li>
                    </ul>
                    <p className="mt-2">
                      {t("To exercise these rights, please contact us at privacy@rattanakcoffee.com")}
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7">
                  <AccordionTrigger>
                    {t("7. Children's Privacy")}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>
                      {t("Our service is not intended for children under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.")}
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8">
                  <AccordionTrigger>{t("8. Changes to This Policy")}</AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>
                      {t("We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the \"Last Updated\" date.")}
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-9">
                  <AccordionTrigger>{t("9. Contact Us")}</AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>
                      {t("If you have any questions about this Privacy Policy, please contact us:")}
                    </p>
                    <p className="font-medium">
                      {t("Email: privacy@rattanakcoffee.com")}
                      <br />
                      {t("Phone: +1 (555) 123-4567")}
                      <br />
                      {t("Address: 123 Coffee Street, Bean City, BC 12345")}
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
