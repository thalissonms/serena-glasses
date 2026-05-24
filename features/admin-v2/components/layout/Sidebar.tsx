"use client";
/**
 * Component: Sidebar — navegação vertical do /admin-v2 com 40 rotas agrupadas.
 *
 * Grupos: Overview / Catalog / Sales / Marketing / Content / Customers / Operations / Integrations.
 * Active: barra pink + texto pink + glow. Itens SCAFFOLD com dot cyan no canto.
 *
 * Usado em: AdminV2Shell.
 */
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  Package,
  FolderTree,
  Star,
  Layers,
  Warehouse,
  LayoutGrid,
  PackageSearch,
  ShoppingBag,
  CreditCard,
  RotateCcw,
  ShoppingCart,
  BarChart2,
  Truck,
  Tag,
  Megaphone,
  PlaySquare,
  MousePointerClick,
  Mail,
  Bell,
  FileText,
  Search,
  BookOpen,
  Users,
  UserCheck,
  Heart,
  Bookmark,
  Settings,
  Percent,
  ShieldCheck,
  ClipboardList,
  Database,
  Globe,
  Zap,
  DollarSign,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { supabase } from "@shared/lib/supabase/client";
import Logo from "@shared/components/layout/Logos/Logo";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  scaffold?: boolean;
}

interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
  allScaffold?: boolean;
}

