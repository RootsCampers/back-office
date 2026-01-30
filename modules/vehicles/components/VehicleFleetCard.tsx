import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Users } from "@/components/icons/Users";
import { Button } from "@/components/ui/button";
import { CamperWhatsAppButton } from "@/components/camper-hire/CamperWhatsAppButton";
import { formatTranslationKey } from "@/utils/translation-helpers";
import { VehicleCompleteListing } from "@/modules/vehicles/domain";
import { MapPinIcon } from "@/components/icons/JourneySectionIcons";
import { getCamperTypeLabel } from "@/utils/vehicle-translations";
import { LivingOnTheRoadIcon } from "@/components/icons/AmenitiesCategoriesIcons";
import { formatCurrencyCLP } from "@/utils/currency";

interface VehicleFleetCardProps {
  camper: VehicleCompleteListing;
  index: number;
  onViewDetails: (camper: VehicleCompleteListing) => void;
}

export const VehicleFleetCard = ({
  camper,
  index,
  onViewDetails,
}: VehicleFleetCardProps) => {
  const { t } = useTranslation("fleet");

  const priceRange = camper.advertising.price_range;
  const showPriceRange = priceRange.min_price !== priceRange.max_price;

  // Check if any pricing rules have tier pricing (volume discounts)
  const hasVolumeDiscounts = camper.advertising.pricing_rules.some(
    (rule) =>
      rule.tier_pricing !== null &&
      rule.tier_pricing !== undefined &&
      Object.keys(rule.tier_pricing).length > 0,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all bg-white flex flex-col"
    >
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="w-full md:w-2/5 h-64 md:h-auto relative">
          {camper.images?.[0] ? (
            <Image
              src={camper.images[0]}
              alt={camper.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-border cursor-default">
                {t("no_image", "No image available")}
              </span>
            </div>
          )}

          {camper.advertising.minimum_days > 1 && (
            <div className="absolute top-4 left-4">
              <Badge variant="tertiary" className="font-medium cursor-default">
                {t("min_days", {
                  days: camper.advertising.minimum_days,
                  defaultValue: `${camper.advertising.minimum_days} days min`,
                })}
              </Badge>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6">
          <div className="flex flex-col md:flex-row justify-between mb-2">
            <h2 className="text-2xl font-bold mb-2 cursor-default text-border">
              {camper.name}
            </h2>
            <div className="flex items-center mt-2 md:mt-0">
              <MapPinIcon
                className="w-5 h-5 mr-2 text-border"
                circleClassName="text-white"
              />
              <span className="cursor-default text-border text-sm">
                {camper.location.country}, {camper.location.city}
              </span>
            </div>
          </div>

          {/* Description */}
          <span className="cursor-default text-border line-clamp-3 text-sm mb-4">
            {camper.description}
          </span>

          {/* Type & Model */}
          <div className="mb-4">
            <div className="text-sm font-medium text-border mb-2 cursor-default">
              {t("vehicle_info", "Vehicle Information")}
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <Badge variant="tertiary" className="font-medium cursor-default">
                {getCamperTypeLabel(camper.type, t)}
              </Badge>
              <span className="text-border cursor-default">•</span>
              <span className="text-sm text-border font-medium cursor-default">
                {camper.manufacturer} {camper.model} (
                {camper.year_of_registration})
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-4 text-sm mb-4 flex-wrap">
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2 fill-border" />
              <span className="cursor-default text-border text-sm">
                {camper.passengers} {t("passengers", "passengers")}
              </span>
            </div>
            {camper.advertising.max_daily_km && (
              <div className="flex items-center">
                <LivingOnTheRoadIcon
                  className="h-5 w-5 text-border flex-shrink-0 mr-2"
                  fillClassName="text-border"
                />
                <span className="cursor-default text-border text-sm">
                  {camper.advertising.max_daily_km} km/day
                </span>
              </div>
            )}
          </div>

          {/* Amenities Preview */}
          {camper.available_amenities.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {camper.available_amenities.slice(0, 3).map((amenity, idx) => (
                  <Badge
                    key={idx}
                    variant="tertiary"
                    className="text-xs cursor-default"
                  >
                    {t(`amenities.${formatTranslationKey(amenity)}`, amenity)}
                  </Badge>
                ))}
                {camper.available_amenities.length > 3 && (
                  <Badge variant="tertiary" className="text-xs cursor-default">
                    +{camper.available_amenities.length - 3} {t("more", "more")}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Pricing Section */}
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col">
                {showPriceRange ? (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-border cursor-default">
                        CLP {formatCurrencyCLP(priceRange.min_price)}
                      </span>
                      <span className="text-border cursor-default text-lg font-bold">
                        -
                      </span>
                      <span className="text-xl font-bold text-border cursor-default">
                        {formatCurrencyCLP(priceRange.max_price)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-gray-600 cursor-default">
                        {t("per_day", "per day")} •{" "}
                        {t("seasonal_pricing", "Seasonal pricing")}
                      </span>
                      {hasVolumeDiscounts && (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-300 text-xs cursor-default"
                        >
                          {t("volume_discounts", "Volume discounts")}
                        </Badge>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-2xl font-bold text-border cursor-default">
                      {formatCurrencyCLP(camper.advertising.base_price_per_day)}
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-gray-600 cursor-default">
                        {t("per_day", "per day")}
                      </span>
                      <span className="text-xs text-gray-500 cursor-default">
                        (~USD{" "}
                        {Math.round(
                          camper.advertising.base_price_per_day / 950,
                        )}
                        )
                      </span>
                      {hasVolumeDiscounts && (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-300 text-xs cursor-default"
                        >
                          {t("volume_discounts", "Volume discounts")}
                        </Badge>
                      )}
                    </div>
                  </>
                )}
              </div>

              <Button className="w-auto" onClick={() => onViewDetails(camper)}>
                {t("view_details", "View Details")}
              </Button>
            </div>

            {/* WhatsApp Contact Button */}
            <CamperWhatsAppButton
              camperName={camper.name}
              camperId={camper.id}
              camperType={camper.type}
              location={`${camper.location.country}, ${camper.location.city}`}
              variant="outline"
              size="default"
              className="w-full border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
