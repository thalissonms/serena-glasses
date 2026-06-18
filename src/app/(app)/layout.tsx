import { ReviewsOverlay } from "@features/products/components/ReviewsOverlay";
import { CapturePopupTrigger } from "@shared/components/CapturePopupTrigger";
import { Footer } from "@shared/components/layout";
import { WhatsAppFloat } from "@shared/components/WhatsAppFloat";
import { Nav } from "@shared/navigation/components/Nav";
import { TopBanner } from "@shared/components/layout/TopBanner";
import NavBottom from "@shared/navigation/components/mobile/NavBottom";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="sticky top-0 z-50 hidden w-full md:block">
        <TopBanner />
        <Nav />
      </div>
      {children}
      <Footer />
      <ReviewsOverlay />
      <WhatsAppFloat />
      <CapturePopupTrigger />
      <NavBottom />
    </>
  );
}
