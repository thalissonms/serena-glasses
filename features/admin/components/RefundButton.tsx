"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const REFUNDABLE_STATUSES = ["paid", "processing", "shipped"];

interface RefundButtonProps {
  orderId: string;
  currentStatus: string;
  hasMpPaymentId: boolean;
}

export default function RefundButton({ orderId, currentStatus, hasMpPaymentId }: RefundButtonProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!REFUNDABLE_STATUSES.includes(currentStatus) || !hasMpPaymentId) return null;

  async function handleRefund() {
    setLoading(true);
    setConfirming(false);

    const res = await fetch(`/api/admin/orders/${orderId}/refund`, { method: "POST" });

    if (res.ok) {
      toast.success("Reembolso processado");
      router.refresh();
    } else {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error ?? "Falha ao processar reembolso");
    }

    setLoading(false);
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="font-inter text-xs text-red-400">Confirmar reembolso?</span>
        <button
          onClick={handleRefund}
          disabled={loading}
          className="flex items-center gap-1 px-3 py-1.5 font-poppins text-xs font-black uppercase tracking-wider border-2 border-red-500 bg-red-500 text-white hover:translate-y-0.5 transition-all disabled:opacity-40"
        >
          {loading ? <Loader2 size={10} className="animate-spin" /> : null}
          Sim, reembolsar
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-3 py-1.5 font-poppins text-xs font-bold uppercase tracking-wider border-2 border-white/20 text-gray-400 hover:border-white/40 transition-colors"
        >
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="flex items-center gap-1.5 px-3 py-1.5 font-poppins text-xs font-bold uppercase tracking-wider border-2 border-red-500/40 text-red-400 hover:border-red-500 hover:text-red-300 transition-colors"
    >
      <RotateCcw size={11} />
      Reembolsar
    </button>
  );
}
