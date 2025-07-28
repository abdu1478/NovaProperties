import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import ResultsHeader from "@/components/Shared/ResultsHeader";
import PropertyCard from "@/components/Shared/PropertyCard";
import EmptyState from "@/components/Shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import FilterControls from "@/components/Shared/FilterControls";
import Pagination from "@/components/Shared/Pagination";

import { fetchProperties } from "@/utils/api";
import type { Property } from "@/utils/api";

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <Skeleton key={i} className="h-80 rounded-xl" />
    ))}
  </div>
);

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState = ({ error, onRetry }: ErrorStateProps) => (
  <div className="text-center py-12">
    <p className="text-destructive">{error}</p>
    <Button
      className="mt-4 bg-foreground text-background/80 cursor-pointer"
      onClick={onRetry}
    >
      Retry
    </Button>
  </div>
);

const PropertiesPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();
  const location = useLocation();
  const isInitialMount = useRef(true);

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

  // Reset to first page when filters change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setCurrentPage(1);
  }, [activeFilter, searchTerm, priceRange, bedrooms, sortOption]);

  // Reset priceRange when switching between buy/rent
  useEffect(() => {
    if (isInitialMount.current) return;
    setPriceRange("any");
  }, [activeFilter]);

  const handleProperties = async (page = 1, limit = 12) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await fetchProperties(page, limit);
      setProperties(data);
    } catch (err) {
      let errorMessage = "Failed to load properties";
      if (err instanceof Error) {
        errorMessage = err.message.toLowerCase().includes("network")
          ? "Network error. Please check your connection."
          : err.message.toLowerCase().includes("server")
          ? "Server error. Please try again later."
          : err.message;
      }
      setError(errorMessage);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleProperties();
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

  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    let result = [...properties];

    // Type filter
    if (activeFilter === "buy") {
      result = result.filter((p) => p.category === "Buy");
    } else {
      result = result.filter((p) => p.category === "Rent");
    }

    // Search term filter
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
        return max === 0
          ? priceValue >= min
          : priceValue >= min && priceValue <= max;
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

  // Pagination logic
  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProperties.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProperties, currentPage]);

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

      <FilterControls
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        bedrooms={bedrooms}
        onBedroomsChange={setBedrooms}
        onReset={resetFilters}
        propertyCount={filteredProperties.length}
      />

      <ResultsHeader
        activeFilter={activeFilter}
        sortOption={sortOption}
        onSortChange={setSortOption}
      />

      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorState
          error={error}
          onRetry={() => {
            setError(null);
            handleProperties();
          }}
        />
      ) : filteredProperties.length === 0 ? (
        <EmptyState onReset={resetFilters} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </>
      )}
    </div>
  );
};

export default PropertiesPage;
