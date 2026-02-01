/**
 * Vehicle-related types for selectors and forms.
 */

export interface VehicleModel {
  name: string;
  id?: string;
}

export interface VehicleManufacturer {
  name: string;
  id?: string;
  models: VehicleModel[];
}
