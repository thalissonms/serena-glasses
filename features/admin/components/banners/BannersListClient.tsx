"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Clock, X as XIcon, ExternalLink } from "lucide-react";
import type { SiteBannerRow } from "@features/home/types/siteBanner.types";
import { PUBLISH_STATUS_CONFIG } from "../../consts/publishStatus.const";
import { getPublishStatus } from "../../utils/getPublishStatus.util";
import { fmtDate } from "../../utils/formatDate";
import { useDeleteSiteBanner } from "../../hooks/banner/useSiteBanner.hook";
import { isApiError } from "../../utils/isApiError";

interface Props {
  banners: SiteBannerRow[];
}


export default function BannersListClient({ banners: initial }: Props) {
  const router = useRouter();
  const [banners, setBanners] = useState(initial);
  const [deleting, setDeleting] = useState<string | null>(null);

  const deleteMutation = useDeleteSiteBanner();

  async function handleDelete(id: string) {
    if (!confirm("Deletar este banner permanentemente?")) return;
    setDeleting(id);
    try {
      await deleteMutation.mutateAsync(id);
      setBanners((prev) => prev.filter((b) => b.id !== id));
      toast.success("Banner removido");
    } catch (err: unknown) {
      if (isApiError(err)) {
        toast.error(err.message);
      } else {
        toast.error("Falha ao remover banner");
      }
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
        <div>
          <h1 className="font-shrikhand text-3xl tracking-wider text-white">BANNERS</h1>
          <p className="mt-1 font-mono text-[12px] tracking-widest text-white/30 uppercase">
            {banners.length} banner{banners.length !== 1 ? "s" : ""} cadastrado
            {banners.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/banners/new")}
          className="flex items-center gap-2 border-2 border-black bg-linear-to-r from-[var(--brand-pink)] to-brand-pink px-4 py-2 font-mono text-base font-bold tracking-widest text-black uppercase transition-colors hover:bg-brand-pink-light rounded-none"
        >
          <Plus size={17} />
          [ Novo Banner ]
        </button>
      </div>

      {banners.length === 0 ? (
        <div className="border-2 border-dashed border-white/10 bg-[#050505] p-20 text-center">
          <div className="font-mono text-base tracking-[0.4em] text-white/15 uppercase">
            NENHUM BANNER CADASTRADO
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {banners.map((b) => {
            const status = getPublishStatus(b);
            const sc = PUBLISH_STATUS_CONFIG[status];

            return (
              <div
                key={b.id}
                className="border border-brand-pink/30 bg-[#050505] shadow-[inset_0_0_15px_rgba(255,0,182,0.05)] transition-colors duration-150 hover:bg-[#050505] rounded-none"
              >
                <div
                  className="flex h-11 items-center gap-3 overflow-hidden px-4"
                  style={{ backgroundColor: b.bg_color }}
                >
                  <span
                    className="font-poppins flex-1 truncate text-base font-semibold"
                    style={{ color: b.text_color }}
                  >
                    {b.message_pt}
                  </span>
                  {b.link_url && (
                    <span
                      className="flex shrink-0 items-center gap-1 font-mono text-[12px] opacity-50"
                      style={{ color: b.text_color }}
                    >
                      <ExternalLink size={13} />
                      {b.link_url.replace(/^https?:\/\//, "").slice(0, 32)}
                    </span>
                  )}
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 px-4 py-2.5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-widest px-2 py-0.5 border ${sc.cls}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-none ${sc.dot}`} />
                      {"//"} {sc.label}
                    </span>

                    {b.dismissible && (
                      <span className="inline-flex items-center gap-1 border border-white/10 px-2 py-0.5 font-mono text-[12px] tracking-widest text-white/25 uppercase">
                        <XIcon size={12} />
                        Fechável
                      </span>
                    )}

                    {(b.starts_at || b.ends_at) && (
                      <span className="inline-flex items-center gap-1 font-mono text-[12px] text-white/25">
                        <Clock size={12} />
                        {b.starts_at && fmtDate(b.starts_at)}
                        {b.starts_at && b.ends_at && " → "}
                        {b.ends_at && fmtDate(b.ends_at)}
                      </span>
                    )}

                    <span className="font-mono text-[12px] text-white/15">
                      {"//"} ordem #{b.display_order}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => router.push(`/admin/banners/${b.id}`)}
                      className="p-1.5 text-white/25 transition-colors hover:text-brand-pink"
                      title="Editar"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      disabled={deleting === b.id}
                      className="p-1.5 text-white/25 transition-colors hover:text-brand-pink disabled:opacity-20"
                      title="Deletar"
                    >
                      <Trash2 size={16} />
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
