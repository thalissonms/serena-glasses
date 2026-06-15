export const dynamic = "force-dynamic";

import { SerenaCollageBackground } from "@shared/components/layout";
import Showcase from "@features/home/components/Showcase";
import MobileHomeFeed from "@/shared/components/MobileProductFeed";
import { getPublicSiteHighlight } from "@features/home/services/siteHighlightPublic.service";
import DynamicHomeSections from "@features/home/components/DynamicHomeSections";
import { getPublicHomeSections } from "@features/home/services/homeSectionsPublic.service";
import StartsBackground from "@shared/components/layout/Backgrounds/StartsBackground";
import clsx from "clsx";

export default async function HomePage() {
  const [highlight, homeSections] = await Promise.all([
    getPublicSiteHighlight(),
    getPublicHomeSections()
  ]);

  return (
    <>
      <article className="transition-duration-300 scroll-smooth text-brand-black transition-colors dark:text-brand-white">
        <div className="sticky top-0 hidden md:block">
          <SerenaCollageBackground>
            <Showcase />
          </SerenaCollageBackground>
        </div>
        <div className="relative mb-25 hidden md:block">
          <div className={clsx("absolute inset-0 -top-4 left-0 z-40 hidden h-4 w-screen bg-linear-0 from-brand-light-surface-0 via-brand-light-surface-0/20 to-transparent",
            "dark:from-brand-dark-surface-0 dark:via-brand-dark-surface-0/20 md:block")} />
          <div className="relative overflow-x-hidden h-full w-full bg-brand-light-surface-0 dark:bg-brand-dark-surface-0"
            style={{
              backgroundImage: "url('/backgrounds/bg-grid.svg')",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <StartsBackground>
              <DynamicHomeSections sections={homeSections} highlight={highlight} />
            </StartsBackground>
          </div>
        </div>
        <div className="block max-w-[100vw] md:hidden">
          <MobileHomeFeed sections={homeSections} />
        </div>
      </article>
    </>
  );
}

