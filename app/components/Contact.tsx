import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { toast } from "sonner";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Send,
  MessageSquare,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface ContactProps {
  onNavigate: (view: string) => void;
}

export function Contact({ onNavigate }: ContactProps) {
  const { t } = useI18n();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success(t("Message sent! We'll get back to you soon."));
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("Contact Us")}</h1>
            <p className="text-xl text-brand-soft max-w-2xl">
              {t("Have questions about our products or need help starting your cafe? We'd love to hear from you.")}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: MapPin,
                title: "Visit Us",
                info: "#09 107BT, Sangkat Boeung Tumpun",
                sub: "Khan Mean Chey, Phnom Penh",
              },
              {
                icon: Phone,
                title: "Call Us",
                info: "+855 12 667 778",
                sub: "Mon - Sat, 8AM - 5PM",
              },
              {
                icon: Mail,
                title: "Email Us",
                info: "info@rattanakcoffee.com",
                sub: "We reply within 24 hours",
              },
              {
                icon: Clock,
                title: "Working Hours",
                info: "Mon - Sat: 8:00 AM - 5:00 PM",
                sub: "Sunday: Closed",
              },
            ].map((item) => (
              <div key={item.title}>
                <Card className="text-center border-none shadow-md hover:shadow-lg transition-shadow h-full">
                  <CardContent className="pt-6 pb-5">
                    <div className="bg-brand-tint p-3 rounded-full w-fit mx-auto mb-3">
                      <item.icon className="h-6 w-6 text-brand" />
                    </div>
                    <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-2">
                      {item.title}
                    </h3>
                    <p className="font-medium text-brand-deep text-sm">
                      {item.info}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{item.sub}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form + Map */}
      <section className="py-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div>
              <Card className="border-none shadow-lg">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <MessageSquare className="h-6 w-6 text-brand" />
                    <h2 className="text-2xl font-bold text-brand-deep">
                      {t("Send Us a Message")}
                    </h2>
                  </div>
                  <Separator className="mb-6" />

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                          {t("Your Name")}
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                          placeholder={t("John Doe")}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                          {t("Email Address")}
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                          placeholder={t("john@example.com")}
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                      >
                        {t("Subject")}
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                        placeholder={t("How can we help?")}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                      >
                        {t("Message")}
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent resize-none"
                        placeholder={t("Tell us about your inquiry...")}
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-brand hover:bg-brand-dark py-5"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Map + Social Links */}
            <div className="flex flex-col gap-6">
              {/* Google Map */}
              <Card className="border-none shadow-lg flex-1 overflow-hidden">
                <CardContent className="p-0 h-full min-h-[400px]">
                  <iframe
                    title={t("Rattanak Coffee Shop Location")}
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d393.4334456707434!2d104.9024206555716!3d11.536029783254826!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310950fadfd7b241%3A0x3de01509c6a9a539!2sRATTANAK%20COFFEE%20ROASTER!5e1!3m2!1sen!2sat!4v1785314647657!5m2!1sen!2sat"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: "400px" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg"
                  />
                </CardContent>
              </Card>

              {/* Social Media Links */}
              <Card className="border-none shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-brand-deep mb-4">
                    {t("Connect With Us")}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <a
                      href="https://www.facebook.com/rattanakcoffeeroaster"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      <Facebook className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">
                        {t("Facebook")}
                      </span>
                    </a>
                    <a
                      href="https://t.me/rattanak_coffee"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-sky-50 hover:bg-sky-100 transition-colors"
                    >
                      <Send className="h-5 w-5 text-sky-600" />
                      <span className="text-sm font-medium text-sky-700">
                        {t("Telegram")}
                      </span>
                    </a>
                    <a
                      href="https://www.tiktok.com/@rattanakcoffee"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">
                        {t("TikTok")}
                      </span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
