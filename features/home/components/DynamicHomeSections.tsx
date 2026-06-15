"use client";

import { useTranslation } from "react-i18next";
import { PublicHomeSection } from "@features/home/services/homeSectionsPublic.service";
import { PublicSiteHighlight } from "@features/home/services/siteHighlightPublic.service";
import ProductCardY2K from "@features/products/components/ProductCardY2K";
import { pickLocale } from "@shared/utils/pickLocale";
import SectionTitle from "@features/home/components/SectionTitle";
import SiteHighlight from "@features/home/components/SiteHighlight";

interface Props {
  sections: PublicHomeSection[];
  highlight: PublicSiteHighlight | null;
}

function SectionBlock({ section, lang }: { section: PublicHomeSection; lang: string }) {
  return (
    <section className="mx-auto w-full px-4 md:px-8">
      <div className="mb-8 flex flex-col items-center md:mb-12">
        <SectionTitle title={pickLocale(section, lang)} />
      </div>

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
            Nenhum produto disponível nesta seção.
          </p>
        </div>
      )}
    </section>
  );
}

export default function DynamicHomeSections({ sections, highlight }: Props) {
  const { i18n } = useTranslation("home");

  if (!sections || sections.length === 0) return null;

  const highlightPosition = highlight?.position ?? -1;

  return (
    <div className="flex flex-col gap-12 py-12 md:gap-16 md:py-16">
      {highlightPosition === 0 && <SiteHighlight hightlight={highlight} />}

      {sections.map((section, index) => (
        <div key={section.id} className="flex flex-col items-center justify-center">
          <SectionBlock section={section} lang={i18n.language} />
          {highlightPosition === index + 1 && <div className="max-w-[87vw] mt-12"><SiteHighlight hightlight={highlight} /></div>}
        </div>
      ))}

      {highlightPosition > sections.length && <SiteHighlight hightlight={highlight} />}
    </div>
  );
}
