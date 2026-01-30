export const VehicleCardSkeleton = () => {
  return (
    <div className="rounded-xl overflow-hidden shadow-md bg-white flex flex-col animate-pulse">
      {/* Image Section Skeleton */}
      <div className="w-full h-64 bg-gray-200" />

      <div className="flex-1 p-6 flex flex-col">
        {/* Title Skeleton */}
        <div className="h-6 bg-gray-200 rounded mb-4 w-3/4" />

        {/* Features Icons Skeleton */}
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-gray-200 rounded mr-2" />
            <div className="h-4 bg-gray-200 rounded w-24" />
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 bg-gray-200 rounded mr-2" />
            <div className="h-4 bg-gray-200 rounded w-20" />
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 bg-gray-200 rounded mr-2" />
            <div className="h-4 bg-gray-200 rounded w-28" />
          </div>
        </div>

        {/* Button Skeleton */}
        <div className="w-full h-10 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
};
