import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PropertyCard from "@/components/Shared/PropertyCard";
import { fetchFeaturedProperties, fetchIndividualProperty } from "@/utils/api";
import type { Property } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";

const PropertiesPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Parse price to number for filtering
  const parsePrice = (price: number | string): number => {
    if (typeof price === "number") return price;
    return parseFloat(price.replace(/[^0-9.]/g, "")) || 0;
  };

  // Get initial filter from URL or default to 'buy'
  const initialFilter = searchParams.get("type") || "buy";
  const [activeFilter, setActiveFilter] = useState<"buy" | "rent">(
    initialFilter as "buy" | "rent"
  );

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [priceRange, setPriceRange] = useState(
    searchParams.get("price") || "any"
  );
  const [bedrooms, setBedrooms] = useState(
    searchParams.get("bedrooms") || "any"
  );
  const [sortOption, setSortOption] = useState(searchParams.get("sort") || "");

  console.log(isSyncing);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchFeaturedProperties();
      setProperties(data);
    } catch (err) {
      let errorMessage = "Failed to load properties";

      if (err instanceof Error) {
        if (err.message.includes("network")) {
          errorMessage = "Network error. Please check your connection.";
        } else if (err.message.includes("HTTP error")) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();

    const individual = async () => {
      if (!properties) {
        return null;
      }
      try {
        const data = await fetchIndividualProperty(properties[0]?._id);
        console.log("Individual Property Data:", data);
      } catch (err) {
        return;
      }
    };
    individual();
  }, []);

  // Sync URL → State
  useEffect(() => {
    const typeParam = (searchParams.get("type") as "buy" | "rent") || "buy";
    const searchParam = searchParams.get("search") || "";
    const priceParam = searchParams.get("price") || "any";
    const bedroomsParam = searchParams.get("bedrooms") || "any";
    const sortParam = searchParams.get("sort") || "";

    setActiveFilter(typeParam);
    setSearchTerm(searchParam);
    setPriceRange(priceParam);
    setBedrooms(bedroomsParam);
    setSortOption(sortParam);
  }, [searchParams]);

  // Sync State → URL
  useEffect(() => {
    setIsSyncing(true);

    const params = new URLSearchParams();
    if (activeFilter) params.set("type", activeFilter);
    if (searchTerm) params.set("search", searchTerm);
    if (priceRange !== "any") params.set("price", priceRange);
    if (bedrooms !== "any") params.set("bedrooms", bedrooms);
    if (sortOption) params.set("sort", sortOption);

    navigate(`${location.pathname}?${params.toString()}`, { replace: true });

    // Reset sync flag after update
    const timer = setTimeout(() => setIsSyncing(false), 0);
    return () => clearTimeout(timer);
  }, [
    activeFilter,
    searchTerm,
    priceRange,
    bedrooms,
    sortOption,
    navigate,
    location.pathname,
  ]);

  // Reset all filters
  const resetFilters = () => {
    navigate("/properties/listings", { replace: true });

    setActiveFilter("buy");
    setSearchTerm("");
    setPriceRange("any");
    setBedrooms("any");
    setSortOption("");
  };

  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    let result = [...properties];

    // Type filter - using category field
    if (activeFilter === "buy") {
      result = result.filter((p) => p.category === "Buy");
    } else if (activeFilter === "rent") {
      result = result.filter((p) => p.category === "Rent");
    }

    // Search term filter - search in location, address, and description
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (property) =>
          property.location.toLowerCase().includes(term) ||
          (property.address?.toLowerCase().includes(term) ?? false) ||
          (property.description?.toLowerCase().includes(term) ?? false) ||
          (property.propertyType?.toLowerCase().includes(term) ?? false)
      );
    }

    // Price filter
    if (priceRange !== "any") {
      const [min, max] = priceRange.split("-").map(Number);
      result = result.filter((property) => {
        const priceValue = parsePrice(property.price);
        if (max === 0) {
          return priceValue >= min;
        } else {
          return priceValue >= min && priceValue <= max;
        }
      });
    }

    // Bedrooms filter
    if (bedrooms !== "any") {
      if (bedrooms === "4+") {
        result = result.filter((property) => property.bedrooms >= 4);
      } else {
        const numBedrooms = parseInt(bedrooms);
        result = result.filter((property) => property.bedrooms === numBedrooms);
      }
    }

    // Sorting
    if (sortOption === "price-asc") {
      result.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (sortOption === "price-desc") {
      result.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    } else if (sortOption === "newest") {
      result.sort((a, b) => (b.yearBuilt || 0) - (a.yearBuilt || 0));
    }

    return result;
  }, [properties, activeFilter, searchTerm, priceRange, bedrooms, sortOption]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Find Your Perfect Property
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover our curated selection of properties tailored to your needs
        </p>
      </div>

      {/* Unified Filter Controls */}
      <div className="bg-card rounded-xl shadow-sm p-6 mb-8 border border-border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Property Type
            </label>
            <Tabs
              value={activeFilter}
              onValueChange={(value) =>
                setActiveFilter(value as "buy" | "rent")
              }
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="buy">Buy</TabsTrigger>
                <TabsTrigger value="rent">Rent</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Search Location
            </label>
            <Input
              placeholder="City, Neighborhood, or ZIP"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Price Range
            </label>
            {activeFilter === "buy" && (
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Price</SelectItem>
                  <SelectItem value="0-250000">Under $250,000</SelectItem>
                  <SelectItem value="250000-500000">$250K - $500K</SelectItem>
                  <SelectItem value="500000-1000000">$500K - $1M</SelectItem>
                  <SelectItem value="1000000-0">$1M+</SelectItem>
                </SelectContent>
              </Select>
            )}
            {activeFilter === "rent" && (
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Price</SelectItem>
                  <SelectItem value="0-250000">Under $10,000</SelectItem>
                  <SelectItem value="250000-500000">$25K - $50K</SelectItem>
                  <SelectItem value="500000-1000000">$50K - $100K</SelectItem>
                  <SelectItem value="1000000-0">$100K+</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Bedrooms
            </label>
            <Select value={bedrooms} onValueChange={setBedrooms}>
              <SelectTrigger>
                <SelectValue placeholder="Any bedrooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="1">1 Bedroom</SelectItem>
                <SelectItem value="2">2 Bedrooms</SelectItem>
                <SelectItem value="3">3 Bedrooms</SelectItem>
                <SelectItem value="4+">4+ Bedrooms</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {filteredProperties.length} properties found
          </div>
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-4 md:mb-0">
          {activeFilter === "buy"
            ? "Properties For Sale"
            : "Properties For Rent"}
        </h2>

        <div className="flex gap-2">
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Property Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-destructive">{error}</p>
          <Button
            className="mt-4"
            onClick={() => {
              setError(null);
              fetchProperties();
            }}
          >
            Retry
          </Button>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <div className="inline-block bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-4">
            <div className="text-4xl">🏡</div>
          </div>
          <h3 className="text-xl font-medium text-foreground mb-2">
            No properties match your criteria
          </h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or search term
          </p>
          <Button variant="secondary" onClick={resetFilters}>
            Reset All Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      )}

      {/* Pagination would go here */}
      {filteredProperties.length > 0 && (
        <div className="mt-12 flex justify-center">
          <Button variant="outline" className="mx-1">
            1
          </Button>
          <Button variant="ghost" className="mx-1">
            2
          </Button>
          <Button variant="ghost" className="mx-1">
            3
          </Button>
          <Button variant="ghost" className="mx-1">
            Next →
          </Button>
        </div>
      )}
    </div>
  );
};

export default PropertiesPage;
