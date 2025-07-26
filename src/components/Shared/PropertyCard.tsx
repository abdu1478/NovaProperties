import React, { useState } from "react";
import { MapPin, Bed, Bath, Ruler, Heart, CircleParking } from "lucide-react";
import type { Property } from "@/utils/api";
import { Link, useLocation } from "react-router-dom";
import { formatPrice } from "@/utils/formatPrice";
import { ROUTES } from "@/constants/routes";

import { useFavorites } from "@/contexts/FavoritesContext";

interface PropertyCardProps {
  property: Property;
  isFavoritePage?: boolean;
  onFavoriteChange?: (propertyId: string, isFavorite: boolean) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const [imageError, setImageError] = useState<boolean>(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const location = useLocation();

  return (
    <article
      className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-border"
      aria-labelledby={`property-${property._id}-title`}
    >
      <figure className="relative aspect-[4/3] overflow-hidden">
        {Array.isArray(property.images) &&
        property.images.length > 0 &&
        !imageError &&
        property.propertyType !== "Office" ? (
          <img
            src={property.images[0]}
            alt={`${property.bedrooms} bedroom ${property.type} in ${property.location}`}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : property.type === "Commercial Office" &&
          Array.isArray(property.images) &&
          property.images.length > 1 ? (
          <img
            src={property.images[1]}
            alt={`office in ${property.location} image`}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground"
            aria-hidden="true"
          >
            <span className="text-sm">Image not available</span>
          </div>
        )}
        <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium">
          {property.category}
        </div>
        <button
          onClick={() => toggleFavorite(property._id)}
          className="absolute top-3 right-3 bg-background/80 p-2 rounded-full hover:bg-background transition-colors"
          aria-label="Fav"
        >
          <Heart
            className={`w-4 h-4`}
            fill={isFavorite(property._id) ? "red" : "none"}
            style={{ color: isFavorite(property._id) ? "red" : "currentColor" }}
          />
        </button>
      </figure>

      <div className="p-4 space-y-3">
        <header>
          <h3
            id={`property-${property._id}-title`}
            className="text-lg font-semibold text-foreground line-clamp-1"
          >
            {`${property.type} in ${property.location}`}
          </h3>
          <p className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{property.location}</span>
          </p>
        </header>

        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-primary">
            {formatPrice(property.price)}
            {property.category === "Rent" && (
              <span className="text-sm font-normal text-muted-foreground">
                /mo
              </span>
            )}
          </p>
          <span className="text-xs px-2 py-1 rounded bg-accent text-accent-foreground">
            {property.type}
          </span>
        </div>

        {property.type !== "Commercial Office" ? (
          <ul className="flex justify-between pt-3 border-t border-border text-sm">
            <li className="flex items-center space-x-1">
              <Bed
                className="w-4 h-4 text-muted-foreground"
                aria-hidden="true"
              />
              <span>
                {property.bedrooms} <span className="sr-only">bedrooms</span>
              </span>
            </li>
            <li className="flex items-center space-x-1">
              <Bath
                className="w-4 h-4 text-muted-foreground"
                aria-hidden="true"
              />
              <span>
                {property.bathrooms} <span className="sr-only">bathrooms</span>
              </span>
            </li>
            <li className="flex items-center space-x-1">
              <Ruler
                className="w-4 h-4 text-muted-foreground"
                aria-hidden="true"
              />
              <span>
                {property.area} <span className="sr-only">square feet</span>
              </span>
            </li>
          </ul>
        ) : (
          <ul className="flex justify-between pt-3 border-t border-border text-sm">
            <li className="flex items-center space-x-1">
              <CircleParking
                className="w-4 h-4 text-muted-foreground"
                aria-hidden="true"
              />
              <span>{property.parking}</span>
            </li>
            <li className="flex items-center space-x-1">
              <Ruler
                className="w-4 h-4 text-muted-foreground"
                aria-hidden="true"
              />
              <span>
                {property.area} <span className="sr-only">square feet</span>
              </span>
            </li>
          </ul>
        )}
        <Link
          to={ROUTES.PROPERTY_DETAIL.replace(":id", property._id)}
          state={{ from: location.pathname }}
          className="w-full inline-block text-center bg-primary hover:bg-primary/95 text-primary-foreground rounded-md py-2 px-4 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`View details for properties`}
        >
          View Details
        </Link>
      </div>
    </article>
  );
};

export default PropertyCard;
