"use client";

import { Shield, Star, Truck, Instagram, Facebook } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { siteConfig } from "@shared/config";
import { usePathname } from "next/navigation";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation("home");
  
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) return null;
  
  return (
    <footer className="bg-black dark:bg-brand-black-dark text-white dark:text-black py-12 md:py-16 transition-colors">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10 md:gap-y-0 md:gap-x-8 text-center border-b border-gray-700 dark:border-brand-pink/30 pb-10 mb-10">
          {[
            {
              icon: <Truck className="w-7 h-7 text-white dark:text-brand-pink-dark" />,
              title: t("highlights.freeShipping"),
              desc: t("highlights.freeShippingDesc"),
            },
            {
              icon: <Shield className="w-7 h-7 text-white dark:text-brand-pink-dark" />,
              title: t("highlights.uvProtection"),
              desc: t("highlights.uvProtectionDesc"),
            },
            {
              icon: <Star className="w-7 h-7 text-white dark:text-brand-pink-dark" />,
              title: t("highlights.premiumQuality"),
              desc: t("highlights.premiumQualityDesc"),
            },
          ].map(({ icon, title, desc }, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-primary dark:bg-brand-blue rounded-full dark:border-2 dark:border-brand-black-dark shadow-neon dark:shadow-[3px_3px_0] shadow-black dark:shadow-brand-pink-light">
                  {icon}
                </div>
              </div>
              <h3 className="text-lg font-bold mb-1 tracking-wide dark:text-brand-pink">{title}</h3>
              <p className="text-sm text-gray-400 dark:text-brand-blue max-w-xs">{desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm text-gray-300 dark:text-black/80">
          <div>
            <h4 className="text-white font-semibold mb-4 text-base dark:text-brand-pink">
              {t("footer.about")} {siteConfig.siteName}
            </h4>
            <p className="leading-relaxed dark:text-brand-pink-light">{siteConfig.siteDescription}</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-base dark:text-brand-pink">
              {t("footer.siteMap")}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="hover:text-primary dark:text-brand-pink-light dark:hover:text-brand-blue transition-colors">
                  {t("footer.links.home")}
                </Link>
              </li>
              <li>
                <Link href="/sun-glasses" className="hover:text-primary dark:text-brand-pink-light dark:hover:text-brand-blue transition-colors">
                  {t("footer.links.sunGlasses")}
                </Link>
              </li>
              <li>
                <Link href="/mini-drop" className="hover:text-primary dark:text-brand-pink-light dark:hover:text-brand-blue transition-colors">
                  {t("footer.links.miniDrop")}
                </Link>
              </li>
              <li>
                <Link href="/outlet" className="hover:text-primary dark:text-brand-pink-light dark:hover:text-brand-blue transition-colors">
                  {t("footer.links.outlet")}
                </Link>
              </li>
              <li>
                <Link href="/promotions" className="hover:text-primary dark:text-brand-pink-light dark:hover:text-brand-blue transition-colors">
                  {t("footer.links.promotions")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white dark:text-brand-pink font-semibold mb-4 text-base">
              {t("footer.followUs")}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href={siteConfig.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary dark:text-brand-pink-light dark:hover:text-brand-blue transition-colors flex items-center gap-2"
                >
                  <Instagram size={18} /> Instagram
                </Link>
              </li>
              <li>
                <Link
                  href={siteConfig.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary dark:text-brand-pink-light dark:hover:text-brand-blue transition-colors flex items-center gap-2"
                >
                  <Facebook size={18} /> Facebook
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white dark:text-brand-pink font-semibold mb-4 text-base">
              {t("footer.credits")}
            </h4>
            <p className="leading-relaxed dark:text-brand-pink-light">
              © {currentYear} {siteConfig.siteName}
            </p>
            <p className="mt-2 leading-relaxed dark:text-brand-pink-light">
              {t("footer.developedBy")}{" "}
              <span className="text-brand-pink dark:text-brand-blue">{siteConfig.author}</span>
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 dark:border-brand-pink/30 mt-10 pt-8 text-center text-sm text-gray-500 dark:text-brand-pink-light">
          <p>{t("footer.allRightsReserved")}</p>
        </div>
      </div>
    </footer>
  );
};
