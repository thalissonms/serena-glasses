import { getSupabaseServer } from "@shared/lib/supabase/server";
import { STOCK_RESERVING_STATUSES } from "@features/admin/consts/products.const";
import { COUPON_ERRORS } from "@features/coupons/consts/coupon.const";
import type { AppliedCouponInterface } from "@features/coupons/types/coupon.interface";

export interface ValidateCouponInput {
  code: string;
  items: { variantId: string; productId?: string; quantity: number }[];
  email?: string;
  cpf?: string;
}

type ValidationResult =
  | { ok: true; coupon: AppliedCouponInterface }
  | { ok: false; error: string };

export async function validateCoupon(input: ValidateCouponInput): Promise<ValidationResult> {
  const { code, items, email, cpf } = input;

  // 1. Busca cupom (case-insensitive)
  const { data: coupon } = await getSupabaseServer()
    .from("coupons")
    .select("*")
    .eq("code", code.toUpperCase().trim())
    .maybeSingle();

  if (!coupon) return { ok: false, error: COUPON_ERRORS.NOT_FOUND };
  if (!coupon.active) return { ok: false, error: COUPON_ERRORS.INACTIVE };

  // 2. Validade por data
  const now = new Date();
  if (new Date(coupon.valid_from) > now) return { ok: false, error: COUPON_ERRORS.NOT_STARTED };
  if (coupon.valid_until && new Date(coupon.valid_until) < now) {
    return { ok: false, error: COUPON_ERRORS.EXPIRED };
  }

  // 3. Busca preços e categorias do banco (server-side — não confia no client)
  const variantIds = items.map((i) => i.variantId);
  const { data: dbVariants } = await getSupabaseServer()
    .from("product_variants")
    .select("id, product_id, products(id, price, category_id, categories(slug))")
    .in("id", variantIds);

  const priceMap: Record<string, number> = {};
  // chave: variantId → slug da categoria do produto (resolvido via join)
  const categoryByVariant: Record<string, string | null> = {};
  for (const v of dbVariants ?? []) {
    const product = Array.isArray(v.products) ? v.products[0] : v.products;
    if (product && typeof product.price === "number") {
      priceMap[v.id] = Math.round(product.price);
      const rawCat = (product as { categories?: { slug: string } | { slug: string }[] | null })
        .categories;
      const cat = Array.isArray(rawCat) ? rawCat[0] : rawCat;
      categoryByVariant[v.id] = cat?.slug ?? null;
    }
  }

  // 4. Filtra itens elegÃ­veis conforme applies_to
  let eligibleItems = items;
  if (coupon.applies_to === "products" && coupon.applicable_product_ids?.length) {
    const allowed = new Set(coupon.applicable_product_ids as string[]);
    eligibleItems = items.filter((i) => i.productId != null && allowed.has(i.productId));
  } else if (coupon.applies_to === "categories" && coupon.applicable_categories?.length) {
    const allowed = new Set(coupon.applicable_categories as string[]);
    eligibleItems = items.filter((i) => allowed.has(categoryByVariant[i.variantId] ?? ""));
  }

  if (eligibleItems.length === 0) {
    return { ok: false, error: COUPON_ERRORS.NOT_APPLICABLE };
  }

  const eligibleSubtotal = eligibleItems.reduce(
    (sum, i) => sum + (priceMap[i.variantId] ?? 0) * i.quantity,
    0,
  );

  // 5. Pedido mÃ­nimo (sobre os itens elegÃ­veis)
  if (eligibleSubtotal < coupon.min_order_cents) {
    return { ok: false, error: COUPON_ERRORS.MIN_ORDER };
  }

  // 6. Limite total de usos
  if (coupon.usage_limit_total != null) {
    const { count } = await getSupabaseServer()
      .from("coupon_usages")
      .select("*", { count: "exact", head: true })
      .eq("coupon_id", coupon.id);
    if ((count ?? 0) >= coupon.usage_limit_total) {
      return { ok: false, error: COUPON_ERRORS.USAGE_EXHAUSTED };
    }
  }

  // 7. Limite por email
  if (email) {
    const normalizedEmail = email.toLowerCase().trim();

    const { count: emailCount } = await getSupabaseServer()
      .from("coupon_usages")
      .select("*", { count: "exact", head: true })
      .eq("coupon_id", coupon.id)
      .eq("email", normalizedEmail);
    if ((emailCount ?? 0) >= coupon.usage_limit_per_email) {
      return { ok: false, error: COUPON_ERRORS.USAGE_LIMIT_USER };
    }

    // 8. Primeira compra apenas â€” checa por email E por CPF (OR: qualquer um bloqueia)
    if (coupon.first_purchase_only) {
      const normalizedCpf = cpf?.replace(/\D/g, "") ?? null;

      const checks = [
        getSupabaseServer()
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("email", normalizedEmail)
          .in("status", STOCK_RESERVING_STATUSES as unknown as string[]),
        ...(normalizedCpf
          ? [
              getSupabaseServer()
                .from("orders")
                .select("*", { count: "exact", head: true })
                .eq("cpf", normalizedCpf)
                .in("status", STOCK_RESERVING_STATUSES as unknown as string[]),
            ]
          : []),
      ];

      const results = await Promise.all(checks);
      const hasExistingOrder = results.some((r) => (r.count ?? 0) > 0);
      if (hasExistingOrder) {
        return { ok: false, error: COUPON_ERRORS.FIRST_PURCHASE_ONLY };
      }
    }
  }

  // 9. Calcula desconto sobre o subtotal elegÃ­vel
  let discount: number;
  if (coupon.discount_type === "free_shipping") {
    discount = 0; // desconto de subtotal Ã© zero â€” frete Ã© zerado no checkout
  } else if (coupon.discount_type === "percentage") {
    discount = Math.floor((eligibleSubtotal * coupon.discount_value) / 100);
  } else {
    discount = Math.min(coupon.discount_value, eligibleSubtotal);
  }
  if (coupon.max_discount_cents != null && coupon.discount_type !== "free_shipping") {
    discount = Math.min(discount, coupon.max_discount_cents);
  }

  return {
    ok: true,
    coupon: {
      coupon_id: coupon.id,
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      discount_applied_cents: discount,
    },
  };
}
