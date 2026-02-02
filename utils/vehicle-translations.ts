/**
 * Vehicle type translation utilities.
 */

const CAMPER_TYPE_LABELS: Record<string, string> = {
  motorhome: "Motorhome",
  campervan: "Campervan",
  caravan: "Caravan",
  trailer: "Trailer",
  rooftop_tent: "Rooftop Tent",
  converted_van: "Converted Van",
};

/**
 * Get human-readable label for a camper type.
 * @param type - The camper type key
 * @param t - Optional translation function (for i18n compatibility)
 */
export function getCamperTypeLabel(type: string, t?: (key: string) => string): string {
  // If translation function provided, try to use it
  if (t) {
    const translated = t(`camper_types.${type}`);
    // If translation exists (not equal to key), use it
    if (translated !== `camper_types.${type}`) {
      return translated;
    }
  }
  return CAMPER_TYPE_LABELS[type] || type;
}
