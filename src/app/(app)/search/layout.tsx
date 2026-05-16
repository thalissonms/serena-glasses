import NavBottom from "@/features/navigation/components/mobile/NavBottom";

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <NavBottom />
    </>
  );
}
