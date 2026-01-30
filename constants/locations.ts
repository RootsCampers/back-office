import type { PredefinedLocation, MapCenter } from '@/types/camper-map'

/**
 * Predefined locations dictionary
 * Keys follow the format: "Country", "Country|State", "Country|State|City"
 * 
 * This is used to determine initial map center and zoom based on the search selection.
 * No external geocoding APIs are used - all coordinates are static.
 */
export const PREDEFINED_LOCATIONS: Record<string, PredefinedLocation> = {
  // === CHILE ===
  Chile: {
    center: [-33.4489, -70.6693],
    zoom: 5,
    type: 'country',
    label: 'Chile',
  },
  
  // Regions of Chile
  'Chile|Arica y Parinacota': {
    center: [-18.4746, -70.2979],
    zoom: 9,
    type: 'state',
    label: 'Arica y Parinacota',
  },
  'Chile|Tarapacá': {
    center: [-20.2208, -70.1431],
    zoom: 8,
    type: 'state',
    label: 'Tarapacá',
  },
  'Chile|Antofagasta': {
    center: [-23.6509, -70.3975],
    zoom: 7,
    type: 'state',
    label: 'Antofagasta',
  },
  'Chile|Atacama': {
    center: [-27.3668, -70.3323],
    zoom: 8,
    type: 'state',
    label: 'Atacama',
  },
  'Chile|Coquimbo': {
    center: [-29.9533, -71.3395],
    zoom: 8,
    type: 'state',
    label: 'Coquimbo',
  },
  'Chile|Valparaíso': {
    center: [-33.0472, -71.6127],
    zoom: 9,
    type: 'state',
    label: 'Valparaíso',
  },
  'Chile|RM': {
    center: [-33.4489, -70.6693],
    zoom: 10,
    type: 'state',
    label: 'Región Metropolitana',
  },
  'Chile|Región Metropolitana': {
    center: [-33.4489, -70.6693],
    zoom: 14,
    type: 'state',
    label: 'Región Metropolitana',
  },
  "Chile|O'Higgins": {
    center: [-34.1708, -70.7444],
    zoom: 9,
    type: 'state',
    label: "O'Higgins",
  },
  'Chile|Maule': {
    center: [-35.4264, -71.6554],
    zoom: 9,
    type: 'state',
    label: 'Maule',
  },
  'Chile|Ñuble': {
    center: [-36.6096, -72.1034],
    zoom: 9,
    type: 'state',
    label: 'Ñuble',
  },
  'Chile|Biobío': {
    center: [-36.8201, -73.0444],
    zoom: 9,
    type: 'state',
    label: 'Biobío',
  },
  'Chile|Araucanía': {
    center: [-38.7359, -72.5904],
    zoom: 9,
    type: 'state',
    label: 'Araucanía',
  },
  'Chile|Los Ríos': {
    center: [-39.8142, -73.2459],
    zoom: 9,
    type: 'state',
    label: 'Los Ríos',
  },
  'Chile|Los Lagos': {
    center: [-41.4717, -72.9369],
    zoom: 8,
    type: 'state',
    label: 'Los Lagos',
  },
  'Chile|Aysén': {
    center: [-45.5752, -72.0662],
    zoom: 7,
    type: 'state',
    label: 'Aysén',
  },
  'Chile|Magallanes': {
    center: [-53.1638, -70.9171],
    zoom: 7,
    type: 'state',
    label: 'Magallanes',
  },

  // Major cities in Chile
  'Chile|RM|Santiago': {
    center: [-33.4489, -70.6693],
    zoom: 12,
    type: 'city',
    label: 'Santiago',
  },
  'Chile|Valparaíso|Valparaíso': {
    center: [-33.0472, -71.6127],
    zoom: 13,
    type: 'city',
    label: 'Valparaíso',
  },
  'Chile|Valparaíso|Viña del Mar': {
    center: [-33.0153, -71.5500],
    zoom: 13,
    type: 'city',
    label: 'Viña del Mar',
  },
  'Chile|Biobío|Concepción': {
    center: [-36.8201, -73.0444],
    zoom: 13,
    type: 'city',
    label: 'Concepción',
  },
  'Chile|Araucanía|Temuco': {
    center: [-38.7359, -72.5904],
    zoom: 13,
    type: 'city',
    label: 'Temuco',
  },
  'Chile|Araucanía|Pucón': {
    center: [-39.2823, -71.9545],
    zoom: 13,
    type: 'city',
    label: 'Pucón',
  },
  'Chile|Los Lagos|Puerto Montt': {
    center: [-41.4693, -72.9424],
    zoom: 13,
    type: 'city',
    label: 'Puerto Montt',
  },
  'Chile|Los Lagos|Puerto Varas': {
    center: [-41.3167, -72.9833],
    zoom: 13,
    type: 'city',
    label: 'Puerto Varas',
  },
  'Chile|Coquimbo|La Serena': {
    center: [-29.9027, -71.2519],
    zoom: 13,
    type: 'city',
    label: 'La Serena',
  },
  'Chile|Antofagasta|San Pedro de Atacama': {
    center: [-22.9087, -68.1997],
    zoom: 13,
    type: 'city',
    label: 'San Pedro de Atacama',
  },
  'Chile|Magallanes|Punta Arenas': {
    center: [-53.1638, -70.9171],
    zoom: 12,
    type: 'city',
    label: 'Punta Arenas',
  },
  'Chile|Aysén|Coyhaique': {
    center: [-45.5752, -72.0662],
    zoom: 12,
    type: 'city',
    label: 'Coyhaique',
  },

  // === ARGENTINA ===
  Argentina: {
    center: [-34.6037, -58.3816],
    zoom: 4,
    type: 'country',
    label: 'Argentina',
  },

  // Provinces of Argentina
  'Argentina|Buenos Aires': {
    center: [-34.6037, -58.3816],
    zoom: 10,
    type: 'state',
    label: 'Buenos Aires',
  },
  'Argentina|CABA': {
    center: [-34.6037, -58.3816],
    zoom: 12,
    type: 'state',
    label: 'Ciudad Autónoma de Buenos Aires',
  },
  'Argentina|Mendoza': {
    center: [-32.8908, -68.8272],
    zoom: 9,
    type: 'state',
    label: 'Mendoza',
  },
  'Argentina|Córdoba': {
    center: [-31.4201, -64.1888],
    zoom: 9,
    type: 'state',
    label: 'Córdoba',
  },
  'Argentina|Santa Fe': {
    center: [-31.6107, -60.6973],
    zoom: 9,
    type: 'state',
    label: 'Santa Fe',
  },
  'Argentina|Neuquén': {
    center: [-38.9516, -68.0591],
    zoom: 8,
    type: 'state',
    label: 'Neuquén',
  },
  'Argentina|Río Negro': {
    center: [-40.8135, -63.0000],
    zoom: 7,
    type: 'state',
    label: 'Río Negro',
  },
  'Argentina|Chubut': {
    center: [-43.3000, -65.1023],
    zoom: 7,
    type: 'state',
    label: 'Chubut',
  },
  'Argentina|Santa Cruz': {
    center: [-48.7736, -70.1327],
    zoom: 6,
    type: 'state',
    label: 'Santa Cruz',
  },
  'Argentina|Tierra del Fuego': {
    center: [-54.8019, -68.3030],
    zoom: 8,
    type: 'state',
    label: 'Tierra del Fuego',
  },
  'Argentina|Salta': {
    center: [-24.7821, -65.4232],
    zoom: 8,
    type: 'state',
    label: 'Salta',
  },
  'Argentina|Jujuy': {
    center: [-24.1858, -65.2995],
    zoom: 9,
    type: 'state',
    label: 'Jujuy',
  },
  'Argentina|Misiones': {
    center: [-26.8753, -54.6516],
    zoom: 8,
    type: 'state',
    label: 'Misiones',
  },

  // Major cities in Argentina
  'Argentina|Buenos Aires|Buenos Aires': {
    center: [-34.6037, -58.3816],
    zoom: 13,
    type: 'city',
    label: 'Buenos Aires',
  },
  'Argentina|Mendoza|Mendoza': {
    center: [-32.8908, -68.8272],
    zoom: 13,
    type: 'city',
    label: 'Mendoza',
  },
  'Argentina|Córdoba|Córdoba': {
    center: [-31.4201, -64.1888],
    zoom: 13,
    type: 'city',
    label: 'Córdoba',
  },
  'Argentina|Neuquén|San Martín de los Andes': {
    center: [-40.1589, -71.3540],
    zoom: 13,
    type: 'city',
    label: 'San Martín de los Andes',
  },
  'Argentina|Río Negro|Bariloche': {
    center: [-41.1335, -71.3103],
    zoom: 12,
    type: 'city',
    label: 'San Carlos de Bariloche',
  },
  'Argentina|Río Negro|San Carlos de Bariloche': {
    center: [-41.1335, -71.3103],
    zoom: 12,
    type: 'city',
    label: 'San Carlos de Bariloche',
  },
  'Argentina|Chubut|Puerto Madryn': {
    center: [-42.7692, -65.0385],
    zoom: 13,
    type: 'city',
    label: 'Puerto Madryn',
  },
  'Argentina|Santa Cruz|El Calafate': {
    center: [-50.3408, -72.2647],
    zoom: 12,
    type: 'city',
    label: 'El Calafate',
  },
  'Argentina|Santa Cruz|El Chaltén': {
    center: [-49.3315, -72.8867],
    zoom: 13,
    type: 'city',
    label: 'El Chaltén',
  },
  'Argentina|Tierra del Fuego|Ushuaia': {
    center: [-54.8019, -68.3030],
    zoom: 12,
    type: 'city',
    label: 'Ushuaia',
  },
  'Argentina|Salta|Salta': {
    center: [-24.7821, -65.4232],
    zoom: 13,
    type: 'city',
    label: 'Salta',
  },
  'Argentina|Misiones|Puerto Iguazú': {
    center: [-25.5972, -54.5786],
    zoom: 13,
    type: 'city',
    label: 'Puerto Iguazú',
  },
} as const

