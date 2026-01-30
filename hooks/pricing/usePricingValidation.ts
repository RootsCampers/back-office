import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { PricingRule, PricingStrategy } from "@/types/pricing";

export interface PricingValidationError {
  type: string;
  message: string;
  ruleIndex?: number;
  tierIndex?: number;
}

export interface PricingValidationResult {
  hasErrors: boolean;
  errors: PricingValidationError[];
}

export const usePricingValidation = (
  rules: PricingRule[],
  minimumDays: number,
  validateYearCoverage: (rules: PricingRule[]) => boolean,
  strategy?: PricingStrategy | null,
): PricingValidationResult => {
  const { t } = useTranslation("pricing");

  return useMemo(() => {
    const errors: PricingValidationError[] = [];

    // Validate rules exist
    if (!rules || rules.length === 0) {
      return {
        hasErrors: true,
        errors: [
          {
            type: "no_rules",
            message:
              t("validation.errors.noRules") ||
              "At least one pricing rule is required",
          },
        ],
      };
    }

    // Validate year coverage
    if (!validateYearCoverage(rules)) {
      errors.push({
        type: "incomplete_year_coverage",
        message:
          t("validation.errors.incompleteYearCoverage") ||
          "Pricing rules must cover the entire year (January 1 - December 31)",
      });
    }

    // Validate each rule
    rules.forEach((rule, ruleIndex) => {
      // Validate rule name - skip validation for flat_rate and flat_rate_with_tiers
      // These strategies don't have user-editable names
      const shouldSkipNameValidation = strategy === "flat_rate" || strategy === "flat_rate_with_tiers";
      if (!shouldSkipNameValidation && (!rule.name || !rule.name.trim())) {
        errors.push({
          type: "missing_name",
          message:
            t("validation.errors.missingName") ||
            "A pricing rule is missing a name",
          ruleIndex,
        });
      }

      // Validate price per day
      if (rule.price_per_day == null || rule.price_per_day <= 0) {
        errors.push({
          type: "invalid_price",
          message:
            t("validation.errors.invalidPrice") ||
            "A pricing rule has an invalid or missing price",
          ruleIndex,
        });
      } else if (rule.price_per_day > 0 && rule.price_per_day < 1000) {
        errors.push({
          type: "price_too_low",
          message:
            t("validation.errors.priceTooLow", {
              price: rule.price_per_day,
            }) ||
            `A pricing rule has a price below minimum (${rule.price_per_day} < 1000 CLP)`,
          ruleIndex,
        });
      }

      // Validate tiers if they exist
      if (rule.tier_pricing && rule.tier_pricing.tiers) {
        const tiers = rule.tier_pricing.tiers
          .map((tier, originalIndex) => ({
            ...tier,
            originalIndex,
          }))
          .sort((a, b) => (a.min_days || 0) - (b.min_days || 0));

        tiers.forEach((tier, sortedIndex) => {
          const tierIndex = tier.originalIndex;
          const displayTierNumber = tierIndex + 1;

          // Validate tier price
          if (tier.price_per_day == null || tier.price_per_day <= 0) {
            errors.push({
              type: "tier_invalid_price",
              message:
                t("validation.errors.tierInvalidPrice", {
                  tierNumber: displayTierNumber,
                }) ||
                `Tier ${displayTierNumber} has an invalid or missing price`,
              ruleIndex,
              tierIndex,
            });
          } else if (tier.price_per_day > 0 && tier.price_per_day < 1000) {
            errors.push({
              type: "tier_price_too_low",
              message:
                t("validation.errors.tierPriceTooLow", {
                  tierNumber: displayTierNumber,
                  price: tier.price_per_day,
                }) ||
                `Tier ${displayTierNumber} has a price below minimum (${tier.price_per_day} < 1000 CLP)`,
              ruleIndex,
              tierIndex,
            });
          }

          // Require max_days if not the final tier (which can be unlimited)
          if (sortedIndex < tiers.length - 1 && tier.max_days === null) {
            errors.push({
              type: "tier_max_days_missing",
              message:
                t("validation.errors.tierMaxDaysMissing", {
                  tierNumber: displayTierNumber,
                }) ||
                `Tier ${displayTierNumber} must include a maximum days value`,
              ruleIndex,
              tierIndex,
            });
          }

          // Validate min_days <= max_days (if max_days is not null)
          if (tier.max_days !== null && tier.max_days < tier.min_days) {
            errors.push({
              type: "tier_range_invalid",
              message:
                t("validation.errors.tierRangeInvalid", {
                  tierNumber: displayTierNumber,
                  maxDays: tier.max_days,
                  minDays: tier.min_days,
                }) ||
                `Tier ${displayTierNumber} has invalid range (max_days ${tier.max_days} < min_days ${tier.min_days})`,
              ruleIndex,
              tierIndex,
            });
          }

          // Validate first tier covers minimum days
          if (
            sortedIndex === 0 &&
            tier.max_days !== null &&
            tier.max_days < minimumDays
          ) {
            errors.push({
              type: "tier_minimum_days",
              message:
                t("validation.errors.tierMinimumDays", {
                  minimum: minimumDays,
                  maxDays: tier.max_days,
                }) ||
                `The first tier must cover at least ${minimumDays} days (minimum rental days), but max_days is ${tier.max_days}`,
              ruleIndex,
              tierIndex,
            });
          }

          if (sortedIndex > 0) {
            const prevTier = tiers[sortedIndex - 1];
            if (
              prevTier.max_days === null ||
              tier.min_days <= (prevTier.max_days ?? 0)
            ) {
              errors.push({
                type: "tier_overlap",
                message:
                  t("validation.errors.tierOverlap", {
                    tierNumber: displayTierNumber,
                  }) ||
                  `Tier ${displayTierNumber} overlaps with the previous tier`,
                ruleIndex,
                tierIndex,
              });
            }
          }
        });
      }
    });

    return {
      hasErrors: errors.length > 0,
      errors,
    };
  }, [rules, minimumDays, validateYearCoverage, strategy, t]);
};
