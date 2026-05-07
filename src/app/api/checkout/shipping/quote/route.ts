import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import { lookupCep } from "@shared/lib/viacep";
import { slugifyCity } from "@shared/utils/slugifyCity";
import { calculateShippingOptions, type VariantQuoteInput } from "@shared/lib/melhor-envio/shipping";
import { redis } from "@shared/lib/ratelimit";
import type { ShippingQuoteOption } from "@shared/lib/melhor-envio/types";

const uuidLike = z.string().regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i);

const quoteSchema = z.object({
  cep: z.string().min(8).max(9),
  items: z
    .array(z.object({ variantId: uuidLike, quantity: z.number().int().positive() }))
    .min(1)
    .max(50),
});

const CACHE_TTL_S  = 30 * 60;
const CACHE_TTL_MS = CACHE_TTL_S * 1000;

// In-memory fallback cache used when Redis is not configured
const quoteCache = new Map<string, { options: ShippingQuoteOption[]; expiresAt: number }>();

function cacheKey(cep: string, items: { variantId: string; quantity: number }[]): string {
  const parts = [...items]
    .sort((a, b) => a.variantId.localeCompare(b.variantId))
    .map((i) => `${i.variantId}:${i.quantity}`)
    .join(",");
  return `sq:${cep.replace(/\D/g, "")}|${parts}`;
}

export async function POST(request: NextRequest) {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const parsed = quoteSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados invÃ¡lidos", issues: parsed.error.issues }, { status: 400 });
  }

  const { cep, items } = parsed.data;
  const key = cacheKey(cep, items);

  // Cache lookup â€” Redis preferred, in-memory fallback
  if (redis) {
    const cached = await redis.get<ShippingQuoteOption[]>(key);
    if (cached) return NextResponse.json({ options: cached });
  } else {
    const cached = quoteCache.get(key);
    if (cached && Date.now() < cached.expiresAt) {
      return NextResponse.json({ options: cached.options });
    }
  }

  // Fetch weights + prices from DB
  const { data: dbVariants, error: dbErr } = await getSupabaseServer()
    .from("product_variants")
    .select("id, products(price, weight)")
    .in("id", items.map((i) => i.variantId));

  if (dbErr || !dbVariants) {
    console.error("[shipping/quote] db error:", dbErr?.message);
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 });
  }

  const variantMap = new Map<string, { priceCents: number; weightG: number }>();
  for (const v of dbVariants) {
    const product = Array.isArray(v.products) ? v.products[0] : v.products;
    if (product && typeof product.price === "number" && typeof product.weight === "number") {
      variantMap.set(v.id, { priceCents: Math.round(product.price), weightG: product.weight });
    }
  }

  const resolvedVariants: VariantQuoteInput[] = [];
  for (const item of items) {
    const info = variantMap.get(item.variantId);
    if (!info) return NextResponse.json({ error: "Produto nÃ£o encontrado" }, { status: 404 });
    resolvedVariants.push({ variantId: item.variantId, quantity: item.quantity, ...info });
  }

  // ViaCEP lookup for free-city check
  const cepInfo = await lookupCep(cep);
  const citySlug = cepInfo ? slugifyCity(cepInfo.city, cepInfo.state) : undefined;

  try {
    const options = await calculateShippingOptions(cep, resolvedVariants, citySlug);

    // Store in cache
    if (redis) {
      await redis.set(key, options, { ex: CACHE_TTL_S });
    } else {
      // Evict expired entries before inserting to prevent unbounded growth
      const now = Date.now();
      for (const [k, v] of quoteCache) {
        if (now >= v.expiresAt) quoteCache.delete(k);
      }
      quoteCache.set(key, { options, expiresAt: now + CACHE_TTL_MS });
    }

    return NextResponse.json({ options });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[shipping/quote] ME error:", msg);
    return NextResponse.json({ error: "Erro ao calcular frete. Tente novamente." }, { status: 502 });
  }
}
