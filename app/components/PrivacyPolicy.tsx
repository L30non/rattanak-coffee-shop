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

interface PrivacyPolicyProps {
  onNavigate: (view: string) => void;
}

export function PrivacyPolicy({ onNavigate }: PrivacyPolicyProps) {
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
              <CardTitle className="text-3xl">Privacy Policy</CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                Last Updated: February 3, 2026
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-700">
                At Rattanak Coffee Shop, we take your privacy seriously. This
                Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you visit our website or make a
                purchase.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-8">
                <Card className="text-center p-4">
                  <Shield className="h-8 w-8 mx-auto mb-2 text-[#5F1B2C]" />
                  <p className="text-sm font-medium">Secure Data</p>
                </Card>
                <Card className="text-center p-4">
                  <Lock className="h-8 w-8 mx-auto mb-2 text-[#5F1B2C]" />
                  <p className="text-sm font-medium">Encrypted</p>
                </Card>
                <Card className="text-center p-4">
                  <Eye className="h-8 w-8 mx-auto mb-2 text-[#5F1B2C]" />
                  <p className="text-sm font-medium">Transparent</p>
                </Card>
                <Card className="text-center p-4">
                  <Database className="h-8 w-8 mx-auto mb-2 text-[#5F1B2C]" />
                  <p className="text-sm font-medium">Protected</p>
                </Card>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>1. Information We Collect</AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p className="font-medium">Personal Information:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Name and email address</li>
                      <li>Shipping address</li>
                      <li>Phone number</li>
                      <li>Order history and preferences</li>
                    </ul>
                    <p className="font-medium mt-4">Technical Information:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>IP address</li>
                      <li>Browser type and version</li>
                      <li>Device information</li>
                      <li>Usage data and analytics</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    2. How We Use Your Information
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>We use the information we collect to:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Process and fulfill your orders</li>
                      <li>Send order confirmations and tracking information</li>
                      <li>Communicate with you about products and services</li>
                      <li>Improve our website and customer experience</li>
                      <li>Detect and prevent fraud or security issues</li>
                      <li>Comply with legal obligations</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    3. Data Storage and Security
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>
                      We store your data securely using industry-standard
                      encryption and security measures. Your information is
                      stored on secure servers provided by Supabase, a trusted
                      third-party service provider.
                    </p>
                    <p>
                      We implement appropriate technical and organizational
                      measures to protect your personal data against
                      unauthorized access, alteration, disclosure, or
                      destruction.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    4. Sharing Your Information
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>We may share your information with:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>
                        <strong>Service Providers:</strong> Third-party vendors
                        who assist us in operating our website and conducting
                        business (e.g., payment processors, shipping companies)
                      </li>
                      <li>
                        <strong>Legal Requirements:</strong> When required by
                        law or to protect our rights
                      </li>
                      <li>
                        <strong>Business Transfers:</strong> In connection with
                        a merger, sale, or acquisition
                      </li>
                    </ul>
                    <p className="mt-2">
                      We do not sell or rent your personal information to third
                      parties for marketing purposes.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>5. Cookies and Tracking</AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>
                      We use cookies and similar tracking technologies to
                      improve your browsing experience and analyze website
                      traffic.
                    </p>
                    <p>
                      You can control cookies through your browser settings.
                      However, disabling cookies may affect the functionality of
                      our website.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger>6. Your Rights</AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>You have the right to:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Access your personal data</li>
                      <li>Correct inaccurate data</li>
                      <li>Request deletion of your data</li>
                      <li>Object to processing of your data</li>
                      <li>Request data portability</li>
                      <li>Withdraw consent at any time</li>
                    </ul>
                    <p className="mt-2">
                      To exercise these rights, please contact us at
                      privacy@rattanakcoffee.com
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7">
                  <AccordionTrigger>
                    7. Children&apos;s Privacy
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>
                      Our service is not intended for children under 18 years of
                      age. We do not knowingly collect personal information from
                      children. If you believe we have collected information
                      from a child, please contact us immediately.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8">
                  <AccordionTrigger>8. Changes to This Policy</AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>
                      We may update this Privacy Policy from time to time. We
                      will notify you of any changes by posting the new policy
                      on this page and updating the &quot;Last Updated&quot;
                      date.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-9">
                  <AccordionTrigger>9. Contact Us</AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>
                      If you have any questions about this Privacy Policy,
                      please contact us:
                    </p>
                    <p className="font-medium">
                      Email: privacy@rattanakcoffee.com
                      <br />
                      Phone: +1 (555) 123-4567
                      <br />
                      Address: 123 Coffee Street, Bean City, BC 12345
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
