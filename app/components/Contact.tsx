import { useState } from "react";
import { motion } from "framer-motion";
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

interface ContactProps {
  onNavigate: (view: string) => void;
}

export function Contact({ onNavigate }: ContactProps) {
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
      toast.success("Message sent! We'll get back to you soon.");
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-rose-100 max-w-2xl">
              Have questions about our products or need help starting your cafe?
              We&apos;d love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
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
                info: "+855 12 828 029",
                sub: "Mon - Sat, 8AM - 6PM",
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
                info: "Mon - Sat: 8:00 AM - 6:00 PM",
                sub: "Sunday: Closed",
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Card className="text-center border-none shadow-md hover:shadow-lg transition-shadow h-full">
                  <CardContent className="pt-6 pb-5">
                    <div className="bg-rose-50 p-3 rounded-full w-fit mx-auto mb-3">
                      <item.icon className="h-6 w-6 text-[#5F1B2C]" />
                    </div>
                    <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-2">
                      {item.title}
                    </h3>
                    <p className="font-medium text-[#3d1620] text-sm">
                      {item.info}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{item.sub}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Form + Map */}
      <section className="py-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-none shadow-lg">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <MessageSquare className="h-6 w-6 text-[#5F1B2C]" />
                    <h2 className="text-2xl font-bold text-[#3d1620]">
                      Send Us a Message
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
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5F1B2C] focus:border-transparent"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5F1B2C] focus:border-transparent"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                      >
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5F1B2C] focus:border-transparent"
                        placeholder="How can we help?"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5F1B2C] focus:border-transparent resize-none"
                        placeholder="Tell us about your inquiry..."
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#5F1B2C] hover:bg-[#4a1523] py-5"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Map + Social Links */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-6"
            >
              {/* Google Map */}
              <Card className="border-none shadow-lg flex-1 overflow-hidden">
                <CardContent className="p-0 h-full min-h-[400px]">
                  <iframe
                    title="Rattanak Coffee Shop Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3909.0!2d104.929!3d11.538!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDMyJzE2LjgiTiAxMDTCsDU1JzQ0LjQiRQ!5e0!3m2!1sen!2skh!4v1700000000000"
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
                  <h3 className="font-semibold text-lg text-[#3d1620] mb-4">
                    Connect With Us
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
                        Facebook
                      </span>
                    </a>
                    <a
                      href="https://t.me/rattanakcoffee"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-sky-50 hover:bg-sky-100 transition-colors"
                    >
                      <Send className="h-5 w-5 text-sky-600" />
                      <span className="text-sm font-medium text-sky-700">
                        Telegram
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
                        TikTok
                      </span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
