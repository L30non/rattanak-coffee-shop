import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Separator } from "@/app/components/ui/separator";

interface FooterProps {
  onNavigate: (view: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#3d1620] text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Rattanak Coffee Shop</h3>
            <p className="text-sm text-gray-300 mb-4">
              Premium coffee beans, machines, and accessories for the perfect
              brew.
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
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate("about")}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("products")}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Shop Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("contact")}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("blog")}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Blog
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate("terms")}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("privacy")}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("refund")}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Refund Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  #09 107BT, Sangkat Boeung Tumpun, Khan Mean Chey, Phnom Penh
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+855 12 828 029</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>info@rattanakcoffee.com</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-gray-600" />

        <div className="text-center text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} Rattanak Coffee Shop. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
