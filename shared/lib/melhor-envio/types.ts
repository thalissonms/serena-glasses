export interface MePackage {
  width: number;
  height: number;
  length: number;
  weight: number;
}

export interface MeAddress {
  postal_code: string;
}

export interface MeShipmentOptions {
  insurance_value: number;
  receipt: boolean;
  own_hand: boolean;
}

export interface MeShipmentCalculateRequest {
  from: MeAddress;
  to: MeAddress;
  package: MePackage;
  options: MeShipmentOptions;
  services?: string;
}

export interface MeShipmentCalculateItem {
  id: number;
  name: string;
  price: string;
  custom_price: string;
  discount: string;
  currency: string;
  delivery_time: number;
  delivery_range: { min: number; max: number };
  custom_delivery_time: number;
  custom_delivery_range: { min: number; max: number };
  packages: unknown[];
  additional_services: { receipt: boolean; own_hand: boolean; collect: boolean };
  company: { id: number; name: string; picture: string };
  error?: string;
}

export type MeShipmentCalculateResponse = MeShipmentCalculateItem[];

// POST /api/v2/me/cart
export interface MeCartProduct {
  name: string;
  quantity: number;
  unitary_value: number;
}

export interface MeCartVolume {
  height: number;
  width: number;
  length: number;
  weight: number;
}

export interface MeCartCreateRequest {
  service: number;
  from: {
    name: string;
    phone: string;
    email: string;
    document: string;
    company_document?: string;
    state_register?: string;
    address: string;
    complement?: string;
    number: string;
    district: string;
    city: string;
    country_id: string;
    postal_code: string;
    note?: string;
  };
  to: {
    name: string;
    phone: string;
    email: string;
    document?: string;
    address: string;
    complement?: string;
    number: string;
    district: string;
    city: string;
    state_abbr: string;
    country_id: string;
    postal_code: string;
    note?: string;
    is_residential?: boolean;
  };
  products: MeCartProduct[];
  volumes: MeCartVolume[];
  options?: {
    insurance_value?: number;
    receipt?: boolean;
    own_hand?: boolean;
    collect?: boolean;
    reverse?: boolean;
    non_commercial?: boolean;
    invoice?: { key: string };
  };
  tag?: string;
  platform?: string;
  agency?: number;
}

export interface MeCartCreateResponse {
  id: string;
  protocol: string;
  service_id: number;
  price: string;
  status: string;
  tracking: string | null;
}

// GET /api/v2/me/shipment/tracking
export interface MeTrackingEvent {
  description: string;
  status: string;
  date: string;
  location?: string;
}

export interface MeTrackingResponse {
  id: string;
  protocol: string;
  status: string;
  tracking: string;
  service_id: number;
  events: MeTrackingEvent[];
}

// Shipping quote option returned to client
export interface ShippingQuoteOption {
  id: number;
  name: string;
  company_name: string;
  price: number;          // centavos
  original_price: number; // centavos (before free-shipping override)
  delivery_days: number;
  free_reason?: string;   // "city" when zeroed by FREE_SHIPPING_CITIES
}

// Webhook event envelope from Melhor Envio
export interface MeWebhookEvent {
  event: string;
  data: {
    id: string;            // ME cart/order id
    protocol?: string;
    status?: string;
    tracking?: string;     // tracking code (e.g. "AA123456789BR")
    updated_at?: string;
    events?: MeTrackingEvent[];
  };
}
