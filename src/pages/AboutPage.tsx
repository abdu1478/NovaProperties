import { TeamSection } from "@/components/TeamSection";
// import { TestimonialsSection } from "@/components/TestimonialsSection";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Eye, History } from "lucide-react";
import officeBuildingImage from "@/assets/office-building.jpg";
import { useEffect, useState } from "react";
import { fetchTestimonials, type Testimonial } from "@/utils/api";
import TestimonialsSection from "@/components/Shared/TestimonialCard";
import { motion } from "framer-motion";
import AnimatedCounter from "@/components/AnimatedCounter";

export default function About() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  useEffect(() => {
    const getTestimonials = async () => {
      try {
        const data = await fetchTestimonials();
        setTestimonials(data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };
    getTestimonials();
  }, []);
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.section
        className="relative py-24 bg-gradient-to-br from-primary/5 to-secondary/10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.5, 1, 0.8, 1] }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-foreground mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              About Nova Properties
            </motion.h1>

            <motion.div
              className="space-y-6 text-lg md:text-xl text-muted-foreground leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <p>
                For over a decade, Nova Properties has been the premier partner
                in luxury real estate, serving discerning clients across the
                nation. We specialize in connecting visionary homeowners with
                exceptional properties that not only meet but exceed
                expectations, creating lasting value for generations.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-10">
                <motion.div
                  className="bg-white/80 dark:bg-card/80 p-6 rounded-xl shadow-sm border border-border"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <div className="text-primary text-4xl font-bold mb-2">
                    <AnimatedCounter suffix="K+" to={25} />
                  </div>
                  <p>Properties Sold</p>
                </motion.div>

                <motion.div
                  className="bg-white/80 dark:bg-card/80 p-6 rounded-xl shadow-sm border border-border"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <div className="text-primary text-4xl font-bold mb-2">
                    <AnimatedCounter prefix="$" suffix="B+" to={18} />
                  </div>
                  <p>Total Value Transacted</p>
                </motion.div>

                <motion.div
                  className="bg-white/80 dark:bg-card/80 p-6 rounded-xl shadow-sm border border-border"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <div className="text-primary text-4xl font-bold mb-2">
                    <AnimatedCounter suffix="+" to={150} />
                  </div>
                  <p>Expert Agents Nationwide</p>
                </motion.div>
              </div>

              <p className="pt-6">
                Our boutique approach combines cutting-edge market intelligence
                with personalized service, ensuring every transaction is
                executed with precision and care. From historic estates to
                contemporary architectural masterpieces, we curate a portfolio
                that represents the pinnacle of luxury living.
              </p>

              <p>
                At Nova Properties, we don't just sell homes - we cultivate
                communities and build legories through exceptional service,
                integrity, and a deep understanding of the luxury lifestyle.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Company Image */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <img
              src={officeBuildingImage}
              alt="Nova Properties headquarters - modern office building"
              className="w-full h-[400px] md:h-[500px] object-cover rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Vision & History */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Our Vision */}
            <Card className="h-full">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-primary/10 rounded-lg mr-4">
                    <Eye className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground">
                    Our Vision
                  </h2>
                </div>
                <div className="space-y-4 text-foreground leading-relaxed">
                  <p>
                    To revolutionize the real estate industry by setting new
                    standards of excellence in property development, sales, and
                    client service. We envision a future where every property
                    transaction is a seamless, transparent, and rewarding
                    experience.
                  </p>
                  <p>
                    Our commitment extends beyond mere transactions—we aim to
                    build lasting relationships and create communities where
                    people thrive. Through innovative technology, sustainable
                    practices, and unwavering integrity, we're shaping the
                    future of real estate.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Our History */}
            <Card className="h-full">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-primary/10 rounded-lg mr-4">
                    <History className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground">
                    Our History
                  </h2>
                </div>
                <div className="space-y-4 text-foreground leading-relaxed">
                  <p>
                    Founded in 1999, Nova Properties began as a small boutique
                    agency with a mission to transform the real estate
                    experience. Over 25 years, we've grown into a market leader
                    while maintaining our core values of integrity and
                    client-focused service.
                  </p>
                  <p>
                    Our journey includes pioneering virtual property tours in
                    2005, developing sustainable communities starting in 2010,
                    and launching our award-winning client app in 2020. Each
                    innovation reflects our commitment to advancing the industry
                    while serving our clients' evolving needs.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <TeamSection />

      {/* Testimonials Section */}
      <TestimonialsSection testimonials={testimonials} />
      {/* Call to Action */}
      <section className="py-16 bg-background text-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Building2 className="h-16 w-16" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Find Your Dream Property?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Let our experienced team guide you through your next real estate
              journey. Contact us today for a personalized consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-primary  text-primary-foreground font-semibold rounded-lg hover:bg-opacity-90 transition-colors">
                Contact Us Today
              </button>
              <button className="px-8 py-3 border-none bg-chart-3 text-secondary-foreground font-semibold rounded-lg">
                View Properties
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
