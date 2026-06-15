"use client";

import PageInterceptTransition from "@/shared/navigation/components/mobile/modals/PageInterceptTransition";
import SearchMobileContent from "./SearchMobileContent";

export default function SearchModalContent() {
  return (
    <PageInterceptTransition>
      <SearchMobileContent />
    </PageInterceptTransition>
  );
}
