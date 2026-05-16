import WishlistMobileContent from "@features/wishlist/components/mobile/WishlistMobileContent";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  return (
    <>
      {/* Desktop: a WishlistDropdown no Nav já serve o desktop */}
      <div className="hidden md:flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-8">
        <Heart size={48} strokeWidth={1.5} className="text-brand-pink/30" aria-hidden="true" />
        <h1 className="font-jocham text-4xl uppercase text-black dark:text-white">Favoritos</h1>
        <p className="font-poppins text-sm text-black/50 dark:text-white/40 max-w-sm">
          Acesse sua lista de favoritos pelo ícone ♥ na barra de navegação do topo.
        </p>
      </div>

      {/* Mobile: fixed overlay cobre o footer do app layout */}
      <div className="md:hidden fixed inset-0 z-40 overflow-y-auto bg-[#FFF0FA] dark:bg-[#0a0a0a]">
        <WishlistMobileContent />
      </div>
    </>
  );
}
