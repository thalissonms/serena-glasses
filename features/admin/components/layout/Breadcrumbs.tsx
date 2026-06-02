"use client";
/**
 * Component: Breadcrumbs — trilha monospace baseada em pathname para o /admin.
 *
 * Segmenta pathname por "/", traduz via mapa de labels e exibe com separador "›".
 * Último segmento em pink (var(--brand-pink)); anteriores em white/25 clicáveis.
 *
 * Usado em: Topbar.
 */
import { usePathname } from "next/navigation";
import Link from "next/link";

const SEGMENT_LABELS: Record<string, string> = {
  "admin": "Admin",
  products: "Produtos",
  categories: "Categorias",
  orders: "Pedidos",
  coupons: "Cupons",
  banners: "Banners",
  stories: "Stories",
  settings: "Config",
  reviews: "Avaliações",
  customers: "Clientes",
  analytics: "Analytics",
  reports: "Relatórios",
  payments: "Pagamentos",
  refunds: "Reembolsos",
  tracking: "Rastreamento",
  integrations: "Integrações",
  "melhor-envio": "Melhor Envio",
  mercadopago: "MercadoPago",
  meta: "Meta",
  tiktok: "TikTok",
  webhooks: "Webhooks",
  stock: "Estoque",
  collections: "Coleções",
  variants: "Variantes",
  import: "Import",
  "abandoned-carts": "Carrinhos",
  media: "Mídia",
  blog: "Blog",
  seo: "SEO",
  pages: "Páginas",
  groups: "Grupos",
  wishlists: "Wishlists",
  segments: "Segmentos",
  shipping: "Frete",
  taxes: "Impostos",
  "admin-users": "Usuários",
  audit: "Auditoria",
  data: "Dados",
  push: "Push",
  email: "E-mail",
  popups: "Pop-ups",
  _showcase: "Showcase",
  new: "Novo",
  edit: "Editar",
};

function toLabel(segment: string): string {
  return (
    SEGMENT_LABELS[segment] ??
    segment.charAt(0).toUpperCase() + segment.slice(1)
  );
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((seg, i) => ({
    label: toLabel(seg),
    href: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));

  return (
    <nav aria-label="breadcrumb" className="flex items-center gap-1 mt-0.5">
      {crumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-1">
          {i > 0 && (
            <span className="font-mono text-[16px] text-white/12 select-none">›</span>
          )}
          {crumb.isLast ? (
            <span className="font-mono text-[16px] uppercase tracking-[0.2em] text-brand-yellow">
              {crumb.label}
            </span>
          ) : (
            <Link
              href={crumb.href}
              className="font-mono text-[16px] uppercase tracking-[0.2em] text-white/25 hover:text-white/50 transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
