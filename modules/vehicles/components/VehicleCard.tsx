"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { VehicleCompleteListing } from "@/modules/vehicles/domain";
import { CamperIcon, MapPinIcon } from "@/components/icons/JourneySectionIcons";
import { Users } from "@/components/icons/Users";
import { getCamperTypeLabel } from "@/utils/vehicle-translations";

interface VehicleCardProps {
  vehicle: VehicleCompleteListing;
  index: number;
  onViewDetails: (vehicle: VehicleCompleteListing) => void;
}

export const VehicleCard = ({
  vehicle,
  index,
  onViewDetails,
}: VehicleCardProps) => {
  const { t } = useTranslation("fleet");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all bg-white flex flex-col"
    >
      {/* Image Section */}
      <div className="w-full h-64 relative">
        {vehicle.images?.[0] ? (
          <Image
            src={vehicle.images[0]}
            alt={vehicle.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-border cursor-default">
              {t("no_image", "No image available")}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 p-6 flex flex-col">
        {/* Title */}
        <h2 className="text-xl font-bold mb-4 cursor-default text-border">
          {vehicle.name}
        </h2>

        {/* Features Icons */}
        <div className="flex flex-col gap-3 mb-4 border-y border-border/30 py-4">
          <div className="flex items-center text-sm">
            <Users className="w-5 h-5 mr-2 fill-border" />
            <span className="cursor-default text-border text-sm">
              {vehicle.passengers} {t("passengers", "passengers")}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <CamperIcon className="w-5 h-5 mr-2" fillClassName="fill-border" />
            <span className="cursor-default text-border text-sm">
              {getCamperTypeLabel(vehicle.type, t)}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <MapPinIcon
              className="w-5 h-5 mr-2 text-border"
              circleClassName="text-white"
            />
            <span className="cursor-default text-border text-sm">
              {vehicle.location.city}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="cursor-default text-border line-clamp-3 mb-4 text-sm">
            {vehicle.description}
          </span>
        </div>

        {/* View Details Button */}
        <Button
          variant="outline"
          className="w-full rounded-full border-border text-border mt-auto"
          onClick={() => onViewDetails(vehicle)}
        >
          {t("view_details", "View details")}
        </Button>
      </div>
    </motion.div>
  );
};
