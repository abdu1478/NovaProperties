import { Button } from "../ui/button";

const EmptyState = ({ onReset }: EmptyStateProps) => (
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
    <Button variant="secondary" onClick={onReset}>
      Reset All Filters
    </Button>
  </div>
);

interface EmptyStateProps {
  onReset: () => void;
}

export default EmptyState;
