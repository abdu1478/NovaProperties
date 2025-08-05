import { Heart, Filter, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import PropertyCard from "@/components/Shared/PropertyCard";
import { useLocation, useNavigate } from "react-router-dom";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useState, useMemo } from "react";
import LoadingSkeleton from "@/components/Shared/LoadingSkeleton";

// Type definitions for better type safety
type PropertyType =
  | "apartment"
  | "house"
  | "townhouse"
  | "villa"
  | "office"
  | "penthouse"
  | "condominium";

interface FilterOption {
  value: string;
  label: string;
}

const TYPE_MAP: Record<PropertyType, string> = {
  apartment: "Apartment",
  house: "House",
  townhouse: "Townhouse",
  villa: "Villa",
  office: "Office",
  penthouse: "Penthouse",
  condominium: "Condominium",
};

const FILTER_OPTIONS: FilterOption[] = [
  { value: "all", label: "All Types" },
  ...Object.entries(TYPE_MAP).map(([value, label]) => ({
    value,
    label,
  })),
];

const SORT_OPTIONS = [
  { value: "date", label: "Date Saved" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "location", label: "Location" },
  { value: "year-built", label: "Year Built: Asc" },
  { value: "year-built-desc", label: "Year Built: Desc" },
];

export default function FavouritesPage() {
  const [sortBy, setSortBy] = useState<string>("date");
  const [filterBy, setFilterBy] = useState<string>("all");
  const { user } = useAuth();
  const location = useLocation();
  const from = location.state?.from || "/properties/listings";
  const navigate = useNavigate();
  const { favorites, loading, removeFavorite } = useFavorites();

  const handleContinueBrowsing = () => {
    toast.info(`Redirecting to ${from}...`);
    navigate(from, { replace: true });
  };

  const normalizeType = (type: string): PropertyType => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("condo") || lowerType.includes("condominium"))
      return "condominium";
    if (lowerType.includes("penthouse")) return "penthouse";
    if (lowerType.includes("townhouse")) return "townhouse";
    if (lowerType.includes("villa")) return "villa";
    if (lowerType.includes("office")) return "office";
    if (lowerType.includes("apartment")) return "apartment";
    if (lowerType.includes("house")) return "house";
    return lowerType as PropertyType;
  };

  const sortedAndFilteredProperties = useMemo(() => {
    return favorites
      .filter(
        (property) =>
          filterBy === "all" ||
          (property.type && normalizeType(property.type) === filterBy)
      )
      .sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return a.price - b.price;
          case "price-high":
            return b.price - a.price;
          case "location":
            return a.location.localeCompare(b.location);
          case "year-built":
            return (a.yearBuilt || Infinity) - (b.yearBuilt || Infinity);
          case "year-built-desc":
            return (b.yearBuilt || -Infinity) - (a.yearBuilt || -Infinity);
          case "date":
          default:
            return (
              new Date(b.createdAt || b._id).getTime() -
              new Date(a.createdAt || a._id).getTime()
            );
        }
      });
  }, [favorites, filterBy, sortBy]);

  const EmptyState = () => (
    <section
      className="text-center py-16 animate-fade-in"
      data-testid="empty-state"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="max-w-md mx-auto">
        <div className="mb-8" aria-hidden="true">
          <Heart
            className="h-16 w-16 mx-auto text-muted-foreground mb-4"
            aria-label="Empty favorites heart icon"
          />
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            No saved properties yet
          </h2>
          <p className="text-muted-foreground">
            Start exploring our amazing property listings and save your
            favorites to view them here.
          </p>
        </div>
        <Button
          onClick={handleContinueBrowsing}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 cursor-pointer hover:opacity-90 text-white"
          type="button"
          aria-label="Start browsing properties"
        >
          Start Browsing Properties
        </Button>
      </div>
    </section>
  );

  if (loading) {
    return (
      <div
        className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        data-testid="loading-skeleton"
        aria-busy="true"
        aria-live="polite"
      >
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-background">
      <header className="relative h-[300px] bg-card shadow-md flex items-center justify-center text-center">
        <div className="relative z-10 max-w-4xl mx-auto px-4 animate-fade-in">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary mb-4">
            Hey {user?.name.split(" ")[0]}! Welcome back to Your Saved
            Properties
          </h1>
          <p className="text-lg md:text-xl text-secondary max-w-2xl mx-auto">
            Easily access and manage your favorite listings
          </p>
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"
          aria-hidden="true"
        />
      </header>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {favorites.length > 0 ? (
          <>
            <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="text-sm bg-secondary text-secondary-foreground"
                  aria-label="Number of properties"
                >
                  {sortedAndFilteredProperties.length} propert
                  {sortedAndFilteredProperties.length !== 1 ? "ies" : "y"}
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Select
                  value={filterBy}
                  onValueChange={setFilterBy}
                  aria-label="Filter properties by type"
                >
                  <SelectTrigger
                    className="w-full sm:w-[180px]"
                    data-testid="filter-select"
                  >
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by type" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {FILTER_OPTIONS.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        data-testid={`filter-option-${option.value}`}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={sortBy}
                  onValueChange={setSortBy}
                  aria-label="Sort properties"
                >
                  <SelectTrigger
                    className="w-full sm:w-[180px]"
                    data-testid="sort-select"
                  >
                    <div className="flex items-center">
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Sort by" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        data-testid={`sort-option-${option.value}`}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Properties Grid */}
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
              data-testid="property-cards-container"
              role="list"
              aria-label="Favorite properties list"
            >
              {sortedAndFilteredProperties.map((property, index) => (
                <PropertyCard
                  key={`${property._id}-${index}`}
                  property={property}
                  onFavoriteChange={(id, isFav) => !isFav && removeFavorite(id)}
                  data-testid={`property-card-${index}`}
                />
              ))}
            </div>

            {/* Continue Browsing */}
            <div className="text-center">
              <Button
                onClick={handleContinueBrowsing}
                size="lg"
                className=" hover:opacity-90 text-white bg px-8 "
                type="button"
                aria-label="Continue browsing properties"
              >
                Continue Browsing Properties
              </Button>
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  );
}
