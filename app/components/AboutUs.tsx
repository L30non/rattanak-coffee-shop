import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import {
  ArrowLeft,
  Coffee,
  Users,
  Award,
  Heart,
  Target,
  Eye,
  Compass,
} from "lucide-react";

interface AboutUsProps {
  onNavigate: (view: string) => void;
}

const values = [
  {
    icon: Coffee,
    title: "Quality First",
    description:
      "We source only the finest beans and products, ensuring every cup meets our high standards.",
  },
  {
    icon: Heart,
    title: "Passion Driven",
    description:
      "Our love for coffee drives everything we do, from sourcing to roasting to serving.",
  },
  {
    icon: Users,
    title: "Community Focused",
    description:
      "We believe in building connections through coffee, supporting local farmers and baristas.",
  },
  {
    icon: Target,
    title: "Sustainability",
    description:
      "We are committed to sustainable practices that benefit our community and environment.",
  },
];

interface TeamMember {
  name: string;
  role: string;
  image: string; // full URL or Supabase storage path; empty string → initials fallback
  description: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Ou Senghong",
    role: "Founder & CEO",
    image:
      "https://qboxqdnuoqpsrmqtaaaf.supabase.co/storage/v1/object/public/Images/for%20websites/OuSengHongImage.jpg",
    description:
      "Back in 1997, when I was in my early twenties and roasting coffee with my bare hands, I had a vision that the coffee industry in Cambodia would be filled with great opportunities. To me, coffee is an opportunity to create meaning — I want more people to enjoy and appreciate a great cup of coffee, well roasted and masterfully brewed. By amplifying the greatness of local coffee beans, I hope to contribute to the growing collaboration with local farmers and the rising demand for Cambodian coffee.",
  },
];

export function AboutUs({ onNavigate }: AboutUsProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#3d1620] to-[#5F1B2C] text-white">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://qboxqdnuoqpsrmqtaaaf.supabase.co/storage/v1/object/public/Images/branding/brownroaster.jpg"
            alt="Coffee roasting background"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#3d1620]/90 to-[#5F1B2C]/85" />
        </div>

        <div className="container relative z-10 mx-auto px-4 py-20">
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
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
            <p className="text-xl text-rose-100">
              Offering excellence in taste and quality. Rattanak Coffee offers
              more than just coffee &mdash; since 1997, we&apos;re committed to
              consistency, genuine taste, and quality in every cup.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#3d1620]">
                Who We Are
              </h2>
              <Separator className="w-24 mx-auto mb-6 bg-[#5F1B2C]" />
              <p className="text-gray-700 text-lg leading-relaxed">
                Rattanak Coffee offers more than just coffee. We are committed
                to our customers! Roasting coffee since 1997, we&apos;re known
                for our consistency of genuine taste and quality. Since 2015,
                our coffee beans have been certified by the Institute of
                Standards of Cambodia and recognized as chemical-free,
                preservative-free, and free of added coloring. Our coffee is
                made by the people, for the people &mdash; for everyone, and
                every palate, for the greatness in every sip. Today, Rattanak
                Coffee provides fully integrated services for all your coffee
                needs, from beans to machinery to business solutions.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15 },
                },
              }}
            >
              {[
                {
                  icon: Award,
                  stat: "10+",
                  label: "Years of Experience",
                },
                {
                  icon: Users,
                  stat: "500+",
                  label: "Happy Customers",
                },
                {
                  icon: Coffee,
                  stat: "100+",
                  label: "Products Available",
                },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Card className="text-center border-none shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="pt-8 pb-6">
                      <div className="bg-rose-50 p-4 rounded-full w-fit mx-auto mb-4">
                        <item.icon className="h-8 w-8 text-[#5F1B2C]" />
                      </div>
                      <p className="text-3xl font-bold text-[#5F1B2C] mb-1">
                        {item.stat}
                      </p>
                      <p className="text-gray-600">{item.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15 },
              },
            }}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Card className="h-full border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 pb-6">
                  <div className="bg-rose-50 p-3 rounded-full w-fit mb-4">
                    <Eye className="h-6 w-6 text-[#5F1B2C]" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3 text-[#3d1620]">
                    Vision
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    Roasting greatness since 1997 with over 20 years of
                    experience, Rattanak Coffee is an established coffee roaster
                    trusted by even the most demanding business partners.
                    Certified by the Institute of Standards of Cambodia since
                    2015, our coffee beans meet international standards &mdash;
                    free from chemicals, flavorings, preservatives, and
                    colorings. Our three best sellers: Bronze, Titanium, and
                    Platinum.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Card className="h-full border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 pb-6">
                  <div className="bg-rose-50 p-3 rounded-full w-fit mb-4">
                    <Compass className="h-6 w-6 text-[#5F1B2C]" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3 text-[#3d1620]">
                    Mission
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    The coffee industry is ever-growing, and we want to capture
                    this opportunity to amplify the competitiveness of local
                    coffee beans. Using our expertise in roasting and business
                    connections, we aim to increase the export of local coffee
                    beans to international markets. We fulfill all your coffee
                    needs by crafting specialty blends for your signature taste,
                    distributing coffee machines for every standard, and
                    providing barista training for businesses.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-rose-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#3d1620]">
              Our Values
            </h2>
            <Separator className="w-24 mx-auto mb-6 bg-[#5F1B2C]" />
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at Rattanak Coffee
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {values.map((value) => (
              <motion.div
                key={value.title}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Card className="h-full border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 text-center">
                    <div className="bg-rose-50 p-3 rounded-full w-fit mx-auto mb-4">
                      <value.icon className="h-6 w-6 text-[#5F1B2C]" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#3d1620]">
              Meet The Founder
            </h2>
            <Separator className="w-24 mx-auto mb-6 bg-[#5F1B2C]" />
            <p className="text-gray-600 max-w-2xl mx-auto">
              The passionate people behind Rattanak Coffee
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15 },
              },
            }}
          >
            {teamMembers.map((member) => (
              <motion.div
                key={member.name}
                className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)] max-w-sm"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Card className="group overflow-hidden gap-0 border-none shadow-md hover:shadow-xl transition-shadow h-full">
                  <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                    {member.image ? (
                      <ImageWithFallback
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#5F1B2C] text-white flex items-center justify-center">
                        <span className="text-5xl font-bold">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold text-xl text-[#3d1620]">
                      {member.name}
                    </h3>
                    <p className="text-[#5F1B2C] font-medium mb-4">
                      {member.role}
                    </p>
                    <Separator className="w-16 mx-auto mb-4 bg-[#5F1B2C]" />
                    <p className="text-sm text-gray-600">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#4a1523] to-[#5F1B2C] text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Coffee Journey?
            </h2>
            <p className="text-xl mb-8 text-rose-100 max-w-2xl mx-auto">
              Explore our range of premium coffee products and let us help you
              build the cafe of your dreams.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => onNavigate("products")}
                className="bg-white text-[#3d1620] hover:bg-rose-50"
              >
                Shop Products
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate("contact")}
                className="border-white text-white bg-white/10 hover:bg-white hover:text-[#3d1620]"
              >
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
