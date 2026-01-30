import { createVehiclesService } from "@/modules/vehicles/services/VehiclesService";
import { ApiError } from "@/lib/api/errors";
import { ERROR_CODES } from "@/lib/constants/errorCodes";
import {
  VehiclesData,
  VehiclesSearchParams,
  VehicleListingDetails,
  VehiclesCompleteListingData,
} from "../domain";

interface VehiclesServerProps {
  searchParams?: VehiclesSearchParams;
  vehicleId?: string;
  completeListings?: boolean;
  children: (data: {
    vehiclesData?: VehiclesData | null;
    vehicleListingDetailsData?: VehicleListingDetails | null;
    vehiclesCompleteListingsData?: VehiclesCompleteListingData | null;
    errorCode?: string;
  }) => React.ReactNode;
}

export default async function VehiclesServer({
  searchParams,
  vehicleId,
  completeListings = false,
  children,
}: VehiclesServerProps) {
  try {
    const vehiclesService = createVehiclesService();

    // if searchParams are provided, get vehicles with search params
    if (searchParams) {
      const vehiclesData = await vehiclesService.getVehiclesWithSearchParams(
        searchParams,
      );
      return <>{children({ vehiclesData, errorCode: undefined })}</>;
    }

    // if vehicleId is provided, get vehicle listing details by id
    if (vehicleId) {
      const vehicleListingDetailsData =
        await vehiclesService.getVehicleListingDetailsById(vehicleId);
      return (
        <>{children({ vehicleListingDetailsData, errorCode: undefined })}</>
      );
    }

    //  default case: get vehicles complete listings data
    const vehiclesCompleteListingsData =
      await vehiclesService.getVehiclesCompleteListings();
    return (
      <>{children({ vehiclesCompleteListingsData, errorCode: undefined })}</>
    );
  } catch (error) {
    console.error("Error fetching vehicles data:", error);
    const errorCode =
      error instanceof ApiError ? error.tag : ERROR_CODES.UNKNOWN_ERROR;
    return (
      <>
        {children({
          vehiclesData: null,
          vehicleListingDetailsData: null,
          vehiclesCompleteListingsData: null,
          errorCode,
        })}
      </>
    );
  }
}
