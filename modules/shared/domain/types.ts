export enum RVType {
  CAMPER = "camper",
  BOX_VAN = "box_van",
  SEMI_INTEGRATED = "semi_integrated",
  INTEGRATED = "integrated",
  ALCOVE = "alcove",
  CARAVAN = "caravan",
  WITH_ROOFTOP_TENT = "with_rooftop_tent",
  OTHER = "other",
}

export const RVTypeLabels: Record<RVType, string> = {
  [RVType.CAMPER]: "Camper",
  [RVType.BOX_VAN]: "Box Van",
  [RVType.SEMI_INTEGRATED]: "Semi Integrated",
  [RVType.INTEGRATED]: "Integrated",
  [RVType.ALCOVE]: "Alcove",
  [RVType.CARAVAN]: "Caravan",
  [RVType.WITH_ROOFTOP_TENT]: "Car with Rooftop Tent",
  [RVType.OTHER]: "Other",
};

export enum TransmissionType {
  MANUAL = "manual",
  AUTOMATIC = "automatic",
  SEMI_AUTOMATIC = "semi_automatic",
}

export enum FuelType {
  DIESEL = "diesel",
  PETROL = "petrol",
  ELECTRIC = "electric",
  HYBRID = "hybrid",
  PLUG_IN_HYBRID = "plug_in_hybrid",
  HYDROGEN = "hydrogen",
  LPG = "lpg",
  NATURAL_GAS = "natural_gas",
}

// Common languages
export const CommonLanguages = [
  "Spanish",
  "English",
  "Portuguese",
  "French",
  "German",
  "Italian",
  "Dutch",
  "Chinese",
  "Japanese",
  "Korean",
  "Arabic",
  "Russian",
] as const;

// Language proficiency levels
export enum LanguageProficiency {
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate",
  ADVANCED = "Advanced",
  NATIVE = "Native",
}

export const LanguageProficiencyLabels: Record<LanguageProficiency, string> = {
  [LanguageProficiency.BEGINNER]: "Beginner",
  [LanguageProficiency.INTERMEDIATE]: "Intermediate",
  [LanguageProficiency.ADVANCED]: "Advanced",
  [LanguageProficiency.NATIVE]: "Native",
};

// Common nationalities for Latin America
export const CommonNationalities = [
  "Argentine",
  "Chilean",
  "Brazilian",
  "Peruvian",
  "Colombian",
  "Venezuelan",
  "Ecuadorian",
  "Bolivian",
  "Paraguayan",
  "Uruguayan",
  "Mexican",
  "American",
  "Canadian",
  "Spanish",
  "French",
  "German",
  "Italian",
  "British",
  "Other",
] as const;

export interface Language {
  language: string;
  level: string;
}

export enum UserBookingStatus {
  PENDING_PAYMENT = "pending_payment",
  PAYMENT_PROCESSING = "payment_processing",
  PAYMENT_FAILED = "payment_failed",
  PAID = "paid",
  PENDING_CONFIRMATION = "pending_confirmation",
  CONFIRMED = "confirmed",
  DEPOSIT_PENDING = "deposit_pending",
  DEPOSIT_PAID = "deposit_paid",
  ACTIVE = "active",
  COMPLETED = "completed",
  CANCELLATION_REQUESTED = "cancellation_requested",
  CANCELLED_BY_TRAVELER = "cancelled_by_traveler",
  CANCELLED_BY_OWNER = "cancelled_by_owner",
  CANCELLED_BY_SYSTEM = "cancelled_by_system",
  REFUND_PENDING = "refund_pending",
  REFUND_PARTIAL = "refund_partial",
  REFUNDED = "refunded",
}

export const UserBookingStatusLabels = {
  [UserBookingStatus.PENDING_PAYMENT]: "Pending Payment",
  [UserBookingStatus.PAYMENT_PROCESSING]: "Payment Processing",
  [UserBookingStatus.PAYMENT_FAILED]: "Payment Failed",
  [UserBookingStatus.PAID]: "Paid",
  [UserBookingStatus.PENDING_CONFIRMATION]: "Pending Confirmation",
  [UserBookingStatus.CONFIRMED]: "Confirmed",
  [UserBookingStatus.DEPOSIT_PENDING]: "Deposit Pending",
  [UserBookingStatus.DEPOSIT_PAID]: "Deposit Paid",
  [UserBookingStatus.ACTIVE]: "Active",
  [UserBookingStatus.COMPLETED]: "Completed",
  [UserBookingStatus.CANCELLATION_REQUESTED]: "Cancellation Requested",
  [UserBookingStatus.CANCELLED_BY_TRAVELER]: "Cancelled by Traveler",
  [UserBookingStatus.CANCELLED_BY_OWNER]: "Cancelled by Owner",
  [UserBookingStatus.CANCELLED_BY_SYSTEM]: "Cancelled by System",
  [UserBookingStatus.REFUND_PENDING]: "Refund Pending",
  [UserBookingStatus.REFUND_PARTIAL]: "Refund Partial",
  [UserBookingStatus.REFUNDED]: "Refunded",
};

