import { Skeleton } from "@/components/ui/skeleton";

export const VehicleFleetCardSkeleton = () => {
  return (
    <div className="rounded-xl overflow-hidden shadow-md bg-white flex flex-col animate-pulse">
      <div className="flex flex-col md:flex-row">
        {/* Image Section Skeleton */}
        <div className="w-full md:w-2/5 h-64 md:h-auto relative">
          <Skeleton className="h-full w-full" />
          {/* Min days badge skeleton */}
          <div className="absolute top-4 left-4">
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>

        {/* Content Section Skeleton */}
        <div className="flex-1 p-6">
          {/* Title and Location */}
          <div className="flex flex-col md:flex-row justify-between mb-2">
            <Skeleton className="h-8 w-3/4 mb-4 md:mb-0" />
            <div className="flex items-center mt-2 md:mt-0">
              <Skeleton className="h-5 w-5 rounded-full mr-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          {/* Description Skeleton */}
          <div className="mb-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          {/* Type & Model Skeleton */}
          <div className="mb-4">
            <Skeleton className="h-4 w-32 mb-2" />
            <div className="flex flex-wrap gap-2 items-center">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-1" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>

          {/* Quick Stats Skeleton */}
          <div className="flex gap-4 text-sm mb-4 flex-wrap">
            <div className="flex items-center">
              <Skeleton className="h-4 w-4 rounded-full mr-2" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex items-center">
              <Skeleton className="h-5 w-5 rounded-full mr-2" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>

          {/* Amenities Preview Skeleton */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-18 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
          </div>

          {/* Pricing Section Skeleton */}
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-2">
                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-6 w-2" />
                  <Skeleton className="h-7 w-28" />
                </div>
                {/* Price details */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-28 rounded-full" />
                </div>
              </div>

              {/* View Details Button Skeleton */}
              <Skeleton className="h-10 w-full sm:w-32 rounded-md" />
            </div>

            {/* WhatsApp Button Skeleton */}
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};
