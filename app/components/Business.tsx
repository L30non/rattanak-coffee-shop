import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import {
  ArrowLeft,
  Store,
  GraduationCap,
  Wrench,
  Truck,
} from "lucide-react";

interface BusinessProps {
  onNavigate: (view: string) => void;
}

const businessOfferings = [
  {
    icon: Store,
    title: "Open Your First Café",
    description:
      "Our hardworking team is the driving force behind numerous successful independent coffee shop owners. You too can be the next go-to brewery in town.",
  },
  {
    icon: GraduationCap,
    title: "Barista Training",
    description:
      "Designed to turn passion into a real profession — coffee enthusiasts learn the skills to become successful baristas, appreciating taste profiles and mastering brewing techniques.",
  },
  {
    icon: Wrench,
    title: "Repair & Maintenance",
    description:
      "Our fully integrated solution has you covered even when things don't go according to plan. Machine broke down? Give us a call — our expert technicians will visit or bring it in for repair.",
  },
  {
    icon: Truck,
    title: "Delivery",
    description:
      "Our equipment is promptly delivered, ensuring speed and convenience, whether within the city or to the provinces.",
  },
];

export function Business({ onNavigate }: BusinessProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#3d1620] to-[#5F1B2C] text-white py-16">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => onNavigate("home")}
            className="mb-6 text-white hover:text-rose-200 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Equipped with Everything to Help You Brew a Lucrative Business
            </h1>
            <p className="text-xl text-rose-100 max-w-2xl">
              Product. Service. Consulting.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Business Offerings */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {businessOfferings.map((offering) => (
              <motion.div
                key={offering.title}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-none shadow-md hover:shadow-xl transition-shadow">
                  <CardContent className="pt-8 pb-6">
                    <div className="bg-rose-50 p-3 rounded-full w-fit mb-4">
                      <offering.icon className="h-6 w-6 text-[#5F1B2C]" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-[#3d1620]">
                      {offering.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {offering.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[#4a1523] to-[#5F1B2C] text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to Grow Your Coffee Business?
            </h2>
            <p className="text-rose-100 mb-8 max-w-xl mx-auto">
              Follow us on social media for the latest updates, or get in
              touch to learn more about our products and services.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://www.facebook.com/rattanakcoffeeroaster"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-white text-[#3d1620] hover:bg-rose-50"
                >
                  Follow on Facebook
                </Button>
              </a>
              <a
                href="https://t.me/rattanakcoffee"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white bg-white/10 hover:bg-white hover:text-[#3d1620]"
                >
                  Join Telegram
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