const NAV_GROUPS: NavGroup[] = [
  {
    id: "overview",
    label: "Overview",
    items: [
      {
        href: "/admin-v2",
        label: "Dashboard",
        icon: LayoutDashboard,
        exact: true,
      },
      {
        href: "/admin-v2/analytics",
        label: "Analytics",
        icon: TrendingUp,
        scaffold: true,
      },
    ],
  },
  {
    id: "catalog",
    label: "Catalog",
    items: [
      { href: "/admin-v2/products", label: "Produtos", icon: Package },
      { href: "/admin-v2/categories", label: "Categorias", icon: FolderTree },
      { href: "/admin-v2/reviews", label: "Avaliações", icon: Star },
      {
        href: "/admin-v2/variants",
        label: "Variantes",
        icon: Layers,
        scaffold: true,
      },
      {
        href: "/admin-v2/inventory",
        label: "Inventário",
        icon: Warehouse,
        scaffold: true,
      },
      {
        href: "/admin-v2/collections",
        label: "Coleções",
        icon: LayoutGrid,
        scaffold: true,
      },
      {
        href: "/admin-v2/import",
        label: "Import / Export",
        icon: PackageSearch,
        scaffold: true,
      },
    ],
  },
  {
    id: "sales",
    label: "Sales",
    items: [
      { href: "/admin-v2/orders", label: "Pedidos", icon: ShoppingBag },
      {
        href: "/admin-v2/payments",
        label: "Pagamentos",
        icon: CreditCard,
        scaffold: true,
      },
      {
        href: "/admin-v2/refunds",
        label: "Reembolsos",
        icon: RotateCcw,
        scaffold: true,
      },
      {
        href: "/admin-v2/carts",
        label: "Carrinhos Aband.",
        icon: ShoppingCart,
        scaffold: true,
      },
      {
        href: "/admin-v2/shipments",
        label: "Rastreamento",
        icon: Truck,
        scaffold: true,
      },
      {
        href: "/admin-v2/reports",
        label: "Relatórios",
        icon: BarChart2,
        scaffold: true,
      },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    items: [
      { href: "/admin-v2/coupons", label: "Cupons", icon: Tag },
      { href: "/admin-v2/banners", label: "Banners", icon: Megaphone },
      { href: "/admin-v2/stories", label: "Stories", icon: PlaySquare },
      {
        href: "/admin-v2/popups",
        label: "Pop-ups",
        icon: MousePointerClick,
        scaffold: true,
      },
      {
        href: "/admin-v2/email",
        label: "E-mail Mktg",
        icon: Mail,
        scaffold: true,
      },
      {
        href: "/admin-v2/push",
        label: "Notif. Push",
        icon: Bell,
        scaffold: true,
      },
      {
        href: "/admin-v2/emails",
        label: "Templates Email",
        icon: Mail,
        scaffold: true,
      },
    ],
  },
  {
    id: "content",
    label: "Content",
    allScaffold: true,
    items: [
      {
        href: "/admin-v2/pages",
        label: "Páginas",
        icon: FileText,
        scaffold: true,
      },
      {
        href: "/admin-v2/media",
        label: "Mídia",
        icon: LayoutGrid,
        scaffold: true,
      },
      { href: "/admin-v2/blog", label: "Blog", icon: BookOpen, scaffold: true },
      { href: "/admin-v2/seo", label: "SEO", icon: Search, scaffold: true },
    ],
  },
  {
    id: "customers",
    label: "Customers",
    items: [
      { href: "/admin-v2/customers", label: "Clientes", icon: Users },
      {
        href: "/admin-v2/groups",
        label: "Grupos",
        icon: UserCheck,
        scaffold: true,
      },
      {
        href: "/admin-v2/wishlist",
        label: "Wishlists",
        icon: Heart,
        scaffold: true,
      },
      {
        href: "/admin-v2/segments",
        label: "Segmentos",
        icon: Bookmark,
        scaffold: true,
      },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    items: [
      { href: "/admin-v2/settings", label: "Configurações", icon: Settings },
      {
        href: "/admin-v2/shipping-zones",
        label: "Zonas Frete",
        icon: Truck,
        scaffold: true,
      },
      {
        href: "/admin-v2/taxes",
        label: "Impostos",
        icon: Percent,
        scaffold: true,
      },
      {
        href: "/admin-v2/team",
        label: "Equipe Admin",
        icon: ShieldCheck,
        scaffold: true,
      },
      {
        href: "/admin-v2/logs",
        label: "Logs de Erro",
        icon: FileText,
        scaffold: true,
      },
      {
        href: "/admin-v2/audit",
        label: "Auditoria",
        icon: ClipboardList,
        scaffold: true,
      },
      {
        href: "/admin-v2/data",
        label: "Dados / Backup",
        icon: Database,
        scaffold: true,
      },
    ],
  },
  {
    id: "integrations",
    label: "Integrations",
    items: [
      {
        href: "/admin-v2/integrations/melhor-envio",
        label: "Melhor Envio",
        icon: Truck,
        scaffold: true,
      },
      {
        href: "/admin-v2/integrations/mercadopago",
        label: "Mercado Pago",
        icon: DollarSign,
        scaffold: true,
      },
      {
        href: "/admin-v2/integrations/meta",
        label: "Meta Pixel",
        icon: Globe,
        scaffold: true,
      },
      {
        href: "/admin-v2/integrations/tiktok",
        label: "TikTok Pixel",
        icon: Globe,
        scaffold: true,
      },
      {
        href: "/admin-v2/integrations/webhooks",
        label: "Webhooks",
        icon: Zap,
        scaffold: true,
      },
      {
        href: "/admin-v2/integrations/bling",
        label: "Bling ERP",
        icon: Zap,
        scaffold: true,
      },
    ],
  },
];

function isActive(pathname: string, item: NavItem): boolean {
  if (item.exact) return pathname === item.href;
  return pathname.startsWith(item.href);
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin-v2/login");
  }

  return (
    <aside className="w-60 shrink-0 h-screen border-r border-white/5 flex flex-col overflow-hidden">
      <div className="px-4 py-2 border-b border-white/5 shrink-0">
        <div className="relative flex flex-col items-center gap-3">
          <div>
            <span className="font-poppins uppercase absolute top-4 left-17.5 font-bold text-1xl text-brand-blue">
              Admin
            </span>
          </div>
          <Logo className="w-42 text-brand-pink-light" />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-admin py-3 px-2">
        {NAV_GROUPS.map((group) => (
          <div key={group.id} className="mb-5">
            <span className="font-mono font-semibold text-[18px] uppercase tracking-[0.3em] text-brand-blue/80 px-3 mb-1.5 select-none">
              {group.label}
            </span>
            <div className="flex flex-col gap-1 my-2 ml-0.5">
              {group.items.map((item) => {
                const active = isActive(pathname, item);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative flex items-center gap-2.5 px-3 py-2 text-[14px] font-poppins font-semibold uppercase tracking-wider transition-all duration-150 ${
                      active
                        ? "text-brand-pink bg-brand-pink/8"
                        : "text-white/35 hover:text-white/70 hover:bg-white/3"
                    }`}
                  >
                    {active && (
                      <span
                        className="absolute left-0 top-1 bottom-1 w-0.5 bg-brand-pink shadow-[0px_0px_6px] shadow-[#FF3355]"
                      />
                    )}
                    <Icon
                      size={20}
                      strokeWidth={2.5}
                      className={
                        active
                          ? "text-brand-pink"
                          : "text-white/20 group-hover:text-white/50"
                      }
                    />
                    <span className="flex-1 min-w-0 truncate">
                      {item.label}
                    </span>
                    {item.scaffold && (
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow/30 shrink-0" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/5 p-2">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-white/20 hover:text-red-400 hover:bg-white/3 transition-all duration-150"
        >
          <LogOut size={11} />
          Sair do sistema
        </button>
      </div>
    </aside>
  );
}
