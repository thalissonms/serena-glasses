"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type FlagField = "active" | "featured" | "is_new" | "is_sale" | "is_outlet";

interface Props {
  productId: string;
  field: FlagField;
  initialValue: boolean;
  label: string;
  /** Cor da pill quando ativa: pink (default) | green | orange | blue */
  tone?: "pink" | "green" | "orange" | "blue";
}

const TONE_ON: Record<NonNullable<Props["tone"]>, string> = {
  pink: "bg-brand-pink/20 text-brand-pink border-brand-pink/40",
  green: "bg-green-500/20 text-green-300 border-green-500/40",
  orange: "bg-orange-500/20 text-orange-300 border-orange-500/40",
  blue: "bg-blue-500/20 text-blue-300 border-blue-500/40",
};

const TONE_OFF = "bg-white/5 text-gray-600 border-white/10 hover:text-gray-400";

export default function ProductFlagToggle({ productId, field, initialValue, label, tone = "pink" }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);
  const [pending, startTransition] = useTransition();
  const [saving, setSaving] = useState(false);

  async function toggle() {
    const next = !value;
    setValue(next);
    setSaving(true);

    const res = await fetch(`/api/admin/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: next }),
    });

    if (res.ok) {
      startTransition(() => router.refresh());
    } else {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error ?? `Falha ao alterar ${label}`);
      setValue(!next);
    }

    setSaving(false);
  }

  const busy = saving || pending;
  const className = value ? TONE_ON[tone] : TONE_OFF;

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      className={`flex items-center gap-1 font-poppins text-[9px] font-bold uppercase px-1.5 py-0.5 border transition-colors disabled:opacity-50 ${className}`}
    >
      {busy && <Loader2 size={9} className="animate-spin" />}
      {label}
    </button>
  );
}
