import React, { useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  MapPin,
  Bed,
  Bath,
  Ruler,
  Calendar,
  ArrowLeft,
  Heart,
  Share2,
  Car,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

import { formatPrice } from "@/utils/formatPrice";
import { useFavorites } from "@/contexts/FavoritesContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import AgentContactForm from "@/components/AgentContact";
import { useAuth } from "@/contexts/AuthContext";
import { usePropertyById } from "@/hooks/usePropertyById";
import { useAgentById } from "@/hooks/useAgentById";
import { ROUTES } from "@/constants/routes";

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  
  const from = location.state?.from || ROUTES.PROPERTIES;

  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const {
    data: property,
    error: propertyError,
    isLoading: isPropertyLoading,
  } = usePropertyById(id!);

  const agentId = property?.agentId?.toString();

  const { data: agent, isLoading: isAgentLoading } = useAgentById(
    agentId ?? ""
  );

  const getBackButtonText = () => {
    switch (from) {
      case ROUTES.HOME:
        return "Back to Home";
      case ROUTES.PROPERTIES:
        return "Back to Listings";
      case ROUTES.FAVORITES:
        return "Back to Favorites";
      default:
        return "Back to Properties";
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!property) return;
    
    toggleFavorite(property._id);
  };

  const handleShare = async () => {
    if (!property) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${property.type} in ${property.location}`,
          url: window.location.href,
        });
      } catch {
        // User cancelled share — not an error worth toasting
      }
    } else {
      // FIX #8: handle clipboard failure gracefully
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard");
      } catch {
        toast.error("Couldn't copy link. Please copy it manually.");
      }
    }
  };

  if (isPropertyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <LoadingSpinner />
          <p className="text-muted-foreground">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (propertyError || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-destructive">
            {propertyError?.message || "Property not found"}
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const favorited = isFavorite(property._id);

  const propertyTitle = `${property.bedrooms ? `${property.bedrooms} Bed ` : ""}${property.type} in ${property.location} | Nova Properties`;

const propertyDescription = `${property.type} for ${property.category?.toLowerCase() ?? "sale"} in ${property.location}. ${formatPrice(property.price)}${property.category === "Rent" ? "/month" : ""}. ${property.interiorDescription?.slice(0, 140) ?? ""}`.trim();

const propertyUrl = `${import.meta.env.VITE_FRONTEND_URL}/properties/${property._id}`;

const propertyStructuredData = {
  "@context": "https://schema.org",
  "@type": "RealEstateListing",
  "name": `${property.type} in ${property.location}`,
  "description": property.interiorDescription ?? "",
  "url": propertyUrl,
  "image": property.images ?? [],
  "offers": {
    "@type": "Offer",
    "price": property.price,
    "priceCurrency": "ETB",
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": property.address ?? "",
    "addressLocality": property.location,
    "addressCountry": "ET",
  },
};

  return (
    <>
    <Helmet>
      <title>{propertyTitle}</title>
      <meta name="description"         content={propertyDescription}        />
      <link rel="canonical"            href={propertyUrl}                   />
      <meta property="og:title"        content={propertyTitle}              />
      <meta property="og:description"  content={propertyDescription}        />
      <meta property="og:url"          content={propertyUrl}                />
      <meta property="og:image"        content={property.images?.[0] ?? ""} />
      <meta property="og:type"         content="website"                    />
      <meta name="twitter:card"        content="summary_large_image"        />
      <meta name="twitter:title"       content={propertyTitle}              />
      <meta name="twitter:description" content={propertyDescription}        />
      <meta name="twitter:image"       content={property.images?.[0] ?? ""} />
      <script type="application/ld+json">
        {JSON.stringify(propertyStructuredData)}
      </script>
    </Helmet>
   
    <main className="min-h-screen bg-background">

      <div className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to={from}>
              <Button variant="ghost" size="sm" className="cursor-pointer">
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{getBackButtonText()}</span>
              </Button>
            </Link>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                aria-label={
                  favorited ? "Remove from favorites" : "Add to favorites"
                }
                aria-pressed={favorited}
                onClick={handleFavorite}
              >
                <Heart
                  className="w-4 h-4 mr-2"
                  fill={favorited ? "var(--chart-5)" : "none"}
                  color={favorited ? "var(--chart-5)" : "currentColor"}
                />
                {favorited ? "Saved" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          
          <section className="space-y-4" aria-label="Property images">
            
            <div className="aspect-4/3 min-h-50 overflow-hidden rounded-lg bg-muted">
              {property.images.length > 0 ? (
                <img
                  src={property.images[activeImageIndex]}
                  alt={`${property.type} in ${property.location}`}
                  className="w-full h-full object-cover transition-opacity duration-200"
                  loading="eager"
                  decoding="async"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <span>No image available</span>
                </div>
              )}
            </div>

           
           
            {property.images.length > 1 && (
              <div
                className="grid grid-cols-4 gap-2"
                role="list"
                aria-label="Image thumbnails"
              >
                {property.images.slice(0, 4).map((image, index) => (
                  <button
                    key={image}
                    role="listitem"
                    className={`aspect-square overflow-hidden rounded-md transition-all duration-200 hover:opacity-90 ring-2 ${
                      activeImageIndex === index
                        ? "ring-primary"
                        : "ring-transparent"
                    }`}
                    aria-label={`View image ${index + 1}`}
                    aria-pressed={activeImageIndex === index}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img
                      src={image}
                      alt={`${property.type} view ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Right — Property Details */}
          <section className="space-y-6">
            
            
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {property.category && (
                      <Badge variant="secondary">{property.category}</Badge>
                    )}
                    <Badge variant="outline">{property.propertyType}</Badge>
                  </div>
                  <h1 className="text-3xl font-bold text-foreground">
                    {property.type}
                  </h1>
                  <p className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-4 h-4 shrink-0" />
                    {property.address || property.location}
                  </p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
                    {formatPrice(property.price)}
                  </p>
                  {property.category === "Rent" && (
                    <p className="text-sm text-muted-foreground">/month</p>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                  {property.type !== "Commercial Office" ? (
                    <>
                      <div className="text-center space-y-1">
                        <Bed className="w-6 h-6 mx-auto text-muted-foreground" />
                        <p className="text-2xl font-semibold">
                          {property.bedrooms}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Bedrooms
                        </p>
                      </div>
                      <div className="text-center space-y-1">
                        <Bath className="w-6 h-6 mx-auto text-muted-foreground" />
                        <p className="text-2xl font-semibold">
                          {property.bathrooms}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Bathrooms
                        </p>
                      </div>
                    </>
                  ) : property.parking ? (
                    <div className="text-center space-y-1">
                      <Car className="w-6 h-6 mx-auto text-muted-foreground" />
                      <p className="text-2xl font-semibold">
                        {property.parking}
                      </p>
                      <p className="text-sm text-muted-foreground">Parking</p>
                    </div>
                  ) : null}

                  <div className="text-center space-y-1">
                    <Ruler className="w-6 h-6 mx-auto text-muted-foreground" />
                    <p className="text-2xl font-semibold">{property.area}</p>
                    <p className="text-sm text-muted-foreground">Area</p>
                  </div>

                  {property.yearBuilt && (
                    <div className="text-center space-y-1">
                      <Calendar className="w-6 h-6 mx-auto text-muted-foreground" />
                      <p className="text-2xl font-semibold">
                        {property.yearBuilt}
                      </p>
                      <p className="text-sm text-muted-foreground">Built</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {property.interiorDescription && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Description</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {property.interiorDescription}
                  </p>
                </CardContent>
              </Card>
            )}


            {property.features && property.features.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Features & Amenities
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {property.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Separator />

            <div className="w-full">
              {!isAgentLoading && agent && (
                <AgentContactForm
                  agent={agent}
                  userEmail={user?.email || ""}
                  userName={
                    user?.name ||
                    ""
                  }
                />
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
     </>
  );
};

export default PropertyDetail;
