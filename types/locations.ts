/**
 * Chile regions and cities data for location selector.
 * Geographic ordering for consistent display.
 */

export interface ChileRegion {
  id: number;
  name: string;
}

export interface ChileCity {
  id: number;
  name: string;
  regionId: number;
}

// Regions ordered from North to South
export const chileRegions: ChileRegion[] = [
  { id: 1, name: "Arica y Parinacota" },
  { id: 2, name: "Tarapacá" },
  { id: 3, name: "Antofagasta" },
  { id: 4, name: "Atacama" },
  { id: 5, name: "Coquimbo" },
  { id: 6, name: "Valparaíso" },
  { id: 7, name: "Metropolitana de Santiago" },
  { id: 8, name: "O'Higgins" },
  { id: 9, name: "Maule" },
  { id: 10, name: "Ñuble" },
  { id: 11, name: "Biobío" },
  { id: 12, name: "La Araucanía" },
  { id: 13, name: "Los Ríos" },
  { id: 14, name: "Los Lagos" },
  { id: 15, name: "Aysén" },
  { id: 16, name: "Magallanes" },
];

// Cities ordered by region and importance
export const chileCities: ChileCity[] = [
  // Arica y Parinacota
  { id: 101, name: "Arica", regionId: 1 },
  { id: 102, name: "Putre", regionId: 1 },
  // Tarapacá
  { id: 201, name: "Iquique", regionId: 2 },
  { id: 202, name: "Alto Hospicio", regionId: 2 },
  // Antofagasta
  { id: 301, name: "Antofagasta", regionId: 3 },
  { id: 302, name: "Calama", regionId: 3 },
  { id: 303, name: "San Pedro de Atacama", regionId: 3 },
  // Atacama
  { id: 401, name: "Copiapó", regionId: 4 },
  { id: 402, name: "Vallenar", regionId: 4 },
  // Coquimbo
  { id: 501, name: "La Serena", regionId: 5 },
  { id: 502, name: "Coquimbo", regionId: 5 },
  { id: 503, name: "Ovalle", regionId: 5 },
  // Valparaíso
  { id: 601, name: "Valparaíso", regionId: 6 },
  { id: 602, name: "Viña del Mar", regionId: 6 },
  { id: 603, name: "San Antonio", regionId: 6 },
  // Metropolitana
  { id: 701, name: "Santiago", regionId: 7 },
  { id: 702, name: "Puente Alto", regionId: 7 },
  { id: 703, name: "Maipú", regionId: 7 },
  // O'Higgins
  { id: 801, name: "Rancagua", regionId: 8 },
  { id: 802, name: "San Fernando", regionId: 8 },
  // Maule
  { id: 901, name: "Talca", regionId: 9 },
  { id: 902, name: "Curicó", regionId: 9 },
  // Ñuble
  { id: 1001, name: "Chillán", regionId: 10 },
  // Biobío
  { id: 1101, name: "Concepción", regionId: 11 },
  { id: 1102, name: "Talcahuano", regionId: 11 },
  { id: 1103, name: "Los Ángeles", regionId: 11 },
  // La Araucanía
  { id: 1201, name: "Temuco", regionId: 12 },
  { id: 1202, name: "Pucón", regionId: 12 },
  { id: 1203, name: "Villarrica", regionId: 12 },
  // Los Ríos
  { id: 1301, name: "Valdivia", regionId: 13 },
  // Los Lagos
  { id: 1401, name: "Puerto Montt", regionId: 14 },
  { id: 1402, name: "Osorno", regionId: 14 },
  { id: 1403, name: "Puerto Varas", regionId: 14 },
  { id: 1404, name: "Castro", regionId: 14 },
  // Aysén
  { id: 1501, name: "Coyhaique", regionId: 15 },
  { id: 1502, name: "Puerto Aysén", regionId: 15 },
  // Magallanes
  { id: 1601, name: "Punta Arenas", regionId: 16 },
  { id: 1602, name: "Puerto Natales", regionId: 16 },
];
