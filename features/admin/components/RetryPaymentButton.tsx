"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Props {
  orderId: string;
  currentStatus: string;
}

export default function RetryPaymentButton({ orderId, currentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (currentStatus !== "payment_failed") return null;

  async function handleRetry() {
    setLoading(true);
    const res = await fetch(`/api/admin/orders/${orderId}/retry`, { method: "POST" });

    if (res.ok) {
      toast.success("Pedido reaberto — aguardando nova tentativa do cliente");
      router.refresh();
    } else {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error ?? "Falha ao reabrir pedido");
    }

    setLoading(false);
  }

  return (
    <button
      onClick={handleRetry}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 font-poppins text-xs font-bold uppercase tracking-wider border-2 border-yellow-500/40 text-yellow-400 hover:border-yellow-500 hover:text-yellow-300 transition-colors disabled:opacity-40"
    >
      {loading ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />}
      Tentar novamente
    </button>
  );
}
