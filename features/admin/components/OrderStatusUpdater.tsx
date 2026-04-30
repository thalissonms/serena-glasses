"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Truck } from "lucide-react";
import { toast } from "sonner";

const STATUSES = [
  { value: "pending", label: "Aguardando pagamento" },
  { value: "paid", label: "Pago" },
  { value: "processing", label: "Em processamento" },
  { value: "shipped", label: "Enviado" },
  { value: "delivered", label: "Entregue" },
  { value: "cancelled", label: "Cancelado" },
];

const STATUS_COLOR: Record<string, string> = {
  pending: "border-yellow-500/40 text-yellow-300",
  paid: "border-green-500/40 text-green-300",
  processing: "border-blue-500/40 text-blue-300",
  shipped: "border-purple-500/40 text-purple-300",
  delivered: "border-green-500/40 text-green-300",
  cancelled: "border-red-500/40 text-red-300",
};

interface OrderStatusUpdaterProps {
  orderId: string;
  currentStatus: string;
  trackingCode?: string | null;
  carrier?: string | null;
}

export default function OrderStatusUpdater({
  orderId,
  currentStatus,
  trackingCode: initialTrackingCode,
  carrier: initialCarrier,
}: OrderStatusUpdaterProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [trackingCode, setTrackingCode] = useState(initialTrackingCode ?? "");
  const [carrier, setCarrier] = useState(initialCarrier ?? "");
  const [saving, setSaving] = useState(false);

  const showTracking = status === "shipped";
  const hasChanges =
    status !== currentStatus ||
    (showTracking &&
      (trackingCode !== (initialTrackingCode ?? "") ||
        carrier !== (initialCarrier ?? "")));

  async function handleSave() {
    if (!hasChanges) return;
    setSaving(true);

    const body: Record<string, unknown> = { status };
    if (showTracking) {
      if (trackingCode) body.tracking_code = trackingCode;
      if (carrier) body.tracking_carrier = carrier;
    }

    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      toast.success("Pedido atualizado");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Falha ao atualizar");
    }

    setSaving(false);
  }

  return (
    <div className="flex flex-col items-end gap-3">
      <div className="flex items-center gap-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={`bg-[#0f0f0f] border-2 px-3 py-2 font-poppins text-xs font-bold uppercase tracking-wider outline-none cursor-pointer transition-colors ${STATUS_COLOR[status] ?? "border-white/20 text-gray-300"}`}
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value} className="text-white bg-[#0f0f0f]">
              {s.label}
            </option>
          ))}
        </select>

        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="flex items-center gap-1.5 px-4 py-2 font-poppins text-xs font-black uppercase tracking-wider border-2 border-brand-pink bg-brand-pink text-white hover:translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {saving && <Loader2 size={12} className="animate-spin" />}
          Salvar
        </button>
      </div>

      {showTracking && (
        <div className="flex items-center gap-2 w-full max-w-sm">
          <Truck size={12} className="text-gray-500 shrink-0" />
          <input
            type="text"
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value)}
            placeholder="Código de rastreio"
            className="flex-1 bg-[#0f0f0f] border-2 border-white/10 px-3 py-1.5 font-mono text-xs text-gray-300 placeholder:text-gray-600 outline-none focus:border-purple-500/40 transition-colors"
          />
          <input
            type="text"
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
            placeholder="Transportadora"
            className="w-28 bg-[#0f0f0f] border-2 border-white/10 px-3 py-1.5 font-inter text-xs text-gray-300 placeholder:text-gray-600 outline-none focus:border-purple-500/40 transition-colors"
          />
        </div>
      )}
    </div>
  );
}
