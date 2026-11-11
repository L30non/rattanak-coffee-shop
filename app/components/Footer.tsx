import { Clock, Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { Separator } from "@/app/components/ui/separator";
import { useI18n } from "@/lib/i18n";

interface FooterProps {
  onNavigate: (view: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { t } = useI18n();

  return (
    <footer className="bg-brand-deep text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t("Rattanak Coffee Shop")}</h3>
            <p className="text-sm text-gray-300 mb-4">
              {t("Premium coffee beans, machines, and accessories for the perfect brew.")}
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/rattanakcoffeeroaster"
                className="hover:text-[#D4AF37] transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/rattanakcoffee/"
                className="hover:text-[#D4AF37] transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t("Quick Links")}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate("about")}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  {t("About Us")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("products")}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  {t("Shop Products")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("contact")}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  {t("Contact")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("business")}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  {t("Business")}
                </button>
              </li>
            </ul>
          </div>

          {/* Store Hours */}
          <div>
            <h4 className="font-semibold mb-4">{t("Store Hours")}</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  {t("Mon – Sat: 8:00 AM – 5:00 PM")}
                  <br />
                  {t("Sunday: Closed")}
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">{t("Contact Us")}</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  {t("#09 107BT, Sangkat Boeung Tumpun, Khan Mean Chey, Phnom Penh")}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+855 12 667 778</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>{t("info@rattanakcoffee.com")}</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-gray-600" />

        <div className="text-center text-sm text-gray-400 space-y-2">
          <p>
            {t("© {year} Rattanak Coffee Shop. All rights reserved.", {
              year: new Date().getFullYear(),
            })}
          </p>
          <p className="flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={() => onNavigate("privacy")}
              className="hover:text-[#D4AF37] transition-colors"
            >
              {t("Privacy Policy")}
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => onNavigate("terms")}
              className="hover:text-[#D4AF37] transition-colors"
            >
              {t("Terms of Service")}
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => onNavigate("refund")}
              className="hover:text-[#D4AF37] transition-colors"
            >
              {t("Refund Policy")}
            </button>
          </p>
        </div>
      </div>
    </footer>
  );
}
