import Link from "next/link";
import { Home, Edit2, LayoutTemplate } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Páginas | Admin Serena",
};

export default function PagesIndex() {
  const pages = [
    {
      id: "home",
      name: "Home",
      description: "Página inicial da loja. Configure os banners, coleções e seções de destaque.",
      icon: Home,
      href: "/admin/pages/home",
      status: "ativo",
    },
    // Future pages like "Sobre Nós", "Contato", "FAQ" can be added here
  ];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-poppins font-black text-2xl text-white tracking-wide">
            PÁGINAS
          </h1>
          <p className="font-mono text-[11px] uppercase tracking-widest text-white/25 mt-1">
            {"// "}GERENCIE O CONTEÚDO DAS PÁGINAS DA LOJA
          </p>
        </div>
      </div>

      {/* Pages List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pages.map((page) => (
          <div
            key={page.id}
            className="group relative flex flex-col border border-white/8 bg-[#0a0a0a] p-5 hover:border-brand-pink/30 hover:bg-[#050505] transition-all duration-300"
          >
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-white/20 group-hover:border-brand-pink/60 transition-colors" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-white/20 group-hover:border-brand-pink/60 transition-colors" />

            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 border border-white/10 bg-[#0f0f0f] text-white/40 group-hover:border-brand-pink/30 group-hover:text-brand-pink group-hover:shadow-[inset_0_0_15px_rgba(255,0,182,0.1)] transition-all duration-300">
                  <page.icon size={18} />
                </div>
                <div>
                  <h2 className="font-poppins font-bold text-lg text-white">
                    {page.name}
                  </h2>
                  <span className="inline-block px-1.5 py-0.5 mt-1 font-mono text-[9px] uppercase tracking-widest border border-brand-pink/30 text-brand-pink bg-brand-pink/10">
                    {page.status}
                  </span>
                </div>
              </div>
            </div>

            <p className="font-mono text-[11px] text-white/40 leading-relaxed flex-1 mb-6">
              {"// "}{page.description}
            </p>

            <div className="flex justify-end border-t border-white/5 pt-4 mt-auto">
              <Link
                href={page.href}
                className="flex items-center gap-2 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-white/40 border border-white/10 hover:text-brand-pink hover:border-brand-pink/40 hover:bg-brand-pink/10 transition-all duration-300"
              >
                <Edit2 size={13} />
                Editar Página
              </Link>
            </div>
          </div>
        ))}

        {/* Placeholder for future pages */}
        <div className="group relative flex flex-col items-center justify-center border border-dashed border-white/10 bg-transparent p-6 text-center hover:border-white/20 transition-all duration-300">
          <div className="w-10 h-10 flex items-center justify-center rounded-none bg-white/3 text-white/20 mb-3">
            <LayoutTemplate size={18} />
          </div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-white/25">
            {"// "}MAIS PÁGINAS EM BREVE
          </p>
          <span className="font-mono text-[9px] text-white/15 mt-2">
            Sobre Nós, Contato, FAQ, etc.
          </span>
        </div>
      </div>
    </div>
  );
}
