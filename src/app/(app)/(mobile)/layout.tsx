import { TopBanner } from "@shared/components/layout/TopBanner";
import { NavMobileTopBar } from "@features/navigation/components/mobile/NavMobileTopBar";
import NavBottom from "@/features/navigation/components/mobile/NavBottom";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="sticky top-0 w-full md:hidden z-50">
        <TopBanner />
        <NavMobileTopBar />
      </div>
      {children}
      <NavBottom />
    </>
  );
}
