import React from "react";
import { useParams, Link, useLocation } from "react-router-dom";
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

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const from = location.state?.from || "/properties/listings";
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  // Fetch property data using React Query
  const {
    data: property,
    error: propertyError,
    isLoading: isPropertyLoading,
  } = usePropertyById(id!);

  // Fetch agent data using React Query
  const agentId = property?.agentId?.toString();
  const { data: agent, isLoading: isAgentLoading } = useAgentById(
    agentId ?? ""
  );

  const getBackButtonText = () => {
    switch (from) {
      case "/":
        return "Back to Home";
      case "/properties/listings":
        return "Back to Listings";
      case "/properties/favorites":
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

  const handleShare = () => {
    if (!property) return;

    if (navigator.share) {
      navigator.share({
        title: `${property.type} in ${property.location}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.info("Link copied to clipboard");
    }
  };

  if (isPropertyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner />
          <p className="text-muted-foreground">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (propertyError || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to={from}>
              <Button variant="ghost" className="cursor-pointer" size="sm">
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
                aria-label="Add to favorites"
                onClick={handleFavorite}
              >
                <Heart
                  fill={isFavorite(property._id) ? "var(--chart-5)" : "none"}
                  color={
                    isFavorite(property._id)
                      ? "var(--chart-5)"
                      : "var(--muted-foreground)"
                  }
                />
                {isFavorite(property._id) ? "Saved" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Image Gallery */}
          <section className="space-y-4" aria-label="Property images">
            {/* Main Image */}
            <div className="aspect-[4/3] min-h-[200px] overflow-hidden rounded-lg bg-muted">
              {property.images.length > 0 ? (
                <img
                  src={property.images[0]}
                  alt={`${property.type} in ${property.location}`}
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <span>No image available</span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {property.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {property.images.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    className={`aspect-square overflow-hidden rounded-md transition-all duration-200 hover:opacity-80`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img
                      src={image}
                      alt={`${property.type} in ${property.location} - View ${
                        index + 1
                      }`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Right Side - Property Details */}
          <section className="space-y-6">
            {/* Property Header */}
            <header className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {property.category && (
                      <Badge variant="secondary">{property.category}</Badge>
                    )}
                    <Badge variant="outline">{property.propertyType}</Badge>
                  </div>
                  <h1 className="text-3xl font-bold text-foreground">
                    {property.type}
                  </h1>
                  <p className="flex items-center text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-1" />
                    {property.address || property.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
                    {formatPrice(property.price)}
                  </p>
                  {property.category === "Rent" && (
                    <p className="text-sm text-muted-foreground">/month</p>
                  )}
                </div>
              </div>
            </header>
            {/* Property Stats */}
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
            {/* Description */}
            {property.description && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Description</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {property.interiorDescription}
                  </p>
                </CardContent>
              </Card>
            )}
            {/* Features */}
            {property.features && property.features.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Features & Amenities
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
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
                  userName={user?.name || ""}
                />
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default PropertyDetail;
