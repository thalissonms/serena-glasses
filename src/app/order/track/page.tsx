import { supabaseServer } from "@shared/lib/supabase/server";
import OrderTrackForm from "@features/orders/components/OrderTrackForm";
import OrderTrackResult from "@features/orders/components/OrderTrackResult";

const glassesSvg = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#fce7f3" version="1.1" id="Capa_1" viewBox="0 0 460.72 460.719" xml:space="preserve"><g><g><path d="M443.293,151.905c-21.556-2.48-41.537-3.737-59.347-3.737c-74.245,0-98.029,21.416-110.809,32.923l-2.052,1.833c-9.394,8.263-25.03,9.521-33.534,9.536l-7.2,0.008l-7.197-0.008c-8.496-0.014-24.131-1.272-33.522-9.536l-2.048-1.833c-12.78-11.507-36.576-32.923-110.817-32.923c-17.819,0-37.784,1.256-59.348,3.737c-10.093,1.162-18.047,10.496-17.38,20.377c1.713,25.235,10.652,87.354,56.609,119.093c20.065,13.854,42.731,21.176,65.551,21.176c46.907,0,81.904-30.36,89.163-77.332c0.104-0.629,2.733-15.362,18.089-15.362l1.026,0.014l0.793-0.014c15.356,0,17.977,14.733,18.085,15.339c7.262,46.995,42.258,77.355,89.161,77.355c22.822,0,45.484-7.322,65.554-21.176c45.953-31.755,54.894-93.857,56.608-119.093C461.351,162.401,453.392,153.06,443.293,151.905z"/></g></g></svg>`,
);

interface Props {
  searchParams: Promise<{ order?: string; email?: string }>;
}

export default async function OrderTrackPage({ searchParams }: Props) {
  const { order, email } = await searchParams;

  let orderData = null;
  let notFound = false;

  if (order && email) {
    const { data } = await supabaseServer
      .from("orders")
      .select("*, order_items(*)")
      .eq("order_number", order.trim().toUpperCase())
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    if (data) orderData = data;
    else notFound = true;
  }

  return (
    <main
      className="w-full min-h-screen text-black dark:text-white py-16 px-4 sm:px-8 bg-[#FFF0FA] dark:bg-[#0a0a0a] transition-colors"
      style={{
        backgroundImage: `url("data:image/svg+xml,${glassesSvg}")`,
        backgroundSize: "60px 50px",
        backgroundRepeat: "repeat",
      }}
    >
      <OrderTrackForm defaultOrder={order} defaultEmail={email} notFound={notFound} />
      {orderData && <OrderTrackResult order={orderData} />}
    </main>
  );
}
