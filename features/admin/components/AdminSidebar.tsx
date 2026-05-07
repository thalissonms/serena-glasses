"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Package, Tag, LogOut, Settings, FolderTree, PlaySquare, Megaphone } from "lucide-react";
import { supabase } from "@shared/lib/supabase/client";
import Logo from "@shared/components/layout/Logos/Logo";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Pedidos", icon: ShoppingBag, exact: false },
  { href: "/admin/products", label: "Produtos", icon: Package, exact: false },
  { href: "/admin/categories", label: "Categorias", icon: FolderTree, exact: false },
  { href: "/admin/coupons", label: "Cupons", icon: Tag, exact: false },
  { href: "/admin/stories", label: "Stories", icon: PlaySquare, exact: false },
  { href: "/admin/banners", label: "Banners", icon: Megaphone, exact: false },
  { href: "/admin/settings", label: "Configurações", icon: Settings, exact: false },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  return (
    <aside className="w-60 min-h-screen bg-[#0f0f0f] border-r-4 border-brand-pink flex flex-col shrink-0">
      {/* Logo */}
      <div className="relative px-6 pt-2 pb-4 border-b-2 border-white/10 flex flex-col items-center gap-3">
        <div>
          <span className="font-poppins uppercase absolute top-6 left-21 font-bold text-1xl text-brand-blue">
            Admin
          </span>
        </div>
        <Logo className="w-42 text-brand-pink-light" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 font-poppins text-sm font-bold uppercase tracking-wider transition-colors ${
                active
                  ? "bg-brand-blue text-gray-900 border-2 border-brand-blue shadow-[3px_3px_0] shadow-brand-pink"
                  : "text-gray-200 hover:text-white hover:bg-brand-pink/5 border-2 border-transparent"
              }`}
            >
              <Icon size={22} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t-2 border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 font-poppins text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-red-400 hover:bg-white/5 border-2 border-transparent transition-colors"
        >
          <LogOut size={15} />
          Sair
        </button>
      </div>
    </aside>
  );
}
