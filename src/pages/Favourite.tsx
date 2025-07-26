import { Heart, Filter, ArrowUpDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import PropertyCard from "@/components/Shared/PropertyCard";
import { useLocation, useNavigate } from "react-router-dom";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useState } from "react";

export default function FavouritesPage() {
  const [sortBy, setSortBy] = useState<string>("date");
  const [filterBy, setFilterBy] = useState<string>("all");
  const { user } = useAuth();
  const location = useLocation();
  const from = location.state?.from || "/properties/listings";
  const navigate = useNavigate();

  // Use FavoritesContext for all favorite operations
  const { favorites, loading, removeFavorite } = useFavorites();

  const handleContinueBrowsing = () => {
    toast.info(`Redirecting to ${from}...`);
    navigate(from, { replace: true });
  };

  // Sort and filter favorites

  const typeMap: Record<string, string> = {
    apartment: "Apartment",
    house: "House",
    townhouse: "Townhouse",
    villa: "Villa",
    office: "Office",
    penthouse: "Penthouse",
    condominium: "Condominium",
  };

  const filterOptions = [
    { value: "all", label: "All Types" },
    ...Object.entries(typeMap).map(([value, label]) => ({
      value,
      label,
    })),
  ];

  const normalizeType = (type: string): string => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("condo") || lowerType.includes("condominium"))
      return "condominium";
    if (lowerType.includes("penthouse")) return "penthouse";
    if (lowerType.includes("townhouse")) return "townhouse";
    if (lowerType.includes("villa")) return "villa";
    if (lowerType.includes("office")) return "office";
    if (lowerType.includes("apartment")) return "apartment";
    if (lowerType.includes("house")) return "house";
    return lowerType;
  };

  const sortedAndFilteredProperties = favorites
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

  const EmptyState = () => (
    <section className="text-center py-16 animate-fade-in">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
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
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 text-white"
        >
          Start Browsing Properties
        </Button>
      </div>
    </section>
  );

  // Loading skeleton
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-56 w-full" />
            <CardContent className="p-6">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-8 w-1/4 mb-4" />
              <div className="flex gap-4 mb-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[300px] bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center text-center">
        <div className="relative z-10 max-w-4xl mx-auto px-4 animate-fade-in">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Hey {user?.name.split(" ")[0]}! Welcome back to Your Saved
            Properties
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            Easily access and manage your favorite listings
          </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
      </div>

      {/* Content Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {favorites.length > 0 ? (
          <>
            {/* Filters and Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-sm">
                  {sortedAndFilteredProperties.length} propert
                  {sortedAndFilteredProperties.length !== 1 ? "ies" : "y"}
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      <span>Filter by type</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <div className="flex items-center">
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      <span>Sort by</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date Saved</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {sortedAndFilteredProperties.map((property, index) => (
                <PropertyCard
                  key={index}
                  property={property}
                  onFavoriteChange={(id: string, isFav: any) =>
                    !isFav && removeFavorite(id)
                  }
                />
              ))}
            </div>

            {/* Continue Browsing */}
            <div className="text-center">
              <Button
                onClick={handleContinueBrowsing}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 text-white px-8"
              >
                Continue Browsing Properties
              </Button>
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </section>
    </section>
  );
}
