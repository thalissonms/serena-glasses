"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { clsx } from "clsx";
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
  X,
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
        href: "/admin",
        label: "Dashboard",
        icon: LayoutDashboard,
        exact: true,
      },
      {
        href: "/admin/analytics",
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
      { href: "/admin/products", label: "Produtos", icon: Package },
      { href: "/admin/categories", label: "Categorias", icon: FolderTree },
      { href: "/admin/reviews", label: "Avaliações", icon: Star },
      {
        href: "/admin/variants",
        label: "Variantes",
        icon: Layers,
        scaffold: true,
      },
      {
        href: "/admin/inventory",
        label: "Inventário",
        icon: Warehouse,
        scaffold: true,
      },
      {
        href: "/admin/collections",
        label: "Coleções",
        icon: LayoutGrid,
        scaffold: true,
      },
      {
        href: "/admin/import",
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
      { href: "/admin/orders", label: "Pedidos", icon: ShoppingBag },
      {
        href: "/admin/payments",
        label: "Pagamentos",
        icon: CreditCard,
        scaffold: true,
      },
      {
        href: "/admin/refunds",
        label: "Reembolsos",
        icon: RotateCcw,
        scaffold: true,
      },
      {
        href: "/admin/carts",
        label: "Carrinhos Aband.",
        icon: ShoppingCart,
        scaffold: true,
      },
      {
        href: "/admin/shipments",
        label: "Rastreamento",
        icon: Truck,
        scaffold: true,
      },
      {
        href: "/admin/reports",
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
      { href: "/admin/coupons", label: "Cupons", icon: Tag },
      { href: "/admin/banners", label: "Banners", icon: Megaphone },
      { href: "/admin/stories", label: "Stories", icon: PlaySquare },
      {
        href: "/admin/popups",
        label: "Pop-ups",
        icon: MousePointerClick,
        scaffold: true,
      },
      {
        href: "/admin/email",
        label: "E-mail Mktg",
        icon: Mail,
        scaffold: true,
      },
      {
        href: "/admin/push",
        label: "Notif. Push",
        icon: Bell,
        scaffold: true,
      },
      {
        href: "/admin/emails",
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
        href: "/admin/pages",
        label: "Páginas",
        icon: FileText,
        scaffold: true,
      },
      {
        href: "/admin/media",
        label: "Mídia",
        icon: LayoutGrid,
        scaffold: true,
      },
      { href: "/admin/blog", label: "Blog", icon: BookOpen, scaffold: true },
      { href: "/admin/seo", label: "SEO", icon: Search, scaffold: true },
    ],
  },
  {
    id: "customers",
    label: "Customers",
    items: [
      { href: "/admin/customers", label: "Clientes", icon: Users },
      {
        href: "/admin/groups",
        label: "Grupos",
        icon: UserCheck,
        scaffold: true,
      },
      {
        href: "/admin/wishlist",
        label: "Wishlists",
        icon: Heart,
        scaffold: true,
      },
      {
        href: "/admin/segments",
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
      { href: "/admin/settings", label: "Configurações", icon: Settings },
      {
        href: "/admin/shipping-zones",
        label: "Zonas Frete",
        icon: Truck,
        scaffold: true,
      },
      {
        href: "/admin/taxes",
        label: "Impostos",
        icon: Percent,
        scaffold: true,
      },
      {
        href: "/admin/team",
        label: "Equipe Admin",
        icon: ShieldCheck,
        scaffold: true,
      },
      {
        href: "/admin/logs",
        label: "Logs de Erro",
        icon: FileText,
        scaffold: true,
      },
      {
        href: "/admin/audit",
        label: "Auditoria",
        icon: ClipboardList,
        scaffold: true,
      },
      {
        href: "/admin/data",
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
        href: "/admin/integrations/melhor-envio",
        label: "Melhor Envio",
        icon: Truck,
        scaffold: true,
      },
      {
        href: "/admin/integrations/mercadopago",
        label: "Mercado Pago",
        icon: DollarSign,
        scaffold: true,
      },
      {
        href: "/admin/integrations/meta",
        label: "Meta Pixel",
        icon: Globe,
        scaffold: true,
      },
      {
        href: "/admin/integrations/tiktok",
        label: "TikTok Pixel",
        icon: Globe,
        scaffold: true,
      },
      {
        href: "/admin/integrations/webhooks",
        label: "Webhooks",
        icon: Zap,
        scaffold: true,
      },
      {
        href: "/admin/integrations/bling",
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

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  useEffect(() => {
    const activeGroup = NAV_GROUPS.find((g) =>
      g.items.some((item) => isActive(pathname, item))
    );
    if (activeGroup) {
      setExpandedGroups((prev) => new Set(prev).add(activeGroup.id));
    }
  }, [pathname]);

  // Se a rota mudar no mobile, fecha a sidebar automaticamente
  useEffect(() => {
    if (onClose) onClose();
  }, [pathname]);

  function toggleGroup(id: string) {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#050505]/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 flex h-screen w-60 shrink-0 flex-col overflow-hidden border-r border-white/5 bg-[#050505] transition-transform duration-300 md:static md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="shrink-0 border-b border-white/5 px-4 py-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
          <div className="relative flex flex-col items-center gap-3 w-full">
            <div>
              <span className="font-poppins text-md absolute top-4 left-17.5 font-bold text-brand-pink-light uppercase">
                Admin
              </span>
            </div>
            <Logo className="w-42 text-brand-pink-light" />
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden absolute right-3 top-3 p-1.5 text-white/50 hover:text-white"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <nav className="scrollbar-admin flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-3">
        {NAV_GROUPS.map((group) => {
          const isExpanded = expandedGroups.has(group.id);
          const hasActiveChild = group.items.some((item) => isActive(pathname, item));

          return (
            <div key={group.id} className="flex flex-col">
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                className={clsx(
                  "flex w-full items-center justify-between px-3 py-2.5 text-left font-mono text-[11px] tracking-[0.2em] uppercase transition-all duration-150",
                  isExpanded ? "text-brand-pink" : "text-white/40 hover:bg-white/3 hover:text-white/70",
                  hasActiveChild && !isExpanded && "border-l-2 border-brand-pink/50 pl-2.5"
                )}
              >
                <span>{`// ${group.label}`}</span>
                <span className="font-mono text-[11px] opacity-60">
                  {isExpanded ? "[-]" : "[+]"}
                </span>
              </button>

              <div
                className={clsx(
                  "ml-0.5 flex flex-col gap-1 overflow-hidden transition-all duration-300",
                  isExpanded ? "mt-1 mb-3 max-h-[800px] opacity-100" : "mt-0 mb-0 max-h-0 opacity-0"
                )}
              >
                {group.items.map((item) => {
                  const active = isActive(pathname, item);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={clsx(
                        "group relative flex items-center gap-2.5 px-3 py-2 font-mono text-[13px] tracking-widest uppercase transition-all duration-150",
                        active
                          ? "bg-brand-pink/8 text-brand-pink"
                          : "text-white/40 hover:bg-white/3 hover:text-white/80"
                      )}
                    >
                      {active && (
                        <span className="absolute top-1 bottom-1 left-0 w-[2px] bg-brand-pink shadow-[inset_0_0_15px_rgba(255,0,182,0.2)]" />
                      )}
                      <Icon
                        size={15}
                        strokeWidth={2}
                        className={
                          active ? "text-brand-pink" : "text-white/20 group-hover:text-white/50"
                        }
                      />
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      {item.scaffold && (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-none bg-brand-yellow/30" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-white/5 p-2">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 px-3 py-2 font-mono text-[11px] tracking-widest text-white/20 uppercase transition-all duration-150 hover:bg-white/3 hover:text-red-400"
        >
          <LogOut size={14} />
          Sair do sistema
        </button>
      </div>
    </aside>
    </>
  );
}
