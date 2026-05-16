"use client";

import PageInterceptTransition from "@features/navigation/components/mobile/modals/PageInterceptTransition";
import SearchMobileContent from "./SearchMobileContent";

export default function SearchModalContent() {
  return (
    <PageInterceptTransition>
      <SearchMobileContent />
    </PageInterceptTransition>
  );
}
