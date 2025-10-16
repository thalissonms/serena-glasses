"use client";
import { useTranslation } from "react-i18next";
import { NAV_PAGES } from "../config/navPages";
import { navPagesHrefType, navPagesLabelType, navPagesType } from "../types/navPages.types";

export const useNavPages = (): navPagesType => {
  const { t } = useTranslation("nav");
  return NAV_PAGES.map(p => ({ href: p.href as navPagesHrefType, label: t(`pages.${p.key}`, p.key) as navPagesLabelType }));
};
