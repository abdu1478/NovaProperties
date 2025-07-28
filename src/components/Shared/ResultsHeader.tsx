import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ResultsHeaderProps {
  activeFilter: "buy" | "rent";
  sortOption: string;
  onSortChange: (value: string) => void;
}

const ResultsHeader = ({
  activeFilter,
  sortOption,
  onSortChange,
}: ResultsHeaderProps) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
    <h2 className="text-xl font-semibold text-foreground mb-4 md:mb-0">
      {activeFilter === "buy" ? "Properties For Sale" : "Properties For Rent"}
    </h2>

    <div className="flex gap-2">
      <Select value={sortOption} onValueChange={onSortChange}>
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
);

export default ResultsHeader;
