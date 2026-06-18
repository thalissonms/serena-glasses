import CheckoutModalContent from "@features/checkout/components/mobile/CheckoutModalContent";
import CheckoutContentPage from "@features/checkout/components/CheckoutContentPage";
import { CheckoutFormProvider } from "@features/checkout/providers/checkout.rhf";

export default function CheckoutPage() {
  return (
    <CheckoutFormProvider>
      <div className="hidden md:block">
        <CheckoutContentPage />
      </div>
      <div className="md:hidden block">
        <CheckoutModalContent />
      </div>
    </CheckoutFormProvider>
  );
}
