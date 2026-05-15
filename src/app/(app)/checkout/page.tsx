import CheckoutPageContentMobile from "@features/checkout/components/mobile/CheckoutContentPageMobile";
import PageInterceptTransition from "@features/navigation/components/mobile/modals/PageInterceptTransition";
import CheckoutContentPage from "@features/checkout/components/CheckoutContentPage";
import { CheckoutFormProvider } from "@features/checkout/providers/checkout.rhf";

export default function CheckoutModal() {
  return (
    <CheckoutFormProvider>
      <div className="hidden md:block">
        <CheckoutContentPage />
      </div>
      <div className="md:hidden block">
        <CheckoutPageContentMobile />
      </div>
    </CheckoutFormProvider>
  );
}
