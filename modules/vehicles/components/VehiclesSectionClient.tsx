"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { VehicleCard } from "./VehicleCard";
import { VehicleCardSkeleton } from "./VehicleCardSkeleton";
import { Button } from "@/components/ui/button";
import { isRetryableError } from "@/lib/constants/errorCodes";
import { VehicleCompleteListing, VehiclesCompleteListingData } from "../domain";

interface VehiclesSectionClientProps {
  initialData: VehiclesCompleteListingData | null;
  errorCode?: string;
}

export const VehiclesSectionClient = ({
  initialData,
  errorCode,
}: VehiclesSectionClientProps) => {
  const { t } = useTranslation(["home", "errors"]);
  const { lng } = useParams<{ lng: string }>();
  const router = useRouter();

  const handleViewDetails = (vehicle: VehicleCompleteListing) => {
    // Store in sessionStorage that we're navigating from home section
    if (typeof window !== "undefined") {
      sessionStorage.setItem("camperHireSource", "home");
    }

    // Navigate to detail page
    router.push(`/${lng}/camper-hire/${vehicle.id}`);
  };

  const handleViewAll = () => {
    router.push(`/${lng}/fleet`);
  };

  // Get first 3 campers
  const displayedVehicles = initialData?.fleet.slice(0, 3) || [];

  // Determine states
  const showEmptyState =
    !errorCode && initialData && displayedVehicles.length === 0;
  const showErrorState = Boolean(errorCode);
  const canRetry = errorCode && isRetryableError(errorCode);

  return (
    <section className="py-36 md:py-52 md:my-20">
      <div className="container mx-auto px-10 md:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Header Section */}
          <div className="text-start space-y-4">
            <h2
              className="text-3xl md:text-4xl font-normal cursor-default"
              suppressHydrationWarning
            >
              {t("fleet_section.title", "Our Fleet")}
            </h2>
            <p
              className="text-base md:text-lg cursor-default"
              suppressHydrationWarning
            >
              {t("fleet_section.subtitle", "Discover our fleet of campers")}
            </p>
          </div>

          {/* Content State */}
          {showErrorState ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {Array.from({ length: 3 }).map((_, index) => (
                  <VehicleCardSkeleton key={index} />
                ))}
              </div>
              <div className="flex flex-col items-center gap-4 pt-6">
                <p className="text-center text-lg text-destructive cursor-default">
                  {t(
                    `errors:${errorCode}`,
                    "Failed to load data. Please try again.",
                  )}
                </p>
                {/* Only show retry button for retryable errors */}
                {canRetry && (
                  <Button
                    onClick={() => router.refresh()}
                    className="h-12 rounded-full text-base font-semibold text-black transition"
                  >
                    {t("error.retry", "Retry")}
                  </Button>
                )}
              </div>
            </>
          ) : showEmptyState ? (
            <p className="text-center text-lg cursor-default">
              {t("fleet_section.no_campers", "No campers found")}
            </p>
          ) : (
            <>
              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {displayedVehicles.map((vehicle, index) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    index={index}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>

              {/* View All Button */}
              {initialData && (
                <div className="flex justify-center pt-2">
                  <Button
                    onClick={handleViewAll}
                    className="h-12 rounded-full text-base font-semibold"
                  >
                    {t("fleet_section.view_all", "View all")}
                  </Button>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};
