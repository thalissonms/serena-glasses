"use client";
/**
 * Component: SeoClient — SCAFFOLD de ferramentas SEO.
 *
 * 3 abas: Sitemap (status + tabela de seções), Robots.txt (preview), Redirects (vazio + botão disabled).
 * UI mock — sitemap e robots são gerados via Next.js App Router, não via painel.
 * DevBadge. Filtros visuais funcionando.
 *
 * Usado em: src/app/admin/seo/page.tsx.
 */
import { useState } from "react";
import { Search, FileText, GitBranch, CheckCircle2, Lock, ExternalLink, RefreshCw, ArrowRight } from "lucide-react";
import { DevBadge } from "@features/admin/components/motifs/DevBadge";
import { AsciiEmpty } from "@features/admin/components/motifs/AsciiEmpty";

const ROBOTS_PREVIEW = `User-agent: *
Allow: /

Sitemap: https://serenaglasses.com/sitemap.xml

Disallow: /admin/
Disallow: /admin/
Disallow: /api/
Disallow: /checkout/
Disallow: /account/`;

const SITEMAP_SECTIONS = [
  { type: "homepage", url: "/", priority: "1.0", changefreq: "weekly", count: 1 },
  { type: "category", url: "/c/[slug]", priority: "0.9", changefreq: "daily", count: 12 },
  { type: "product", url: "/p/[slug]", priority: "0.8", changefreq: "weekly", count: 42 },
  { type: "static", url: "/about", priority: "0.5", changefreq: "monthly", count: 1 },
  { type: "static", url: "/contact", priority: "0.4", changefreq: "monthly", count: 1 },
];

type Tab = "sitemap" | "robots" | "redirects";

export function SeoClient() {
  const [tab, setTab] = useState<Tab>("sitemap");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <DevBadge />
        <div className="flex items-center gap-3">
          <Search size={18} className="text-brand-pink" />
          <h1 className="font-shrikhand text-2xl text-white tracking-wide">
            SEO & Redirects
          </h1>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/25">
          {"// Sitemap, robots.txt e gerenciamento de redirects"}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 gap-1">
        {(
          [
            { key: "sitemap", label: "Sitemap", icon: GitBranch },
            { key: "robots", label: "Robots.txt", icon: FileText },
            { key: "redirects", label: "Redirects", icon: ArrowRight },
          ] as const
        ).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2.5 font-mono text-[12px] uppercase tracking-widest transition-colors border-b-2 -mb-px ${
              tab === key
                ? "text-brand-pink border-brand-pink"
                : "text-white/25 border-transparent hover:text-white/40"
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Sitemap */}
      {tab === "sitemap" && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={17} className="text-green-400" />
              <span className="font-mono text-[13px] text-green-400/80">
                sitemap.xml gerado via Next.js App Router
              </span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest border border-white/10 text-white/30 hover:border-white/20 hover:text-white/50 transition-colors"
              >
                <ExternalLink size={13} />
                Abrir sitemap.xml
              </a>
            </div>
          </div>

          <div className="border border-white/5 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#000000] border-b border-brand-pink/30 shadow-[inset_0_0_15px_rgba(255,0,182,0.05)]">
                  {["TIPO", "URL / PADRÃO", "PRIORIDADE", "CHANGEFREQ", "ENTRADAS"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/25 font-normal border-b border-white/5 text-left"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {SITEMAP_SECTIONS.map((s, i) => (
                  <tr
                    key={s.url}
                    className={`border-b border-white/3 ${
                      i % 2 === 0 ? "bg-[#050505]" : "bg-[#050505]"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest border border-white/8 text-white/20">
                        {s.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[12px] text-brand-pink/40">
                      {s.url}
                    </td>
                    <td className="px-4 py-3 font-mono text-[12px] text-white/30">
                      {s.priority}
                    </td>
                    <td className="px-4 py-3 font-mono text-[12px] text-white/20">
                      {s.changefreq}
                    </td>
                    <td className="px-4 py-3 font-mono text-[13px] text-white/40">
                      {s.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center gap-2 opacity-40">
            <RefreshCw size={13} className="text-white/25" />
            <span className="font-mono text-[10px] text-white/20 uppercase tracking-wider">
              Sitemap regenerado automaticamente a cada build — não requer ação manual
            </span>
          </div>
        </div>
      )}

      {/* Robots */}
      {tab === "robots" && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={17} className="text-green-400" />
              <span className="font-mono text-[13px] text-green-400/80">
                robots.txt gerado via src/app/robots.ts
              </span>
            </div>
            <a
              href="/robots.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest border border-white/10 text-white/30 hover:border-white/20 hover:text-white/50 transition-colors"
            >
              <ExternalLink size={13} />
              Abrir robots.txt
            </a>
          </div>

          <div className="border border-white/8 bg-[#0a0a0a] p-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/15 mb-3">
              {"// preview"}
            </p>
            <pre className="font-mono text-[12px] text-brand-pink/50 leading-relaxed whitespace-pre">
              {ROBOTS_PREVIEW}
            </pre>
          </div>

          <div className="border border-[#FFD700]/20 bg-[#FFD700]/4 p-3 flex items-start gap-2">
            <Lock size={15} className="text-[#FFD700]/40 shrink-0 mt-0.5" />
            <p className="font-mono text-[11px] text-[#FFD700]/60 leading-relaxed">
              Para editar o robots.txt, modifique{" "}
              <span className="text-brand-pink/50">src/app/robots.ts</span> e faça deploy.
              Um editor visual sem deploy está planejado.
            </p>
          </div>
        </div>
      )}

      {/* Redirects */}
      {tab === "redirects" && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
            <p className="font-mono text-[12px] text-white/25 uppercase tracking-wider">
              {"// 0 redirects configurados"}
            </p>
            <button
              type="button"
              disabled
              className="flex items-center gap-2 px-4 py-2 font-mono text-[12px] uppercase tracking-widest border border-white/8 text-white/15 cursor-not-allowed"
            >
              <Lock size={14} />
              [ + NOVA REDIRECT ]
            </button>
          </div>

          <AsciiEmpty
            message="Nenhum redirect"
            description="Redirects customizados serão gerenciados aqui quando a tabela url_redirects for criada no banco."
          />

          <div className="border border-brand-pink/10 bg-brand-pink/3 p-3">
            <p className="font-mono text-[11px] text-white/25 leading-relaxed">
              Redirects permanentes (301) podem ser adicionados em{" "}
              <span className="text-brand-pink/50">next.config.ts</span> enquanto
              o gerenciador visual não está disponível.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
