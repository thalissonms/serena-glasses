import NavBottom from "@/shared/navigation/components/mobile/NavBottom";

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <NavBottom />
    </>
  );
}
