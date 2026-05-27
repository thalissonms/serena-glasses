"use client";
/**
 * Component: BannersListClient — lista de site_banners com preview visual colorido, schedule pills e ações CRUD.
 *
 * Cards com fundo na cor do banner mostram preview real da mensagem.
 * Status derivado de active + starts_at + ends_at em runtime.
 * Ações: editar (→ /admin/banners/[id]), deletar (DELETE /api/admin/site-banners/[id]).
 *
 * Usado em: /admin/banners.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Clock, X as XIcon, ExternalLink } from "lucide-react";
import type { SiteBannerRow } from "@features/home/types/siteBanner.types";

interface Props {
  banners: SiteBannerRow[];
}

type BannerStatus = "live" | "scheduled" | "expired" | "inactive";

function getBannerStatus(b: SiteBannerRow): BannerStatus {
  const now = Date.now();
  if (!b.active) return "inactive";
  if (b.ends_at && new Date(b.ends_at).getTime() < now) return "expired";
  if (b.starts_at && new Date(b.starts_at).getTime() > now) return "scheduled";
  return "live";
}

const STATUS_CONFIG: Record<BannerStatus, { dot: string; label: string; cls: string }> = {
  live: {
    dot: "bg-[#00F0FF]",
    label: "Ativo",
    cls: "border-[#00F0FF]/40 text-[#00F0FF] shadow-[0_0_8px_#00F0FF30]",
  },
  scheduled: {
    dot: "bg-[#FFD700]",
    label: "Agendado",
    cls: "border-[#FFD700]/40 text-[#FFD700]",
  },
  expired: {
    dot: "bg-white/20",
    label: "Expirado",
    cls: "border-white/20 text-white/30",
  },
  inactive: {
    dot: "bg-white/20",
    label: "Inativo",
    cls: "border-white/20 text-white/30",
  },
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

export default function BannersListClient({ banners: initial }: Props) {
  const router = useRouter();
  const [banners, setBanners] = useState(initial);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Deletar este banner permanentemente?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/site-banners/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao deletar");
      setBanners((prev) => prev.filter((b) => b.id !== id));
      toast.success("Banner removido");
    } catch {
      toast.error("Falha ao remover banner");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-shrikhand text-3xl text-white tracking-wider">BANNERS</h1>
          <p className="font-mono text-[10px] text-white/30 mt-1 uppercase tracking-widest">
            {banners.length} banner{banners.length !== 1 ? "s" : ""} cadastrado
            {banners.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/banners/new")}
          className="flex items-center gap-2 bg-linear-to-r from-[#FF00B6] to-[#00F0FF] text-black font-mono text-xs font-bold uppercase tracking-widest px-4 py-2 border-2 border-black shadow-[4px_4px_0_#000] hover:-translate-x-px hover:-translate-y-px hover:shadow-[5px_5px_0_#000] transition-all"
        >
          <Plus size={14} />
          Novo Banner
        </button>
      </div>

      {banners.length === 0 ? (
        <div className="border-2 border-dashed border-white/10 bg-[#0f0f0f] p-20 text-center">
          <div className="font-mono text-white/15 text-xs uppercase tracking-[0.4em]">
            NENHUM BANNER CADASTRADO
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {banners.map((b) => {
            const status = getBannerStatus(b);
            const sc = STATUS_CONFIG[status];

            return (
              <div
                key={b.id}
                className="border-2 border-white/10 bg-[#1a1a1a] hover:border-[#00F0FF]/30 transition-all duration-150 shadow-[4px_4px_0_#000]"
              >
                <div
                  className="h-11 flex items-center px-4 gap-3 overflow-hidden"
                  style={{ backgroundColor: b.bg_color }}
                >
                  <span
                    className="font-poppins text-sm font-semibold flex-1 truncate"
                    style={{ color: b.text_color }}
                  >
                    {b.message_pt}
                  </span>
                  {b.link_url && (
                    <span
                      className="flex items-center gap-1 font-mono text-[10px] opacity-50 shrink-0"
                      style={{ color: b.text_color }}
                    >
                      <ExternalLink size={10} />
                      {b.link_url.replace(/^https?:\/\//, "").slice(0, 32)}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between px-4 py-2.5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border ${sc.cls}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      {sc.label}
                    </span>

                    {b.dismissible && (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-white/25 border border-white/10 px-2 py-0.5">
                        <XIcon size={9} />
                        Fechável
                      </span>
                    )}

                    {(b.starts_at || b.ends_at) && (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] text-white/25">
                        <Clock size={9} />
                        {b.starts_at && fmtDate(b.starts_at)}
                        {b.starts_at && b.ends_at && " → "}
                        {b.ends_at && fmtDate(b.ends_at)}
                      </span>
                    )}

                    <span className="font-mono text-[10px] text-white/15">
                      ordem #{b.display_order}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => router.push(`/admin/banners/${b.id}`)}
                      className="p-1.5 text-white/25 hover:text-[#00F0FF] transition-colors"
                      title="Editar"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      disabled={deleting === b.id}
                      className="p-1.5 text-white/25 hover:text-[#FF00B6] transition-colors disabled:opacity-20"
                      title="Deletar"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
