export const dynamic = "force-dynamic";

import { SearchPageContent } from "@features/search/components/SearchPageContent";
import { searchProducts } from "@features/search/services/searchService";
import SearchModalContent from "@features/search/components/mobile/SearchModalContent";

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
      <div className="md:hidden">
        <SearchModalContent />
      </div>
    </>
  );
}
