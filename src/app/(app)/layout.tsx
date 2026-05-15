import { ReviewsOverlay } from "@features/products/components/ReviewsOverlay";
import { CapturePopupTrigger } from "@shared/components/CapturePopupTrigger";
import { Footer } from "@shared/components/layout";
import { WhatsAppFloat } from "@shared/components/WhatsAppFloat";
import { Nav } from "@features/navigation/components/Nav";
import { Y2KToaster } from "@shared/components/Y2KToaster";
import { TopBanner } from "@shared/components/layout/TopBanner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="w-full sticky top-0 z-50 hidden md:block">
        <TopBanner />
        <Nav />
      </div>
      {children}
      <Footer />
      <ReviewsOverlay />
      <WhatsAppFloat />
      <CapturePopupTrigger />
      <Y2KToaster />
    </>
  );
}
