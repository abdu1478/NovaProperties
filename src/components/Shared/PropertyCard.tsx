import React, { useState } from "react";
import { Heart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { formatPrice } from "@/utils/formatPrice";
import { ROUTES } from "@/constants/routes";
import { useFavorites } from "@/contexts/FavoritesContext";
import { motion } from "framer-motion";
import type { PropertyHandler } from "Handlers";

interface PropertyCardProps {
  property: PropertyHandler;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const [imageError, setImageError] = useState<boolean>(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const location = useLocation();

  const propertyType = property.type;
  const isCommercial = propertyType === "Commercial Office";

  // Property details configuration
  const propertyDetails = isCommercial
    ? [
        { label: "Parking", value: property.parking },
        { label: "Area", value: `${property.area} sqft` },
      ]
    : [
        { label: "Beds", value: property.bedrooms },
        { label: "Baths", value: property.bathrooms },
        { label: "Area", value: `${property.area} sqft` },
      ];

  return (
    <motion.article
      whileHover={{ y: -5 }}
      className="bg-card rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 shadow-xl font-arima"
      aria-labelledby={`property-${property._id}-title`}
    >
      {/* Image section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {property.images?.length > 0 && !imageError ? (
          <img
            src={property.images[0]}
            alt={`${property.bedrooms} bedroom ${propertyType} in ${property.location}`}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={() => setImageError(true)}
            loading="lazy"
            decoding="async"
            width={600}
            height={400}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-center p-4">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-3" />
              <span className="text-gray-400 text-sm">Image not available</span>
            </div>
          </div>
        )}

        {/* Property type badge */}
        <div className="absolute top-4 left-4 bg-[oklch(97%_0.005_200)] text-[oklch(35%_0.01_250)] px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm shadow-sm">
          {propertyType}
        </div>

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(property._id);
          }}
          className="absolute top-4 right-4 bg-white/90 p-2 rounded-full hover:bg-white transition-colors backdrop-blur-sm shadow-sm"
          aria-label={
            isFavorite(property._id)
              ? "Remove from favorites"
              : "Add to favorites"
          }
        >
          <Heart
            className="w-5 h-5 transition-colors cursor-pointer"
            fill={isFavorite(property._id) ? "#ef4444" : "transparent"}
            stroke={isFavorite(property._id) ? "#ef4444" : "#4b5563"}
          />
        </button>
      </div>

      {/* Content section */}
      <div className="p-5 space-y-4">
        {/* Location */}
        {/* <div className="flex items-center">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 mr-1.5 flex-shrink-0" />
          <p className="text-foreground text-sm line-clamp-2 h-10 flex items-">
            {property.location}
          </p>
        </div> */}

        {/* Title */}
        <h3
          id={`property-${property._id}-title`}
          className="text-lg font-semibold text-accent-foreground line-clamp-1"
        >
          {propertyType} in {property.location.split(",")[0]}
        </h3>

        {/* Price */}
        <div className="flex items-baseline">
          <p className="text-2xl font-bold text-accent-foreground/90">
            {formatPrice(property.price)}
          </p>
          {property.category === "Rent" && (
            <span className="text-accent-foreground font-medium ml-2">/mo</span>
          )}
        </div>

        {/* Property details */}
        <div
          className={`grid ${
            isCommercial ? "grid-cols-2" : "grid-cols-3"
          } gap-2 pt-3`}
        >
          {propertyDetails.map((detail, index) => (
            <div
              key={index}
              className="bg-accent rounded-lg py-2 px-3 text-center"
            >
              <p className="text-accent-foreground font-medium">
                {detail.value}
              </p>
              <p className="text-accent-foreground text-xs mt-0.5">
                {detail.label}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Link
          to={ROUTES.PROPERTY_DETAIL.replace(":id", property._id)}
          state={{ from: location.pathname }}
          className="block w-full text-center bg-primary hover:bg-gray-800 text-sidebar rounded-lg py-3 px-4 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
          aria-label={`View details for ${propertyType} in ${property.location}`}
        >
          View Details
        </Link>
      </div>
    </motion.article>
  );
};

export default PropertyCard;
