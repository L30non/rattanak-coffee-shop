import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import {
  ArrowLeft,
  Store,
  GraduationCap,
  Wrench,
  Truck,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

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
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-tint to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-deep to-brand text-white py-16">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => onNavigate("home")}
            className="mb-6 text-white hover:text-brand-soft hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("Back to Home")}
          </Button>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t("Equipped with Everything to Help You Brew a Lucrative Business")}
            </h1>
            <p className="text-xl text-brand-soft max-w-2xl">
              {t("Product. Service. Consulting.")}
            </p>
          </div>
        </div>
      </section>

      {/* Business Offerings */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {businessOfferings.map((offering) => (
              <div key={offering.title}>
                <Card className="h-full border-none shadow-md hover:shadow-xl transition-shadow">
                  <CardContent className="pt-8 pb-6">
                    <div className="bg-brand-tint p-3 rounded-full w-fit mb-4">
                      <offering.icon className="h-6 w-6 text-brand" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-brand-deep">
                      {offering.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {offering.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-brand-dark to-brand text-white">
        <div className="container mx-auto px-4 text-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">
              {t("Ready to Grow Your Coffee Business?")}
            </h2>
            <p className="text-brand-soft mb-8 max-w-xl mx-auto">
              {t("Follow us on social media for the latest updates, or get in touch to learn more about our products and services.")}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://www.facebook.com/rattanakcoffeeroaster"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-white text-brand-deep hover:bg-brand-tint"
                >
                  {t("Follow on Facebook")}
                </Button>
              </a>
              <a
                href="https://t.me/rattanak_coffee"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white bg-white/10 hover:bg-white hover:text-brand-deep"
                >
                  {t("Join Telegram")}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
