import React, { useState, useEffect, Suspense } from "react";
import { Helmet } from "react-helmet";
import { formatPrice } from "@/utils/formatters";
import { usePropertyData } from "@/hooks/usePropertyData";
import { trackPageView } from "@/utils/analytics";
import { validateEmail } from "@/utils/validation";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import type { Property } from "@/utils/api";

// Lazy-loaded components
const GalleryCarousel = React.lazy(
  () => import("@/components/GalleryCarousel")
);
const PropertyMap = React.lazy(() => import("@/components/PropertyMap"));
const ScheduleTourForm = React.lazy(
  () => import("@/components/ScheduleTourForm")
);

const PropertyDetailPage = () => {
  const { property, loading, error } = usePropertyData();
  const [tourDate, setTourDate] = useState("");
  const [tourTime, setTourTime] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    trackPageView(`Property: ${property?.title || "Unknown"}`);
    // Set focus for accessibility
    document.getElementById("main-content")?.focus();
  }, [property]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Failed to load property data. Please try again later.
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!property) return null;

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{property.title} | Luxury Real Estate</title>
        <meta
          name="description"
          content={property.description.substring(0, 160)}
        />
        <meta property="og:title" content={property.title} />
        <meta
          property="og:description"
          content={property.description.substring(0, 300)}
        />
        <meta property="og:image" content={property.images[0]?.url} />
        <meta property="og:type" content="real_estate.listing" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateListing",
            name: property.title,
            address: {
              "@type": "PostalAddress",
              streetAddress: property.address,
            },
            description: property.description,
            numberOfRooms: property.details.bedrooms,
            amenityFeature: property.features,
            price: formatPrice(property.price),
            image: property.images.map((img) => img.url),
            url: window.location.href,
            listingStatus: "ForSale",
          })}
        </script>
      </Helmet>

      {/* Skip Navigation for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-blue-600 focus:rounded-lg"
      >
        Skip to main content
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap gap-2 text-sm">
            <li>
              <a href="/" className="text-blue-600 hover:underline">
                Home
              </a>
            </li>
            <li className="text-gray-500">/</li>
            <li>
              <a href="/properties" className="text-blue-600 hover:underline">
                Properties
              </a>
            </li>
            <li className="text-gray-500">/</li>
            <li
              className="font-medium text-gray-900 truncate max-w-xs"
              aria-current="page"
            >
              {property.title}
            </li>
          </ol>
        </nav>

        {/* Property Header */}
        <header className="mb-8">
          <div className="flex flex-wrap justify-between gap-4">
            <div className="flex-1 min-w-[250px]">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {property.title}
              </h1>
              <p className="text-gray-600 flex items-start">
                <LocationIcon className="w-5 h-5 mr-1 mt-0.5 flex-shrink-0" />
                <span>{property.address}</span>
              </p>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-blue-600">
              {formatPrice(property.price)}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <main
            id="main-content"
            className="lg:col-span-2 space-y-8"
            tabIndex={-1}
          >
            {/* Image Gallery */}
            <section aria-labelledby="gallery-heading">
              <h2 id="gallery-heading" className="sr-only">
                Property Gallery
              </h2>
              <Suspense fallback={<GallerySkeleton />}>
                <GalleryCarousel images={property.images} />
              </Suspense>
            </section>

            {/* Property Highlights */}
            <section aria-labelledby="highlights-heading">
              <h2
                id="highlights-heading"
                className="text-xl font-bold text-gray-900 mb-4"
              >
                Property Highlights
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <DetailCard
                  label="Bedrooms"
                  value={property.details.bedrooms}
                />
                <DetailCard
                  label="Bathrooms"
                  value={property.details.bathrooms}
                />
                <DetailCard
                  label="Square Feet"
                  value={property.details.squareFeet.toLocaleString()}
                />
                <DetailCard
                  label="Year Built"
                  value={property.details.yearBuilt}
                />
                <DetailCard label="Lot Size" value={property.details.lotSize} />
                <DetailCard
                  label="Property Type"
                  value={property.details.propertyType}
                />
              </div>
            </section>

            {/* Description */}
            <section aria-labelledby="description-heading">
              <h2
                id="description-heading"
                className="text-xl font-bold text-gray-900 mb-4"
              >
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {property.description}
              </p>
            </section>

            {/* Features */}
            <section aria-labelledby="features-heading">
              <h2
                id="features-heading"
                className="text-xl font-bold text-gray-900 mb-4"
              >
                Features & Amenities
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {property.features.map((feature: any, index: any) => (
                  <li key={index} className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </section>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
              <ContactAgentCard agent={property.agent} />

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Suspense fallback={<FormSkeleton />}>
                  <ScheduleTourForm
                    tourDate={tourDate}
                    tourTime={tourTime}
                    onDateChange={setTourDate}
                    onTimeChange={setTourTime}
                    formError={formError}
                  />
                </Suspense>
              </div>
            </div>

            {/* Map Section */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <Suspense fallback={<MapSkeleton />}>
                <PropertyMap address={property.address} />
              </Suspense>
            </div>

            {/* Share Section */}
            <ShareSection property={property} />
          </aside>
        </div>
      </div>
    </>
  );
};

// Component for property detail cards
const DetailCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-100">
    <div className="text-xs sm:text-sm text-gray-500">{label}</div>
    <div className="text-lg font-semibold">{value}</div>
  </div>
);

// Contact Agent Card Component
const ContactAgentCard = ({ agent }: { agent: any }) => (
  <>
    <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Agent</h2>
    <div className="flex items-center mb-6">
      <div className="bg-gray-200 rounded-xl w-16 h-16 flex items-center justify-center">
        <UserIcon className="w-8 h-8 text-gray-400" />
      </div>
      <div className="ml-4">
        <div className="font-semibold text-gray-900">{agent.name}</div>
        <div className="text-sm text-gray-500">License: {agent.license}</div>
      </div>
    </div>

    <div className="space-y-3">
      <a
        href={`tel:${agent.phone.replace(/\D/g, "")}`}
        className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <PhoneIcon className="w-5 h-5" />
        Call Agent
      </a>

      <a
        href={`mailto:${agent.email}`}
        className="flex items-center justify-center gap-2 border border-blue-600 text-blue-600 py-3 rounded-lg font-medium hover:bg-blue-50 transition focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <EmailIcon className="w-5 h-5" />
        Email Agent
      </a>
    </div>
  </>
);

// Share Section Component
const ShareSection = ({ property }: { property: Property }) => (
  <div className="bg-white rounded-xl shadow-md p-4">
    <h3 className="font-medium text-gray-900 mb-3">Share this property</h3>
    <div className="flex gap-3">
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          window.location.href
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
        aria-label="Share on Facebook"
      >
        <FacebookIcon className="w-5 h-5" />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
          property.title
        )}&url=${encodeURIComponent(window.location.href)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
        aria-label="Share on Twitter"
      >
        <TwitterIcon className="w-5 h-5" />
      </a>
      <button
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          alert("Link copied to clipboard!");
        }}
        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
        aria-label="Copy link to clipboard"
      >
        <LinkIcon className="w-5 h-5" />
      </button>
    </div>
  </div>
);

// Loading Skeletons
const GallerySkeleton = () => (
  <div className="aspect-video rounded-xl bg-gray-100 animate-pulse" />
);

const FormSkeleton = () => (
  <div className="space-y-4">
    <div className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
    <div className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
    <div className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
  </div>
);

const MapSkeleton = () => (
  <div className="aspect-video bg-gray-100 flex items-center justify-center animate-pulse">
    <MapPinIcon className="w-12 h-12 text-gray-300" />
  </div>
);

// Icon Components
const PhoneIcon = ({ className }: { className?: string }) => (
  <svg
    className={`w-5 h-5 ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);

const EmailIcon = ({ className }: { className?: string }) => (
  <svg
    className={`w-5 h-5 ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const LocationIcon = ({ className }: { className?: string }) => (
  <svg
    className={`w-5 h-5 ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg
    className={`w-5 h-5 ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    className={`w-5 h-5 ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg
    className={`w-5 h-5 ${className}`}
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.129 22 16.99 22 12z" />
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg
    className={`w-5 h-5 ${className}`}
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
  </svg>
);

const LinkIcon = ({ className }: { className?: string }) => (
  <svg
    className={`w-5 h-5 ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
    />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg
    className={`w-5 h-5 ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

export default PropertyDetailPage;
