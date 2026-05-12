import { useRouter } from "next/navigation";

export const useSmartBack = (fallback: string) => {
  const router = useRouter();

  return () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  };
};
