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
  Clock,
} from "lucide-react";

interface AboutUsProps {
  onNavigate: (view: string) => void;
}

const milestones = [
  {
    year: "2015",
    title: "The Beginning",
    description:
      "Rattanak Coffee Shop was founded in Phnom Penh with a simple mission: to bring premium coffee culture to Cambodia. Starting as a small roastery, we began sourcing and roasting specialty beans from local farms.",
  },
  {
    year: "2017",
    title: "Growing Roots",
    description:
      "We expanded our operations and started supplying freshly roasted beans to cafes and restaurants across Phnom Penh. Our dedication to quality quickly built a loyal customer base.",
  },
  {
    year: "2019",
    title: "Expanding Horizons",
    description:
      "We introduced a full range of coffee machines, accessories, and ingredients to help aspiring cafe owners start their journey. Rattanak became a one-stop shop for all things coffee.",
  },
  {
    year: "2021",
    title: "Digital Transformation",
    description:
      "We launched our online store, making it easier for customers across Cambodia to access premium coffee products. Our delivery network grew to serve customers nationwide.",
  },
  {
    year: "2023",
    title: "Community & Education",
    description:
      "We began hosting barista training workshops and coffee tasting events, building a vibrant community of coffee enthusiasts and professionals.",
  },
  {
    year: "2025",
    title: "The Future",
    description:
      "Today, Rattanak Coffee continues to grow, driven by our passion for quality and our commitment to supporting Cambodia's coffee industry from farm to cup.",
  },
];

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

const teamMembers = [
  {
    name: "Hong Rattanak",
    role: "Founder & CEO",
    description:
      "With a deep passion for coffee and years of experience in the industry, Rattanak founded the company to share premium coffee culture with Cambodia.",
  },
  {
    name: "Coffee Roasting Team",
    role: "Master Roasters",
    description:
      "Our skilled roasting team carefully crafts each batch to bring out the best flavors from every origin.",
  },
  {
    name: "Customer Support",
    role: "Service Excellence",
    description:
      "Our dedicated team ensures every customer receives personalized guidance and support.",
  },
];

export function AboutUs({ onNavigate }: AboutUsProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#3d1620] to-[#5F1B2C] text-white">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://amsvlqivarurifjhboef.supabase.co/storage/v1/object/public/Images/branding/brownroaster.jpg"
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
              The Starting Point of Your Cafe Journey &mdash; Rattanak Coffee
              Shop has been serving premium coffee products and empowering cafe
              owners across Cambodia since 2015.
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
                Rattanak Coffee Shop is a Phnom Penh-based coffee company
                dedicated to providing everything you need to start and run a
                successful cafe. From premium roasted beans to professional-grade
                machines, quality accessories, and essential ingredients, we are
                your trusted partner in the coffee business. Our goal is to make
                specialty coffee accessible and to support the growing cafe
                culture in Cambodia.
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

      {/* Our Values */}
      <section className="py-16 bg-white">
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
                    <p className="text-sm text-gray-600">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-16 bg-rose-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#3d1620]">
              Our Journey
            </h2>
            <Separator className="w-24 mx-auto mb-6 bg-[#5F1B2C]" />
            <p className="text-gray-600 max-w-2xl mx-auto">
              From a small roastery to Cambodia&apos;s trusted coffee partner
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-6 mb-8"
              >
                <div className="flex flex-col items-center">
                  <div className="bg-[#5F1B2C] text-white rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 h-full bg-[#5F1B2C]/20 mt-2" />
                  )}
                </div>
                <Card className="flex-1 border-none shadow-md">
                  <CardContent className="pt-6">
                    <span className="text-sm font-bold text-[#5F1B2C] uppercase tracking-wide">
                      {milestone.year}
                    </span>
                    <h3 className="text-xl font-semibold mt-1 mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {milestone.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
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
              Our Team
            </h2>
            <Separator className="w-24 mx-auto mb-6 bg-[#5F1B2C]" />
            <p className="text-gray-600 max-w-2xl mx-auto">
              The passionate people behind Rattanak Coffee
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
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
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Card className="text-center border-none shadow-md hover:shadow-lg transition-shadow h-full">
                  <CardContent className="pt-8 pb-6">
                    <div className="bg-[#5F1B2C] text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <p className="text-sm text-[#5F1B2C] font-medium mb-3">
                      {member.role}
                    </p>
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