/**
 * Default location fallback
 */
export const DEFAULT_LOCATION: PredefinedLocation = {
  center: [-33.4489, -70.6693], // Santiago, Chile
  zoom: 5,
  type: 'country',
  label: 'Chile',
}

/**
 * Default zoom levels by location type
 */
export const DEFAULT_ZOOM_LEVELS = {
  country: 5,
  state: 9,
  city: 13,
} as const

/**
 * Get initial view configuration for a location key
 * Falls back to country, then default location
 */
export function getInitialView(selectedLocationKey?: string | null): PredefinedLocation {
  // Return default if no key provided
  if (!selectedLocationKey) {
    return DEFAULT_LOCATION
  }

  // Try exact match first
  if (PREDEFINED_LOCATIONS[selectedLocationKey]) {
    return PREDEFINED_LOCATIONS[selectedLocationKey]
  }

  // Try to find a parent location (e.g., if city not found, try state, then country)
  const parts = selectedLocationKey.split('|')
  
  // Try state level (Country|State)
  if (parts.length >= 2) {
    const stateKey = `${parts[0]}|${parts[1]}`
    if (PREDEFINED_LOCATIONS[stateKey]) {
      return PREDEFINED_LOCATIONS[stateKey]
    }
  }

  // Try country level
  if (parts.length >= 1 && PREDEFINED_LOCATIONS[parts[0]]) {
    return PREDEFINED_LOCATIONS[parts[0]]
  }

  // Return default location
  return DEFAULT_LOCATION
}

/**
 * Parse a location key into its components
 */
export function parseLocationKey(key?: string | null): {
  type: 'country' | 'state' | 'city'
  country: string
  state?: string
  city?: string
} {
  if (!key) {
    return {
      type: 'country',
      country: 'Chile',
    }
  }

  const parts = key.split('|')
  
  if (parts.length === 3) {
    return {
      type: 'city',
      country: parts[0],
      state: parts[1],
      city: parts[2],
    }
  } else if (parts.length === 2) {
    return {
      type: 'state',
      country: parts[0],
      state: parts[1],
    }
  }
  
  return {
    type: 'country',
    country: parts[0] || 'Chile',
  }
}

/**
 * Get country center coordinates
 */
export function getCountryCenter(country: string): MapCenter {
  const location = PREDEFINED_LOCATIONS[country]
  return location?.center || DEFAULT_LOCATION.center
}
