import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function AgentDetailSkeleton() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section Skeleton */}
      <section className="bg-muted py-12 md:py-16">
        <div className="container mx-auto px-4">
          <Skeleton className="h-12 w-80 mx-auto" />
        </div>
      </section>

      {/* Profile Section Skeleton */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Agent Image Skeleton */}
            <div className="lg:col-span-1">
              <Skeleton className="w-full h-80 md:h-96 rounded-lg" />
            </div>

            {/* Agent Details Skeleton */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-6 w-48" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>

              {/* Contact Buttons Skeleton */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Skeleton className="h-11 w-32" />
                <Skeleton className="h-11 w-32" />
              </div>

              {/* Specialties Skeleton */}
              <div className="space-y-3">
                <Skeleton className="h-6 w-32" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-8 w-28" />
                </div>
              </div>
            </div>
          </div>

          {/* Listings Section Skeleton */}
          <div className="mt-16">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
