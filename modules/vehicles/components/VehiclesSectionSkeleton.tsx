"use client";

import { VehicleCardSkeleton } from "./VehicleCardSkeleton";
import { useTranslation } from "react-i18next";

export const VehiclesSectionSkeleton = () => {
  const { t } = useTranslation("fleet");

  return (
    <section className="py-36 md:py-52 md:my-20">
      <div className="container mx-auto px-10 md:px-20">
        <div className="space-y-8">
          {/* Header Section Skeleton */}
          <div className="text-start space-y-4">
            <h2 className="text-3xl md:text-4xl font-normal cursor-default">
              {t("fleet_section.title", "Our Fleet")}
            </h2>
            <p className="text-base md:text-lg cursor-default">
              {t("fleet_section.subtitle", "Discover our fleet of campers")}
            </p>
          </div>

          {/* Cards Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <VehicleCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
