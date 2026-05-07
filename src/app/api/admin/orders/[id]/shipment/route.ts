import { NextResponse } from "next/server";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import { meRequest } from "@shared/lib/melhor-envio/client";
import { getStorePackage } from "@shared/lib/melhor-envio/env";
import { withAdmin } from "@shared/lib/auth/withAdmin";
import type { MeCartCreateRequest, MeCartCreateResponse } from "@shared/lib/melhor-envio/types";

const REQUIRED_STORE_VARS = [
  "STORE_NAME", "STORE_PHONE", "STORE_EMAIL", "STORE_DOCUMENT",
  "STORE_STREET", "STORE_NUMBER", "STORE_DISTRICT", "STORE_CITY", "STORE_CEP",
] as const;

function getEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing env var: ${key}`);
  return val;
}

export const POST = withAdmin<{ id: string }>(async (_req, { params }) => {
  const { id } = await params;

  const { data: order, error: fetchErr } = await getSupabaseServer()
    .from("orders")
    .select(
      "id, order_number, status, full_name, email, phone, cpf, street, street_number, complement, neighborhood, city, state, cep, shipping_service_id, me_order_id, total",
    )
    .eq("id", id)
    .single();

  if (fetchErr || !order) {
    return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
  }

  const o = order as typeof order & {
    shipping_service_id: number | null;
    me_order_id: string | null;
  };

  if (o.status !== "paid") {
    return NextResponse.json(
      { error: "Etiqueta só pode ser gerada para pedidos pagos" },
      { status: 422 },
    );
  }

  if (o.me_order_id) {
    return NextResponse.json({ error: "Etiqueta já gerada para este pedido" }, { status: 409 });
  }

  if (!o.shipping_service_id) {
    return NextResponse.json(
      { error: "Pedido sem serviço de frete definido (legado)" },
      { status: 422 },
    );
  }

  // Validate required store env vars upfront — getEnv() would throw outside try and produce a
  // generic 500; this returns a structured error the admin can act on
  const missingVar = REQUIRED_STORE_VARS.find((k) => !process.env[k]);
  if (missingVar) {
    return NextResponse.json(
      { error: `Configuração da loja incompleta: ${missingVar} ausente` },
      { status: 500 },
    );
  }

  // Phone is required by ME — reject early rather than sending an empty string
  const phone = (o.phone as string | null) ?? "";
  if (!phone) {
    return NextResponse.json(
      { error: "Pedido sem telefone — corrija no admin antes de gerar etiqueta" },
      { status: 422 },
    );
  }

  // Fetch order_items with variant weights via join
  const { data: items, error: itemsErr } = await getSupabaseServer()
    .from("order_items")
    .select("product_name, quantity, price, product_variants(products(weight))")
    .eq("order_id", id);

  if (itemsErr || !items || items.length === 0) {
    return NextResponse.json({ error: "Itens do pedido não encontrados" }, { status: 404 });
  }

  // Calculate total weight — missing weight is a hard error (not a silent fallback)
  const pkg = getStorePackage();
  let itemWeightG = 0;
  for (const item of items) {
    const pv = Array.isArray(item.product_variants)
      ? item.product_variants[0]
      : item.product_variants;
    const prod = pv
      ? Array.isArray((pv as any).products)
        ? (pv as any).products[0]
        : (pv as any).products
      : null;
    if (!prod?.weight) {
      return NextResponse.json(
        { error: `Peso não definido para: ${item.product_name}` },
        { status: 500 },
      );
    }
    itemWeightG += prod.weight * item.quantity;
  }
  const totalWeightKg = (itemWeightG + pkg.weightG) / 1000;

  const cartBody: MeCartCreateRequest = {
    service: o.shipping_service_id,
    from: {
      name: getEnv("STORE_NAME"),
      phone: getEnv("STORE_PHONE"),
      email: getEnv("STORE_EMAIL"),
      document: getEnv("STORE_DOCUMENT"),
      address: getEnv("STORE_STREET"),
      number: getEnv("STORE_NUMBER"),
      complement: process.env.STORE_COMPLEMENT ?? "",
      district: getEnv("STORE_DISTRICT"),
      city: getEnv("STORE_CITY"),
      country_id: "BR",
      postal_code: getEnv("STORE_CEP").replace(/\D/g, ""),
    },
    to: {
      name: o.full_name,
      phone,
      email: o.email,
      document: ((o.cpf as string | null) ?? "").replace(/\D/g, ""),
      address: o.street,
      number: o.street_number,
      complement: (o.complement as string | null) ?? "",
      district: o.neighborhood,
      city: o.city,
      state_abbr: o.state,
      country_id: "BR",
      postal_code: (o.cep ?? "").replace(/\D/g, ""),
      is_residential: true,
    },
    products: items.map((item) => ({
      name: item.product_name,
      quantity: item.quantity,
      unitary_value: item.price / 100,
    })),
    volumes: [
      {
        height: pkg.heightCm,
        width: pkg.widthCm,
        length: pkg.lengthCm,
        weight: totalWeightKg,
      },
    ],
    options: {
      insurance_value: o.total / 100,
      receipt: false,
      own_hand: false,
      reverse: false,
      non_commercial: true,
    },
    platform: "Serena Glasses",
  };

  let meOrderId: string;
  let labelUrl: string;

  try {
    // 1. Add to cart
    const cartRes = await meRequest<MeCartCreateResponse>("POST", "/api/v2/me/cart", cartBody);
    meOrderId = cartRes.id;

    // 2. Checkout — debits saldo
    await meRequest("POST", "/api/v2/me/shipment/checkout", { orders: [meOrderId] });

    // 3. Generate label
    await meRequest("POST", "/api/v2/me/shipment/generate", { orders: [meOrderId] });

    // 4. Get print URL — ME returns Record<orderId, url>, not { url: string }
    const printRes = await meRequest<Record<string, string>>("POST", "/api/v2/me/shipment/print", {
      mode: "private",
      orders: [meOrderId],
    });
    labelUrl = printRes[meOrderId];
    if (!labelUrl) {
      throw new Error(`ME print response missing URL for order ${meOrderId}`);
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[admin/shipment] ME error:", msg);
    if (/saldo|balance|insufficient/i.test(msg)) {
      return NextResponse.json(
        { error: "Saldo insuficiente no Melhor Envio. Recarregue sua conta." },
        { status: 402 },
      );
    }
    return NextResponse.json({ error: `Erro ao gerar etiqueta: ${msg}` }, { status: 502 });
  }

  const { error: updateErr } = await getSupabaseServer()
    .from("orders")
    .update({
      me_order_id: meOrderId,
      me_label_url: labelUrl,
      me_status: "generated",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (updateErr) {
    console.error("[admin/shipment] db update error:", updateErr.message);
    return NextResponse.json(
      { error: "Etiqueta gerada mas falha ao salvar. Contate suporte.", me_label_url: labelUrl },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, me_order_id: meOrderId, me_label_url: labelUrl });
});

export const DELETE = withAdmin<{ id: string }>(async (_req, { params }) => {
  const { id } = await params;

  const { data: order, error: fetchErr } = await getSupabaseServer()
    .from("orders")
    .select("id, me_order_id, me_status")
    .eq("id", id)
    .single();

  if (fetchErr || !order) {
    return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
  }

  const meOrderId = (order as any).me_order_id as string | null;
  if (!meOrderId) {
    return NextResponse.json({ error: "Nenhuma etiqueta gerada para este pedido" }, { status: 422 });
  }

  const meStatus = (order as any).me_status as string | null;
  if (meStatus === "posted") {
    return NextResponse.json(
      { error: "Etiqueta já postada — não é possível cancelar" },
      { status: 422 },
    );
  }

  try {
    await meRequest("POST", "/api/v2/me/shipment/cancel", { orders: [meOrderId] });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[admin/shipment/cancel] ME error:", msg);
    return NextResponse.json({ error: `Erro ao cancelar etiqueta: ${msg}` }, { status: 502 });
  }

  await getSupabaseServer()
    .from("orders")
    .update({
      me_order_id: null,
      me_label_url: null,
      me_status: "canceled",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  return NextResponse.json({ ok: true });
});
