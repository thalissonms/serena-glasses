import NavBottom from "@/shared/navigation/components/mobile/NavBottom";

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <NavBottom />
    </>
  );
}
