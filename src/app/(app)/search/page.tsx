export const dynamic = "force-dynamic";

import { SearchPageContent } from "@features/search/components/SearchPageContent";
import SearchMobileContent from "@features/search/components/mobile/SearchMobileContent";
import { searchProducts } from "@features/search/services/searchService";

interface Props {
  searchParams: Promise<{ q?: string; subcategory?: string; shape?: string; color?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = "", subcategory, shape, color } = await searchParams;
  const results = q.length >= 2 ? await searchProducts({ q, subcategory, shape, color }) : [];

  return (
    <>
      <div className="hidden md:block">
        <SearchPageContent query={q} initialResults={results} />
      </div>
      {/* Fixed overlay so o footer do app layout não aparece embaixo no mobile */}
      <div className="md:hidden fixed inset-0 z-40 overflow-y-auto bg-[#FFF0FA] dark:bg-[#0a0a0a]">
        <SearchMobileContent initialQuery={q} />
      </div>
    </>
  );
}
