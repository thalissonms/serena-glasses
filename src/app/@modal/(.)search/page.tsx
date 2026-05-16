"use client";

import { useMounted } from "@shared/hooks/useMounted";
import { useIsDesktop } from "@shared/hooks/useIsDesktop";
import SearchModalContent from "@features/search/components/mobile/SearchModalContent";

export default function SearchModal() {
  const mounted = useMounted();
  const isDesktop = useIsDesktop();
  if (!mounted || isDesktop) return null;
  return <SearchModalContent />;
}
