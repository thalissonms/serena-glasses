import NavBottom from "@/features/navigation/components/mobile/NavBottom";

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <NavBottom />
    </>
  );
}
