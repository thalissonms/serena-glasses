import { meRequest } from "./client";
import { getStorePackage } from "./env";
import type { MeShipmentCalculateResponse, ShippingQuoteOption } from "./types";

export interface VariantQuoteInput {
  variantId: string;
  quantity: number;
  weightG: number;
  priceCents: number;
}

export async function calculateShippingOptions(
  toCep: string,
  variants: VariantQuoteInput[],
  citySlug?: string,
): Promise<ShippingQuoteOption[]> {
  const freeCities   = (process.env.FREE_SHIPPING_CITIES ?? "").split(",").filter(Boolean);
  const services     = process.env.MELHOR_ENVIO_SERVICES ?? "1,2";
  const pkg          = getStorePackage();
  const storeCep     = (process.env.STORE_CEP ?? "").replace(/\D/g, "");

  const itemWeightG   = variants.reduce((s, v) => s + v.weightG * v.quantity, 0);
  const totalWeightKg = (itemWeightG + pkg.weightG) / 1000;
  const insuranceRs   = variants.reduce((s, v) => s + v.priceCents * v.quantity, 0) / 100;

  const result = await meRequest<MeShipmentCalculateResponse>(
    "POST",
    "/api/v2/me/shipment/calculate",
    {
      from: { postal_code: storeCep },
      to:   { postal_code: toCep.replace(/\D/g, "") },
      package: { width: pkg.widthCm, height: pkg.heightCm, length: pkg.lengthCm, weight: totalWeightKg },
      options: { insurance_value: insuranceRs, receipt: false, own_hand: false },
      services,
    },
  );

  const isFreeCity = citySlug ? freeCities.includes(citySlug) : false;

  return result
    .filter((s) => !s.error)
    .map((s) => {
      const priceCents = Math.round(parseFloat(s.price) * 100);
      return {
        id: s.id,
        name: s.name,
        company_name: s.company.name,
        price: isFreeCity ? 0 : priceCents,
        original_price: priceCents,
        delivery_days: s.custom_delivery_time || s.delivery_time,
        ...(isFreeCity ? { free_reason: "city" as const } : {}),
      };
    });
}
