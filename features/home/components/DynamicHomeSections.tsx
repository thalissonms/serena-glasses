"use client";

import { useTranslation } from "react-i18next";
import { PublicHomeSection } from "@features/home/services/homeSectionsPublic.service";
import ProductCardY2K from "@features/products/components/ProductCardY2K";
import clsx from "clsx";

interface Props {
  sections: PublicHomeSection[];
}

export default function DynamicHomeSections({ sections }: Props) {
  const { t } = useTranslation("home");

  if (!sections || sections.length === 0) return null;

  return (
    <div className="flex flex-col gap-12 py-12 md:gap-16 md:py-16">
      {sections.map((section) => (
        <section key={section.id} className="mx-auto w-full px-4 md:px-8">
          <div className="mb-8 flex flex-col items-center md:mb-12">
            <h3 className="flex items-center gap-4 text-center font-shrikhand text-2xl tracking-wider text-brand-black uppercase md:text-4xl dark:text-brand-white">
              <span className="text-brand-pink">◆</span>
              <span className="text-brand-black dark:text-brand-white">
                {section.title_pt}
              </span>
              <span className="text-brand-pink">◆</span>
            </h3>
          </div>

          {/* Grid de produtos mantendo a referÃªncia Y2K */}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,400px))] justify-center gap-6">
            {section.products.slice(0, 8).map((product, i) => (
              <div key={product.id} className="flex w-full justify-center">
                <ProductCardY2K product={product} index={i} />
              </div>
            ))}
          </div>

          {section.products.length === 0 && !section.is_special_component && (
            <div className="w-full rounded-lg border-4 border-dashed border-brand-black/20 py-12 text-center">
              <p className="font-mono text-xs tracking-widest text-brand-black/40 uppercase">
                Nenhum produto disponÃ­vel nesta seÃ§Ã£o.
              </p>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
