import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import ResultsHeader from "@/components/Shared/ResultsHeader";
import PropertyCard from "@/components/Shared/PropertyCard";
import EmptyState from "@/components/Shared/EmptyState";
import FilterControls from "@/components/Shared/FilterControls";
import Pagination from "@/components/Shared/Pagination";
import LoadingSkeleton from "@/components/Shared/LoadingSkeleton";
import { useAllProperties } from "@/hooks/useAllProperties";

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

// Moved outside component to prevent recreation on every render
const parsePrice = (price: number | string): number => {
  if (typeof price === "number") return price;
  return parseFloat(price.replace(/[^0-9.]/g, "")) || 0;
};

const PropertiesPage = () => {
  const { data, error, isLoading } = useAllProperties();
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();
  const location = useLocation();
  const isInitialMount = useRef(true);

  const properties = data?.data ?? [];
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

  // Reset filters when switching between buy/rent
  useEffect(() => {
    if (isInitialMount.current) return;
    setPriceRange("any");
    setBedrooms("any");
    setSearchTerm("");
    setSortOption("");
    setCurrentPage(1);

    navigate(`${location.pathname}?type=${activeFilter}`, { replace: true });
  }, [activeFilter]);

  // Sync URL → State
  useEffect(() => {
    const typeParam = searchParams.get("type") || "buy";
    const searchParam = searchParams.get("search") || "";
    const priceParam = searchParams.get("price") || "any";
    const bedroomsParam = searchParams.get("bedrooms") || "any";
    const sortParam = searchParams.get("sort") || "";

    setActiveFilter(typeParam as "buy" | "rent");
    setSearchTerm(searchParam);
    setPriceRange(priceParam);
    setBedrooms(bedroomsParam);
    setSortOption(sortParam);
  }, [searchParams]);

  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    let result = [...properties];

    // Type filter
    result = result.filter((p) =>
      activeFilter === "buy" ? p.category === "Buy" : p.category === "Rent"
    );

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
      result = result.filter((property) => {
        if (property.propertyType?.toLowerCase() === "office") return true;
        const num = bedrooms === "4+" ? 4 : parseInt(bedrooms);
        return property.bedrooms >= num;
      });
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

  // Pagination
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
    const params = new URLSearchParams();
    params.set("type", activeFilter);
    if (searchTerm) params.set("search", searchTerm);
    if (priceRange !== "any") params.set("price", priceRange);
    if (bedrooms !== "any") params.set("bedrooms", bedrooms);
    if (sortOption) params.set("sort", sortOption);

    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }, [activeFilter, searchTerm, priceRange, bedrooms, sortOption]);

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

      {isLoading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorState
          error={error?.message ?? "Something went wrong"}
          onRetry={() => window.location.reload()}
        />
      ) : filteredProperties.length === 0 ? (
        <EmptyState onReset={resetFilters} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PropertiesPage;
