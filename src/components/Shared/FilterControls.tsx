import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice } from "@/utils/formatPrice";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface FilterControlsProps {
  activeFilter: "buy" | "rent";
  onFilterChange: (value: "buy" | "rent") => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  priceRange: string;
  onPriceRangeChange: (value: string) => void;
  bedrooms: string;
  onBedroomsChange: (value: string) => void;
  onReset: () => void;
  propertyCount: number;
}

const FilterControls = ({
  activeFilter,
  onFilterChange,
  searchTerm,
  onSearchChange,
  priceRange,
  onPriceRangeChange,
  bedrooms,
  onBedroomsChange,
  onReset,
  propertyCount,
}: FilterControlsProps) => {
  const getPriceOptions = () => {
    const baseOptions = [
      { value: "any", label: "Any Price" },
      { value: "0-3000000", label: `Under ${formatPrice(3000000)}` },
      {
        value: "3000000-7000000",
        label: `${formatPrice(3000000)} - ${formatPrice(7000000)}`,
      },
      {
        value: "7000000-15000000",
        label: `${formatPrice(7000000)} - ${formatPrice(15000000)}`,
      },
      {
        value: "15000000-30000000",
        label: `${formatPrice(15000000)} - ${formatPrice(30000000)}`,
      },
      { value: "30000000-0", label: `${formatPrice(30000000)}+` },
    ];

    if (activeFilter === "rent") {
      return [
        baseOptions[0],
        { value: "any", label: "Any Price" },
        { value: "0-10000", label: `Under ${formatPrice(10000)}` },
        {
          value: "10000-20000",
          label: `${formatPrice(10000)} - ${formatPrice(20000)}`,
        },
        {
          value: "20000-40000",
          label: `${formatPrice(20000)} - ${formatPrice(40000)}`,
        },
        { value: "40000-0", label: `${formatPrice(40000)}+` },
      ];
    }
    return baseOptions;
  };

  return (
    <div className="bg-card rounded-xl shadow-sm p-6 mb-8 border border-border">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Property Type
          </label>
          <Tabs
            value={activeFilter}
            onValueChange={(value) => onFilterChange(value as "buy" | "rent")}
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
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Price Range
          </label>
          <Select value={priceRange} onValueChange={onPriceRangeChange}>
            <SelectTrigger className="truncate w-full max-w-[200px]">
              <SelectValue placeholder="Select range" className="truncate" />
            </SelectTrigger>
            <SelectContent>
              {getPriceOptions().map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <span
                    title={option.label}
                    className="truncate block max-w-[220px]"
                  >
                    {option.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Bedrooms
          </label>
          <Select value={bedrooms} onValueChange={onBedroomsChange}>
            <SelectTrigger className="truncate w-full max-w-[200px]">
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
          {propertyCount} properties found
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-background/90 cursor-pointer bg-foreground"
          onClick={onReset}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterControls;
