import React from "react";
import { Link } from "react-router-dom";
import {
  Search,
  UserCheck,
  ChevronDown,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import type { Variants } from "framer-motion";
import { ErrorBoundary } from "react-error-boundary";

import { ROUTES } from "@/constants/routes";
import { useFeaturedProperties } from "@/hooks/useFeaturedProperties";
import { useAgents } from "@/hooks/useAgents";
import { useTestimonials } from "@/hooks/useTestimonials";

const heroImage =
  "https://ik.imagekit.io/novaProperties/heroBack.webp?tr=w-1600,q-75&updatedAt=1754053420576";

// ─── Lazy Sections ───────────────────────────────────────────────────────────
const ContactSection = React.lazy(
  () => import("@/components/Shared/ContactUs"),
);
const TestimonialsSection = React.lazy(
  () => import("@/components/Shared/TestimonialCard"),
);
const AboutUsSection = React.lazy(
  () => import("@/components/About/AboutUsSection"),
);
const PropertyCard = React.lazy(
  () => import("@/components/Shared/PropertyCard"),
);
const AgentCard = React.lazy(() => import("@/components/Shared/AgentCard"));

// ─── Animation Variants ──────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const cardReveal: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Skeletons ───────────────────────────────────────────────────────────────
function PropertyCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-card border border-border animate-pulse">
      <div className="h-52 bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="h-5 bg-muted rounded w-1/3" />
      </div>
    </div>
  );
}

function AgentCardSkeleton() {
  return (
    <div className="rounded-xl bg-card-elevated border border-border p-6 flex gap-4 animate-pulse">
      <div className="w-16 h-16 rounded-full bg-muted flex-shrink-0" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="h-3 bg-muted rounded w-1/3" />
        <div className="h-3 bg-muted rounded w-2/3" />
      </div>
    </div>
  );
}

function SectionError({ title }: { title?: string }) {
  return (
    <div className="py-16 text-center text-muted-foreground">
      <p className="text-sm">
        {title ?? "This section couldn't load. Please refresh."}
      </p>
    </div>
  );
}

// ─── Scroll-triggered wrapper ─────────────────────────────────────────────────
function RevealSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Section Header ──────────────────────────────────────────────────────────
function SectionHeader({
  overline,
  title,
  subtitle,
}: {
  overline: string;
  title: string;
  subtitle: string;
}) {
  return (
    <motion.div variants={fadeUp} className="text-center mb-14">
      <span className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground mb-3 block">
        {overline}
      </span>
      <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4 tracking-tight">
        {title}
      </h2>
      <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
        {subtitle}
      </p>
    </motion.div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
// Always renders immediately — no data dependency, no loading state.
function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Luxury real estate hero"
          className="w-full h-full object-cover"
          decoding="async"
          fetchPriority="high"
          width={1920}
          height={1080}
          sizes="(max-width: 640px) 640px, (max-width: 960px) 960px, 1920px"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Grain overlay */}
      <div
        className="absolute inset-0 z-1 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
        }}
      />

      <motion.div
        className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={fadeUp} className="mb-5">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-white/70 border border-white/20 rounded-full px-4 py-1.5 backdrop-blur-sm bg-white/5">
            <MapPin className="w-3 h-3" />
            Premium Real Estate
          </span>
        </motion.div>

        <motion.h1
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white mb-6 leading-[1.1] tracking-tight"
          variants={fadeUp}
        >
          Find Your{" "}
          <span className="italic" style={{ color: "var(--gold)" }}>
            Dream Home
          </span>{" "}
          Today
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-white/85 mb-10 max-w-2xl mx-auto leading-relaxed"
          variants={fadeUp}
        >
          Discover exceptional properties with our expert team. Your perfect
          home awaits in the finest neighborhoods.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={fadeUp}
        >
          <Link
            to={ROUTES.PROPERTIES}
            className="inline-flex items-center justify-center gap-2 rounded-lg px-7 py-3.5 text-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
            aria-label="Browse property listings"
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--primary-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--primary)")
            }
          >
            <Search className="w-4 h-4" />
            Browse Listings
          </Link>

          <Link
            to={ROUTES.AGENTS}
            className="inline-flex items-center justify-center gap-2 rounded-lg px-7 py-3.5 text-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            style={{
              background: "var(--gold)",
              color: "var(--gold-foreground)",
            }}
            aria-label="Contact a real estate agent"
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--gold-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--gold)")
            }
          >
            <UserCheck className="w-4 h-4" />
            Contact an Agent
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/50"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        aria-hidden="true"
      >
        <span className="text-xs font-medium tracking-widest uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Stats Banner ─────────────────────────────────────────────────────────────
// bg-surface-3: the most elevated surface — clearly stands out from bg-surface-1
// on either side. border-y uses --border-strong for visible dividers in dark mode.
const stats = [
  { label: "Properties Sold", value: "2,400+" },
  { label: "Happy Clients", value: "1,800+" },
  { label: "Expert Agents", value: "48" },
  { label: "Years of Trust", value: "15" },
];

