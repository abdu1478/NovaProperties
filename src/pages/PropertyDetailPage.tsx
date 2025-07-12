import React, { useState, useEffect } from "react";
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
import { fetchIndividualProperty, type Property } from "@/utils/api";

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const location = useLocation();
  const from = location.state?.from || "/properties/listings";

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

  useEffect(() => {
    const loadProperty = async () => {
      if (!id) {
        setError("Property ID not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const propertyData = await fetchIndividualProperty(id);
        setProperty(propertyData);
      } catch (err) {
        setError("Failed to load property details");
        toast.error("Failed to load property details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id]);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  const handleShare = () => {
    if (navigator.share && property) {
      navigator.share({
        title: `${property.type} in ${property.location}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.info("Link copied to clipboard");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-destructive">{error || "Property not found"}</p>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Properties
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Format price as currency
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(property.price);

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to={from}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {getBackButtonText()}
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleFavorite}>
                <Heart
                  className="w-4 h-4 mr-2"
                  fill={isFavorite ? "var(--chart-5)" : "none"}
                  color={
                    isFavorite ? "var(--chart-5)" : "var(--muted-foreground)"
                  }
                />
                {isFavorite ? "Saved" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Image Gallery */}
          <section className="space-y-4" aria-label="Property images">
            {/* Main Image */}
            <div className="aspect-[4/3] overflow-hidden rounded-lg bg-muted">
              {property.images.length > 0 ? (
                <img
                  src={property.images[selectedImage] || property.images[0]}
                  alt={`${property.type} in ${property.location}`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.classList.add("opacity-0");
                    e.currentTarget.nextElementSibling?.classList.remove(
                      "hidden"
                    );
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <span>No image available</span>
                </div>
              )}
              <div className="hidden w-full h-full items-center justify-center text-muted-foreground bg-muted">
                <span>Image not available</span>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {property.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {property.images.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-md transition-all duration-200 ${
                      selectedImage === index
                        ? "ring-2 ring-primary ring-offset-2"
                        : "hover:opacity-80"
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img
                      src={image}
                      alt={`${property.type} in ${property.location} - View ${
                        index + 1
                      }`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.classList.add("opacity-0");
                        e.currentTarget.nextElementSibling?.classList.remove(
                          "hidden"
                        );
                      }}
                    />
                    <div className="hidden w-full h-full items-center justify-center text-xs bg-muted text-muted-foreground">
                      Image
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Virtual tour removed since it's not in the Property interface */}
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
                  <p className="text-3xl font-bold text-primary">
                    {formattedPrice}
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

            {/* Contact Information - Removed since it's not in the Property interface */}
            {/* <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Contact Agent</h2>
                {property.contactName && (
                  <p className="font-medium text-lg mb-4">
                    {property.contactName}
                  </p>
                )}
                <div className="space-y-3">
                  {property.contactPhone && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleContact("phone")}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      {property.contactPhone}
                    </Button>
                  )}
                  {property.contactEmail && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleContact("email")}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      {property.contactEmail}
                    </Button>
                  )}
                  <Button className="w-full">Schedule Viewing</Button>
                </div>
              </CardContent>
            </Card> */}
          </section>
        </div>
      </div>
    </main>
  );
};

export default PropertyDetail;
