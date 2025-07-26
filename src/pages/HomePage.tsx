import { useEffect, useState } from "react";
import { Search, UserCheck } from "lucide-react";
import {
  fetchAgents,
  fetchFeaturedProperties,
  fetchTestimonials,
} from "@/utils/api";
import PropertyCard from "@/components/Shared/PropertyCard";
import type { Property, Agent, Testimonial } from "@/utils/api";
import AboutUsSection from "@/components/About/AboutUsSection";
import { Link } from "react-router-dom";
import AgentCard from "@/components/Shared/AgentCard";
import ContactSection from "@/components/Shared/ContactUs";
import TestimonialsSection from "@/components/Shared/TestimonialCard";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { ROUTES } from "@/constants/routes";

function HomePage() {
  const [property, setProperty] = useState<Property[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  // Fetch properties, agents, and testimonials on component mount
  useEffect(() => {
    const getProperties = async () => {
      try {
        const data = await fetchFeaturedProperties();
        setProperty(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };
    getProperties();
    const getAgents = async () => {
      try {
        const data = await fetchAgents();
        setAgents(Array.isArray(data) ? data : []);
        console.log("Agents data:", data);
      } catch (error) {
        console.error("Error fetching agents:", error);
        setAgents([]); // Set to empty array on error
      }
    };
    getAgents();

    const getTestimonials = async () => {
      try {
        const data = await fetchTestimonials();
        setTestimonials(data);
        console.log("Testimonials data:", data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };
    getTestimonials();
  }, []);

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.5,
      },
    },
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        ease: [0.3, 1, 0.5, 1],
      },
    },
  };

  const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.9,
        ease: "backOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{
            backgroundImage: "url('heroBack.png')",
          }}
          aria-label="Luxury home exterior with modern architecture"
        />

        <div className="absolute inset-0 bg-gradient-to-br from-background/15 to-secondary/15 z-1" />

        {/* Texts */}
        <motion.div
          className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
            variants={fadeUp}
          >
            Find Your <span className="text-chart-3">Dream Home</span> Today
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto"
            variants={fadeUp}
          >
            Discover exceptional properties with our expert team. Your perfect
            home awaits in the finest neighborhoods.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={scaleIn}
          >
            <motion.div
              className="bg-primary text-primary-foreground rounded-lg px-6 py-2 font-bold flex items-center justify-center transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to={ROUTES.PROPERTIES}
                className="flex items-center cursor-pointer"
              >
                <Search className="w-5 h-5 mr-2" />
                Browse Listings
              </Link>
            </motion.div>

            <motion.div
              className="bg-chart-3 hover:bg-amber-600 text-secondary-foreground rounded-lg px-6 py-2 font-bold flex items-center justify-center transition-colors cursor-pointer"
              whileHover={{
                scale: 1.05,
                backgroundColor: "#f59e0b",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to={ROUTES.AGENTS} className="flex items-center">
                <UserCheck className="w-5 h-5 mr-2" />
                Contact an Agent
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <AboutUsSection />

      {/* Featured Listings */}
      <section id="listings" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Featured Listings
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our handpicked selection of premium properties in the
              most desirable locations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {property.map((prop, index) => (
              <PropertyCard key={index} property={prop} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to={`${ROUTES.PROPERTIES}`}
              className="btn btn--view bg-primary text-primary-foreground rounded-lg px-8 py-3 font-bold hover:bg-primary/95 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              View All Listings
            </Link>
          </div>
        </div>
      </section>

      {/* Top Agents */}
      <section id="agents" className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Meet Our Top Agents
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our experienced professionals are here to guide you through every
              step of your real estate journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto ">
            {agents.map((agent, index) => (
              <AgentCard key={index} agents={agent} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      <ContactSection />
    </div>
  );
}

export default HomePage;
