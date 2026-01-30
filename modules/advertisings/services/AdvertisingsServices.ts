import { ModifyAdvertisingRequest, UpdateAdvertisingWithPricingRequest } from "../domain";
import { createAdvertisingsRepository } from "../repositories/AdvertisingsRepository";
import {
  validateAdvertisingResponseHandled,
  validatePricingRulesArrayResponseHandled,
  validateAdvertisingExtrasArrayResponseHandled,
  validateAdvertisingOffersArrayResponseHandled,
  validateUpdateAdvertisingWithPricingResponseHandled,
  validateUpdateAdvertisingWithPricingRequestHandled,
  validateModifyAdvertisingResponseHandled,
  validateModifyAdvertisingRequestHandled,
} from "../validators";
import { IAdvertisingsServices } from "./IAdvertisingsServices";

export function createAdvertisingsServices(): IAdvertisingsServices {
  const repository = createAdvertisingsRepository();

  return {
    getAdvertisingById: async (token: string, id: string) => {
      const rawData = await repository.getAdvertisingById(token, id);
      const validatedData = validateAdvertisingResponseHandled(rawData);
      return validatedData;
    },

    getPricingRulesByAdvertisingId: async (
      token: string,
      advertisingId: number
    ) => {
      const rawData = await repository.getPricingRulesByAdvertisingId(
        token,
        advertisingId
      );
      const validatedData = validatePricingRulesArrayResponseHandled(rawData);
      return validatedData;
    },

    getExtrasByAdvertisingId: async (token: string, advertisingId: number) => {
      const rawData = await repository.getExtrasByAdvertisingId(
        token,
        advertisingId
      );
      const validatedData =
        validateAdvertisingExtrasArrayResponseHandled(rawData);
      return validatedData;
    },

    getOffersByAdvertisingId: async (token: string, advertisingId: number) => {
      const rawData = await repository.getOffersByAdvertisingId(
        token,
        advertisingId
      );
      const validatedData =
        validateAdvertisingOffersArrayResponseHandled(rawData);
      return validatedData;
    },

    updateAdvertisingWithPricing: async (
      token: string,
      vehicleId: string,
      data: UpdateAdvertisingWithPricingRequest
    ) => {
      const validatedRequest = validateUpdateAdvertisingWithPricingRequestHandled(data);
      const rawData = await repository.updateAdvertisingWithPricing(
        token,
        vehicleId,
        validatedRequest
      );
      const validatedData =
        validateUpdateAdvertisingWithPricingResponseHandled(rawData);
      return validatedData;
    },

    toggleAdvertisingStatus: async (token: string, advertisingId: number, isActive: boolean) => {
      // Get current advertising data
      const currentAdvertising = await repository.getAdvertisingById(token, advertisingId.toString());
      const validatedAdvertising = validateAdvertisingResponseHandled(currentAdvertising);

      // Build request with current data + new is_active status
      const request: ModifyAdvertisingRequest = {
        is_active: isActive,
        name: validatedAdvertising.name,
        description: validatedAdvertising.description,
        minimum_days: validatedAdvertising.minimum_days,
        max_daily_km: validatedAdvertising.max_daily_km,
        security_deposit_amount: validatedAdvertising.security_deposit_amount,
        cancellation_policy_id: validatedAdvertising.cancellation_policy_id,
      };

      // Use existing changeActiveStatusOfAdvertising method
      const validatedRequest = validateModifyAdvertisingRequestHandled(request);
      const rawData = await repository.toggleAdvertisingStatus(token, advertisingId, validatedRequest);
      const validatedData = validateModifyAdvertisingResponseHandled(rawData);
      return validatedData;
    },
  };
}