function StatsBanner() {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="py-14 bg-surface-3 border-y border-strong"
      aria-label="Company statistics"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: i * 0.1,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div
                className="font-display text-3xl md:text-4xl font-semibold mb-1"
                style={{ color: "var(--gold)" }}
              >
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Featured Listings ────────────────────────────────────────────────────────
// bg-surface-1 (= background) — the "valley" between raised sections.
// Cards use bg-card which sits +0.07 above surface-1 — clearly elevated in dark.
function FeaturedListingsSection() {
  const {
    data: featuredProperties = [],
    isLoading,
    isError,
  } = useFeaturedProperties();

  return (
    <section id="listings" className="py-20 bg-surface-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealSection>
          <SectionHeader
            overline="Handpicked for you"
            title="Featured Listings"
            subtitle="Discover our curated selection of premium properties in the most sought-after locations."
          />

          {isError ? (
            <SectionError title="Couldn't load listings. Please try again." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <PropertyCardSkeleton key={i} />
                  ))
                : featuredProperties.map((property) => (
                    <motion.div key={property.id} variants={cardReveal}>
                      <React.Suspense fallback={<PropertyCardSkeleton />}>
                        <PropertyCard property={property} />
                      </React.Suspense>
                    </motion.div>
                  ))}
            </div>
          )}

          {!isLoading && !isError && (
            <motion.div variants={fadeUp} className="mt-12 text-center">
              <Link
                to={ROUTES.PROPERTIES}
                className="inline-flex items-center gap-2 rounded-lg px-8 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 group"
                style={{
                  background: "var(--primary)",
                  color: "var(--primary-foreground)",
                }}
                aria-label="View all property listings"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--primary-hover)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "var(--primary)")
                }
              >
                View All Listings
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          )}
        </RevealSection>
      </div>
    </section>
  );
}

// ─── Agents ───────────────────────────────────────────────────────────────────
// bg-surface-2 — the "raised" alternate section.
// Agent cards use bg-card-elevated (+0.07 above surface-2) to lift visibly.
function AgentsSection() {
  const { data: agents = [], isLoading, isError } = useAgents();

  return (
    <section id="agents" className="py-20 bg-surface-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealSection>
          <SectionHeader
            overline="Expert team"
            title="Meet Our Top Agents"
            subtitle="Our experienced professionals guide you through every step of your real estate journey."
          />

          {isError ? (
            <SectionError title="Couldn't load agents. Please try again." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <AgentCardSkeleton key={i} />
                  ))
                : agents.map((agent) => (
                    <motion.div key={agent.id} variants={cardReveal}>
                      <React.Suspense fallback={<AgentCardSkeleton />}>
                        <AgentCard agents={agent} />
                      </React.Suspense>
                    </motion.div>
                  ))}
            </div>
          )}
        </RevealSection>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
/*
  DARK MODE SECTION RHYTHM (light to dark, the same sections alternate):

  Hero          full-bleed photo         (theme neutral)
  About         bg-surface-2             raised
  StatsBanner   bg-surface-3 + border-y  most prominent, visual anchor
  Listings      bg-surface-1             valley
  Agents        bg-surface-2             raised
  Testimonials  bg-surface-1             valley
  Contact       bg-surface-2             raised

  The AboutUsSection and ContactSection / TestimonialsSection components
  should NOT set their own background — they inherit from the wrapper here.
  If they set bg-background or bg-white internally, override at root element
  with bg-inherit so they pick up the parent section color.
*/
function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <HeroSection />

      {/* About — bg-surface-2 */}
      <ErrorBoundary fallback={<SectionError />}>
        <React.Suspense
          fallback={
            <div className="py-20 bg-surface-2">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-64 bg-muted rounded-xl animate-pulse" />
              </div>
            </div>
          }
        >
          {/* Wrap in surface-2 so AboutUsSection inherits the right bg */}
          <div className="bg-surface-2">
            <AboutUsSection />
          </div>
        </React.Suspense>
      </ErrorBoundary>

      {/* Stats — bg-surface-3, border-y border-strong */}
      <StatsBanner />

      {/* Featured Listings — bg-surface-1 */}
      <ErrorBoundary
        fallback={<SectionError title="Featured listings unavailable." />}
      >
        <FeaturedListingsSection />
      </ErrorBoundary>

      {/* Agents — bg-surface-2 */}
      <ErrorBoundary
        fallback={<SectionError title="Agent listings unavailable." />}
      >
        <AgentsSection />
      </ErrorBoundary>

      {/* Testimonials — bg-surface-1 */}
      <ErrorBoundary fallback={<SectionError />}>
        <React.Suspense
          fallback={
            <div className="py-20 bg-surface-1">
              <div className="max-w-7xl mx-auto px-4 space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-32 bg-muted rounded-xl animate-pulse"
                  />
                ))}
              </div>
            </div>
          }
        >
          <div className="bg-surface-1">
            <TestimonialsWrapper />
          </div>
        </React.Suspense>
      </ErrorBoundary>

      {/* Contact — bg-surface-2 */}
      <ErrorBoundary fallback={<SectionError />}>
        <React.Suspense
          fallback={
            <div className="py-20 bg-surface-2">
              <div className="max-w-7xl mx-auto px-4">
                <div className="h-80 bg-muted rounded-xl animate-pulse" />
              </div>
            </div>
          }
        >
          <div className="bg-surface-2">
            <ContactSection />
          </div>
        </React.Suspense>
      </ErrorBoundary>
    </div>
  );
}

function TestimonialsWrapper() {
  const { data: testimonials = [] } = useTestimonials();
  return (
    <React.Suspense fallback={null}>
      <TestimonialsSection testimonials={testimonials} />
    </React.Suspense>
  );
}

export default HomePage;
