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
      { value: "0-250000", label: `Under ${formatPrice(250000)}` },
      {
        value: "250000-500000",
        label: `${formatPrice(250000)} - ${formatPrice(500000)}`,
      },
      {
        value: "500000-1000000",
        label: `${formatPrice(500000)} - ${formatPrice(1000000)}`,
      },
      { value: "1000000-0", label: `${formatPrice(1000000)}+` },
    ];

    if (activeFilter === "rent") {
      return [
        baseOptions[0],
        {
          value: "0-10000",
          label: `Under ${formatPrice(10000)}`,
        },
        {
          value: "10000-25000",
          label: `${formatPrice(10000)} - ${formatPrice(25000)}`,
        },
        {
          value: "25000-50000",
          label: `${formatPrice(25000)} - ${formatPrice(50000)}`,
        },
        { value: "50000-0", label: `${formatPrice(50000)}+` },
      ];
    }
    return baseOptions;
  };

  return (
    <div className="bg-card rounded-xl shadow-sm p-6 mb-8 border border-border">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
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
            <SelectTrigger>
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              {getPriceOptions().map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
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
