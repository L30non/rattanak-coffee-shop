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

interface RefundPolicyProps {
  onNavigate: (view: string) => void;
}

export function RefundPolicy({ onNavigate }: RefundPolicyProps) {
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
              <CardTitle className="text-3xl">Refund & Return Policy</CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                Last Updated: February 3, 2026
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-700">
                We want you to be completely satisfied with your purchase. If
                you&apos;re not happy, we&apos;re here to help with returns and
                refunds.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-8">
                <Card className="text-center p-4">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-[#5F1B2C]" />
                  <p className="text-sm font-medium">30 Days</p>
                  <p className="text-xs text-gray-600">Return Window</p>
                </Card>
                <Card className="text-center p-4">
                  <Package className="h-8 w-8 mx-auto mb-2 text-[#5F1B2C]" />
                  <p className="text-sm font-medium">Unopened</p>
                  <p className="text-xs text-gray-600">Products Only</p>
                </Card>
                <Card className="text-center p-4">
                  <RefreshCw className="h-8 w-8 mx-auto mb-2 text-[#5F1B2C]" />
                  <p className="text-sm font-medium">Full Refund</p>
                  <p className="text-xs text-gray-600">Or Exchange</p>
                </Card>
                <Card className="text-center p-4">
                  <XCircle className="h-8 w-8 mx-auto mb-2 text-[#5F1B2C]" />
                  <p className="text-sm font-medium">No Fees</p>
                  <p className="text-xs text-gray-600">For Returns</p>
                </Card>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>1. Return Eligibility</AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>
                      To be eligible for a return, your item must meet the
                      following criteria:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Purchased within the last 30 days</li>
                      <li>In its original, unopened packaging</li>
                      <li>In the same condition as when you received it</li>
                      <li>
                        Accompanied by proof of purchase (order number or
                        receipt)
                      </li>
                    </ul>
                    <p className="mt-4 font-medium">Non-Returnable Items:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Opened coffee beans or ground coffee</li>
                      <li>Perishable goods or ingredients</li>
                      <li>Gift cards</li>
                      <li>Sale or clearance items marked as final sale</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    2. How to Initiate a Return
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>To start a return, follow these steps:</p>
                    <ol className="list-decimal pl-6 space-y-2">
                      <li>
                        Contact our customer service team at
                        returns@rattanakcoffee.com or call +1 (555) 123-4567
                      </li>
                      <li>Provide your order number and reason for return</li>
                      <li>
                        You will receive a Return Authorization Number (RAN) and
                        instructions
                      </li>
                      <li>
                        Package the item securely in its original packaging, if
                        possible
                      </li>
                      <li>
                        Include the RAN and your order confirmation in the
                        package
                      </li>
                      <li>Ship the package to the address provided</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>3. Refund Process</AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>
                      Once we receive your return, we will inspect the item and
                      process your refund within 5-7 business days.
                    </p>
                    <p className="font-medium mt-4">Refund Timeline:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>
                        <strong>Inspection:</strong> 1-2 business days after we
                        receive the item
                      </li>
                      <li>
                        <strong>Approval:</strong> You&apos;ll receive an email
                        confirming your refund
                      </li>
                      <li>
                        <strong>Processing:</strong> 5-7 business days for the
                        refund to appear
                      </li>
                    </ul>
                    <p className="mt-4">
                      Refunds will be issued to the original payment method. For
                      cash on delivery orders, we will process a bank transfer
                      or provide store credit, based on your preference.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>4. Exchanges</AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>
                      If you&apos;d like to exchange an item for a different
                      product or size, please follow the return process and
                      place a new order for the desired item.
                    </p>
                    <p>
                      For defective or damaged items, we will expedite the
                      exchange process and cover any additional shipping costs.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>
                    5. Damaged or Defective Items
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>
                      If you receive a damaged or defective item, please contact
                      us immediately with:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Your order number</li>
                      <li>Photos of the damaged item and packaging</li>
                      <li>Description of the issue</li>
                    </ul>
                    <p className="mt-2">
                      We will arrange for a replacement or full refund,
                      including shipping costs, at no additional charge to you.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger>6. Shipping Costs</AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <ul className="list-disc pl-6 space-y-1">
                      <li>
                        <strong>Standard Returns:</strong> Customer is
                        responsible for return shipping costs
                      </li>
                      <li>
                        <strong>Damaged/Defective Items:</strong> We cover all
                        shipping costs
                      </li>
                      <li>
                        <strong>Wrong Item Sent:</strong> We cover all shipping
                        costs
                      </li>
                    </ul>
                    <p className="mt-2">
                      Original shipping costs are non-refundable unless the
                      return is due to our error.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7">
                  <AccordionTrigger>
                    7. Late or Missing Refunds
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>
                      If you haven&apos;t received your refund after 7 business
                      days:
                    </p>
                    <ol className="list-decimal pl-6 space-y-1">
                      <li>
                        Check your bank account or credit card statement again
                      </li>
                      <li>
                        Contact your bank or credit card company (processing
                        times vary)
                      </li>
                      <li>
                        If you&apos;ve done all of this and still haven&apos;t
                        received your refund, contact us at
                        refunds@rattanakcoffee.com
                      </li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8">
                  <AccordionTrigger>8. Cancellations</AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>
                      You can cancel your order free of charge if it hasn&apos;t
                      been shipped yet. Once your order is marked as
                      &quot;shipped,&quot; you&apos;ll need to follow the return
                      process.
                    </p>
                    <p>
                      To cancel an order, contact us immediately at
                      support@rattanakcoffee.com with your order number.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-9">
                  <AccordionTrigger>9. Contact Us</AccordionTrigger>
                  <AccordionContent className="text-gray-700 space-y-2">
                    <p>
                      If you have any questions about our refund policy, please
                      reach out:
                    </p>
                    <p className="font-medium">
                      Email: returns@rattanakcoffee.com
                      <br />
                      Phone: +1 (555) 123-4567
                      <br />
                      Hours: Monday-Friday, 9:00 AM - 6:00 PM EST
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
