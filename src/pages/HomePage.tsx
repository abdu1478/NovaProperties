import { Link } from "react-router-dom";
import { Search, UserCheck } from "lucide-react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

import { ROUTES } from "@/constants/routes";
import { useFeaturedProperties } from "@/hooks/useFeaturedProperties";
import { useAgents } from "@/hooks/useAgents";
import { useTestimonials } from "@/hooks/useTestimonials";
import LoadingSpinner from "@/components/LoadingSpinner";
import React from "react";
const heroImage =
  "https://ik.imagekit.io/novaProperties/heroBack.webp?tr=w-1600,q-75&updatedAt=1754053420576";

// Lazy loading components
const ContactSection = React.lazy(
  () => import("@/components/Shared/ContactUs")
);
const TestimonialsSection = React.lazy(
  () => import("@/components/Shared/TestimonialCard")
);
const AboutUsSection = React.lazy(
  () => import("@/components/About/AboutUsSection")
);
const PropertyCard = React.lazy(
  () => import("@/components/Shared/PropertyCard")
);
const AgentCard = React.lazy(() => import("@/components/Shared/AgentCard"));

function HomePage() {
  const { data: featuredProperties = [], isLoading: isPropertiesLoading } =
    useFeaturedProperties();
  const { data: agents = [], isLoading: isAgentsLoading } = useAgents();
  const { data: testimonials = [], isLoading: isTestimonialsLoading } =
    useTestimonials();

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: [0.1, 0.8, 0.2, 0.7],
      },
    },
  };

  const isLoading =
    isPropertiesLoading || isAgentsLoading || isTestimonialsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Hero Background"
            className="w-full h-full object-cover"
            decoding="async"
            fetchPriority="high"
            width={1920}
            height={1080}
            // srcSet={`
            //   ${heroImage}?tr=w-640,q-70 640w,
            //   ${heroImage}?tr=w-960,q-70 960w,
            //   ${heroImage}?tr=w-1920,q-80 1920w
            // `}
            sizes="(max-width: 640px) 640px, (max-width: 960px) 960px, 1920px"
          />
        </div>

        {/* Trust-focused teal overlay */}
        <div className="absolute inset-0 z-10 rounded-xl backdrop-blur-sm pointer-events-none" />

        {/* Content */}
        <motion.div
          className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={container}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-background mb-6"
            variants={fadeUp}
          >
            Find Your{" "}
            <span className="text-chart-3">Dream Home</span> Today
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-[oklch(0.95_0.002_285)] mb-8 max-w-2xl mx-auto"
            variants={fadeUp}
          >
            Discover exceptional properties with our expert team. Your perfect
            home awaits in the finest neighborhoods.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={fadeUp}
          >
            <div className="bg-primary text-sidebar rounded-lg px-6 py-2 font-bold flex items-center justify-center transition-colors">
              <Link
                to={ROUTES.PROPERTIES}
                className="flex items-center cursor-pointer"
                aria-label="Browse property listings"
              >
                <Search className="w-5 h-5 mr-2" />
                Browse Listings
              </Link>
            </div>

            <div className="bg-chart-3 text-sidebar rounded-lg px-6 py-2 font-bold flex items-center justify-center transition-colors cursor-pointer">
              <Link
                to={ROUTES.AGENTS}
                className="flex items-center"
                aria-label="Contact a real estate agent"
              >
                <UserCheck className="w-5 h-5 mr-2" />
                Contact an Agent
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <AboutUsSection />

      {/* Featured Listings */}
      <section id="listings" className="py-16">
        <div className="max-w-7xl mx-auto px-2">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[oklch(0.42_0.08_225)] mb-4">
              Featured Listings
            </h2>
            <p className="text-lg text-[oklch(0.55_0.015_285)] max-w-2xl mx-auto">
              Discover our handpicked selection of premium properties
            </p>
          </div>

          <div className="relative overflow-hidden flex lg:gap-4 md:gap-2">
            {featuredProperties.map((property, index) => (
              <motion.div
                key={index}
                className="flex-shrink-0 w-full md:w-1/3 lg:px-2 lg:w-1/2"
                variants={fadeUp}
                initial="hidden"
                animate="show"
              >
                <React.Suspense fallback={<LoadingSpinner />}>
                  <PropertyCard property={property} />
                </React.Suspense>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to={ROUTES.PROPERTIES}
              className="inline-block bg-primary text-primary-foreground rounded-lg px-8 py-3 font-bold hover:bg-[oklch(0.38_0.08_225)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.42_0.08_225)] focus-visible:ring-offset-2"
              aria-label="View all property listings"
            >
              View All Listings
            </Link>
          </div>
        </div>
      </section>

      {/* Top Agents */}
      <section
        id="agents"
        className="py-16"
        style={{ background: "oklch(0.98_0.002_285)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[oklch(0.42_0.08_225)] mb-4">
              Meet Our Top Agents
            </h2>
            <p className="text-lg text-[oklch(0.55_0.015_285)] max-w-2xl mx-auto">
              Our experienced professionals are here to guide you through every
              step of your real estate journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {agents.map((agent, index) => (
              <AgentCard key={index} agents={agent} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      {/* Contact Section */}
      <ContactSection />
    </div>
  );
}

export default HomePage;