export enum TripOperationalStatus {
  ABORTED = "aborted",
  CANCELLED_BEFORE_START = "cancelled_before_start",
  CANCELLED_DURING_TRIP = "cancelled_during_trip",
  COMPLETED = "completed",
  IN_PROGRESS = "in_progress",
  PENDING = "pending",
  READY_FOR_PICKUP = "ready_for_pickup",
  SCHEDULED = "scheduled",
  RETURNING = "returned",
}

export const TripOperationalStatusLabels = {
  [TripOperationalStatus.ABORTED]: "Aborted",
  [TripOperationalStatus.CANCELLED_BEFORE_START]: "Cancelled Before Start",
  [TripOperationalStatus.CANCELLED_DURING_TRIP]: "Cancelled During Trip",
  [TripOperationalStatus.COMPLETED]: "Completed",
  [TripOperationalStatus.IN_PROGRESS]: "In Progress",
  [TripOperationalStatus.PENDING]: "Pending",
  [TripOperationalStatus.READY_FOR_PICKUP]: "Ready for Pickup",
  [TripOperationalStatus.SCHEDULED]: "Scheduled",
  [TripOperationalStatus.RETURNING]: "Returning",
};

export enum LatamCountry {
  ARGENTINA = 'argentina',
  CHILE = 'chile',
}

export const LatamCountryLabels: Record<LatamCountry, string> = {
  [LatamCountry.ARGENTINA]: 'Argentina',
  [LatamCountry.CHILE]: 'Chile',
}

export enum AmenityCategory {
  KITCHEN = 'Kitchen',
  BATHROOM = 'Bathroom',
  DRIVING_SAFETY = 'Driving safety',
  LIVING_ON_THE_ROAD = 'Living on the road',
  OTHER_FEATURES = 'Other features',
}

export enum Amenity {
  KITCHEN_WITH_SINK = 'Kitchen with sink',
  STOVE = 'Stove',
  OVEN = 'Oven',
  PORTABLE_GAS_COOKER = 'Portable gas cooker',
  REFRIGERATOR = 'Refrigerator',
  COOLER = 'Cooler',
  MICROWAVE = 'Microwave',
  KITCHEN_KIT = 'Kitchen Kit',
  DINING_TABLE = 'Dining table',
  INTEGRATED_BATHROOM_WITH_SHOWER = 'Integrated bathroom with shower',
  TOILET = 'Toilet',
  INSIDE_SHOWER = 'Inside shower',
  OUTSIDE_SHOWER = 'Outside shower',
  BACKUP_CAMERA = 'Backup camera',
  BACKUP_SENSORS = 'Backup sensors',
  LEVELLING_JACKS = 'Levelling jacks',
  TOW_HITCH = 'Tow hitch',
  TRIANGLE_AND_VESTS = 'Triangle and vests',
  INVERTER = 'Inverter',
  AIR_CONDITIONER = 'Air conditioner',
  GPS = 'GPS',
  AWNING = 'Awning',
  HOSE = 'Hose',
  TV = 'TV',
  SOLAR_PANELS = 'Solar panels',
  HEATER = 'Heater',
  CHILD_SEAT = 'Child seat',
  BIKE_RACK = 'Bike rack',
  BEDDING_KIT = 'Bedding Kit',
  GENERATOR = 'Generator',
}

// Create a reverse mapping to get amenities by category
export const amenitiesByCategory: Record<AmenityCategory, Amenity[]> = {
  [AmenityCategory.KITCHEN]: [
    Amenity.KITCHEN_WITH_SINK,
    Amenity.STOVE,
    Amenity.OVEN,
    Amenity.PORTABLE_GAS_COOKER,
    Amenity.REFRIGERATOR,
    Amenity.COOLER,
    Amenity.MICROWAVE,
    Amenity.KITCHEN_KIT,
    Amenity.DINING_TABLE,
  ],
  [AmenityCategory.BATHROOM]: [
    Amenity.INTEGRATED_BATHROOM_WITH_SHOWER,
    Amenity.TOILET,
    Amenity.INSIDE_SHOWER,
    Amenity.OUTSIDE_SHOWER,
  ],
  [AmenityCategory.DRIVING_SAFETY]: [
    Amenity.BACKUP_CAMERA,
    Amenity.BACKUP_SENSORS,
    Amenity.LEVELLING_JACKS,
    Amenity.TOW_HITCH,
    Amenity.TRIANGLE_AND_VESTS,
    Amenity.INVERTER,
  ],
  [AmenityCategory.LIVING_ON_THE_ROAD]: [
    Amenity.AIR_CONDITIONER,
    Amenity.GPS,
    Amenity.AWNING,
    Amenity.HOSE,
    Amenity.TV,
    Amenity.SOLAR_PANELS,
    Amenity.HEATER,
    Amenity.CHILD_SEAT,
    Amenity.BIKE_RACK,
  ],
  [AmenityCategory.OTHER_FEATURES]: [
    Amenity.BEDDING_KIT,
    Amenity.GENERATOR,
  ],
};
