import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@shared/lib/supabase/server";

// Polling endpoint — retorna apenas o status do pedido.
// Não requer autenticação mas o orderId é um UUID opaco — difícil de adivinhar.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const { data, error } = await getSupabaseServer()
    .from("orders")
    .select("status")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ status: data.status });
}
