"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Printer, Tag, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Props {
  orderId: string;
  currentStatus: string;
  meOrderId: string | null;
  meLabelUrl: string | null;
  shippingServiceId: number | null;
}

export default function GenerateLabelButton({
  orderId,
  currentStatus,
  meOrderId,
  meLabelUrl,
  shippingServiceId,
}: Props) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [labelUrl, setLabelUrl] = useState<string | null>(meLabelUrl);
  const [hasLabel, setHasLabel] = useState(!!meOrderId);

  const canGenerate = currentStatus === "paid" && !hasLabel && !!shippingServiceId;
  const urlPending = hasLabel && !labelUrl;

  if (!canGenerate && !hasLabel) return null;

  async function handleGenerate() {
    setLoading(true);
    setConfirming(false);

    const res = await fetch(`/api/admin/orders/${orderId}/shipment`, { method: "POST" });

    if (res.ok) {
      const data = await res.json();
      setLabelUrl(data.me_label_url);
      setHasLabel(true);
      toast.success(data.me_label_url ? "Etiqueta gerada com sucesso!" : "Etiqueta gerada. URL sendo processada pelo ME.");
      router.refresh();
    } else {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error ?? "Falha ao gerar etiqueta");
    }

    setLoading(false);
  }

  async function handleFetchUrl() {
    setLoading(true);

    const res = await fetch(`/api/admin/orders/${orderId}/shipment`, { method: "GET" });
    const data = await res.json().catch(() => ({}));

    if (res.ok && data.me_label_url) {
      setLabelUrl(data.me_label_url);
      toast.success("URL da etiqueta obtida!");
      router.refresh();
    } else if (res.status === 202) {
      toast.info(data.error ?? "Etiqueta ainda sendo processada. Tente em alguns segundos.");
    } else {
      toast.error(data.error ?? "Falha ao buscar URL da etiqueta");
    }

    setLoading(false);
  }

  if (hasLabel && labelUrl) {
    return (
      <a
        href={labelUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 font-poppins text-xs font-bold uppercase tracking-wider border-2 border-purple-500/40 text-purple-400 hover:border-purple-500 hover:text-purple-300 transition-colors"
      >
        <Printer size={11} />
        Imprimir etiqueta
      </a>
    );
  }

  if (urlPending) {
    return (
      <button
        onClick={handleFetchUrl}
        disabled={loading}
        className="flex items-center gap-1.5 px-3 py-1.5 font-poppins text-xs font-bold uppercase tracking-wider border-2 border-yellow-500/40 text-yellow-400 hover:border-yellow-500 hover:text-yellow-300 transition-colors disabled:opacity-40"
      >
        {loading ? <Loader2 size={10} className="animate-spin" /> : <RefreshCw size={11} />}
        Buscar URL da etiqueta
      </button>
    );
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="font-inter text-xs text-yellow-400">Debita saldo ME. Confirmar?</span>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center gap-1 px-3 py-1.5 font-poppins text-xs font-black uppercase tracking-wider border-2 border-purple-500 bg-purple-500 text-white hover:translate-y-0.5 transition-all disabled:opacity-40"
        >
          {loading && <Loader2 size={10} className="animate-spin" />}
          Sim, gerar
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
      className="flex items-center gap-1.5 px-3 py-1.5 font-poppins text-xs font-bold uppercase tracking-wider border-2 border-purple-500/40 text-purple-400 hover:border-purple-500 hover:text-purple-300 transition-colors"
    >
      <Tag size={11} />
      Gerar etiqueta
    </button>
  );
}
