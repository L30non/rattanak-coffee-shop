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
import { ArrowLeft, RefreshCw, Package, Clock, XCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface RefundPolicyProps {
  onNavigate: (view: string) => void;
}

export function RefundPolicy({ onNavigate }: RefundPolicyProps) {
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
              <CardTitle className="text-3xl">{t("Refund & Return Policy")}</CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                {t("Last Updated: February 3, 2026")}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-700">
                {t("We want you to be completely satisfied with your purchase. If you're not happy, we're here to help with returns and refunds.")}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-8">
                <Card className="text-center p-4">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-brand" />
                  <p className="text-sm font-medium">{t("30 Days")}</p>
                  <p className="text-xs text-gray-600">{t("Return Window")}</p>
                </Card>
                <Card className="text-center p-4">
                  <Package className="h-8 w-8 mx-auto mb-2 text-brand" />
                  <p className="text-sm font-medium">{t("Unopened")}</p>
                  <p className="text-xs text-gray-600">{t("Products Only")}</p>
                </Card>
                <Card className="text-center p-4">
                  <RefreshCw className="h-8 w-8 mx-auto mb-2 text-brand" />
                  <p className="text-sm font-medium">{t("Full Refund")}</p>
                  <p className="text-xs text-gray-600">{t("Or Exchange")}</p>
                </Card>
                <Card className="text-center p-4">
                  <XCircle className="h-8 w-8 mx-auto mb-2 text-brand" />
                  <p className="text-sm font-medium">{t("No Fees")}</p>
                  <p className="text-xs text-gray-600">{t("For Returns")}</p>
                </Card>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>{t("1. Return Eligibility")}</AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>
                      {t("To be eligible for a return, your item must meet the following criteria:")}
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>{t("Purchased within the last 30 days")}</li>
                      <li>{t("In its original, unopened packaging")}</li>
                      <li>{t("In the same condition as when you received it")}</li>
                      <li>
                        {t("Accompanied by proof of purchase (order number or receipt)")}
                      </li>
                    </ul>
                    <p className="mt-4 font-medium">{t("Non-Returnable Items:")}</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>{t("Opened coffee beans or ground coffee")}</li>
                      <li>{t("Perishable goods or ingredients")}</li>
                      <li>{t("Gift cards")}</li>
                      <li>{t("Sale or clearance items marked as final sale")}</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    {t("2. How to Initiate a Return")}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>{t("To start a return, follow these steps:")}</p>
                    <ol className="list-decimal pl-6 space-y-2">
                      <li>
                        {t("Contact our customer service team at returns@rattanakcoffee.com or call +1 (555) 123-4567")}
                      </li>
                      <li>{t("Provide your order number and reason for return")}</li>
                      <li>
                        {t("You will receive a Return Authorization Number (RAN) and instructions")}
                      </li>
                      <li>
                        {t("Package the item securely in its original packaging, if possible")}
                      </li>
                      <li>
                        {t("Include the RAN and your order confirmation in the package")}
                      </li>
                      <li>{t("Ship the package to the address provided")}</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>{t("3. Refund Process")}</AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>
                      {t("Once we receive your return, we will inspect the item and process your refund within 5-7 business days.")}
                    </p>
                    <p className="font-medium mt-4">{t("Refund Timeline:")}</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>
                        <strong>{t("Inspection:")}</strong> {t("1-2 business days after we receive the item")}
                      </li>
                      <li>
                        <strong>{t("Approval:")}</strong> {t("You'll receive an email confirming your refund")}
                      </li>
                      <li>
                        <strong>{t("Processing:")}</strong> {t("5-7 business days for the refund to appear")}
                      </li>
                    </ul>
                    <p className="mt-4">
                      {t("Refunds will be issued to the original payment method. For cash on delivery orders, we will process a bank transfer or provide store credit, based on your preference.")}
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>{t("4. Exchanges")}</AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>
                      {t("If you'd like to exchange an item for a different product or size, please follow the return process and place a new order for the desired item.")}
                    </p>
                    <p>
                      {t("For defective or damaged items, we will expedite the exchange process and cover any additional shipping costs.")}
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>
                    {t("5. Damaged or Defective Items")}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>
                      {t("If you receive a damaged or defective item, please contact us immediately with:")}
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>{t("Your order number")}</li>
                      <li>{t("Photos of the damaged item and packaging")}</li>
                      <li>{t("Description of the issue")}</li>
                    </ul>
                    <p className="mt-2">
                      {t("We will arrange for a replacement or full refund, including shipping costs, at no additional charge to you.")}
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger>{t("6. Shipping Costs")}</AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <ul className="list-disc pl-6 space-y-1">
                      <li>
                        <strong>{t("Standard Returns:")}</strong> {t("Customer is responsible for return shipping costs")}
                      </li>
                      <li>
                        <strong>{t("Damaged/Defective Items:")}</strong> {t("We cover all shipping costs")}
                      </li>
                      <li>
                        <strong>{t("Wrong Item Sent:")}</strong> {t("We cover all shipping costs")}
                      </li>
                    </ul>
                    <p className="mt-2">
                      {t("Original shipping costs are non-refundable unless the return is due to our error.")}
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7">
                  <AccordionTrigger>
                    {t("7. Late or Missing Refunds")}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>
                      {t("If you haven't received your refund after 7 business days:")}
                    </p>
                    <ol className="list-decimal pl-6 space-y-1">
                      <li>
                        {t("Check your bank account or credit card statement again")}
                      </li>
                      <li>
                        {t("Contact your bank or credit card company (processing times vary)")}
                      </li>
                      <li>
                        {t("If you've done all of this and still haven't received your refund, contact us at refunds@rattanakcoffee.com")}
                      </li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8">
                  <AccordionTrigger>{t("8. Cancellations")}</AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>
                      {t("You can cancel your order free of charge if it hasn't been shipped yet. Once your order is marked as \"shipped,\" you'll need to follow the return process.")}
                    </p>
                    <p>
                      {t("To cancel an order, contact us immediately at support@rattanakcoffee.com with your order number.")}
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-9">
                  <AccordionTrigger>{t("9. Contact Us")}</AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>
                      {t("If you have any questions about our refund policy, please reach out:")}
                    </p>
                    <p className="font-medium">
                      {t("Email: returns@rattanakcoffee.com")}
                      <br />
                      {t("Phone: +1 (555) 123-4567")}
                      <br />
                      {t("Hours: Monday-Friday, 9:00 AM - 6:00 PM EST")}
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
