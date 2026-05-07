"use client";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { NAV_PAGES } from "../config/navPages";
import { navPagesHrefType, navPagesLabelType, navPagesType } from "../types/navPages.types";

export const useNavPages = (): navPagesType => {
  const { t } = useTranslation("nav");
  return useMemo(
    () => NAV_PAGES.map(p => ({
      href: p.href as navPagesHrefType,
      label: t(`pages.${p.key}`, p.key) as navPagesLabelType,
    })),
    [t],
  );
};
