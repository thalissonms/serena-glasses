import { SuccessContent } from "@features/checkout/components/SuccessContent";

interface Props {
  searchParams: Promise<{ order?: string }>;
}

export default async function SuccessPage({ searchParams }: Props) {
  const { order } = await searchParams;
  return <SuccessContent orderNumber={order} />;
}
