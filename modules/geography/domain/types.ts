export type Country = {
  code: string;
  default_currency: string;
  default_timezone: string;
  is_active: boolean;
  name: string;
  phone_code?: string;
};

export type Region = {
  code?: string;
  country_code: string;
  id: string;
  is_active: boolean;
  name: string;
  timezone?: string;
};

export type City = {
  id: string;
  is_active: boolean;
  is_capital: boolean;
  name: string;
  region_id: string;
  timezone?: string;
};
