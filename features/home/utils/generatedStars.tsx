import { useEffect, useState } from "react";

export const useGeneratedStars = (count: number) => {
  const [stars, setStars] = useState<
    Array<{
      size: number;
      x: number;
      y: number;
      duration: number;
      delay: number;
    }>
  >([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setStars(
      Array.from({ length: count }).map(() => {
        const size = Math.random() * 8 + 3;
        return {
          size,
          x: Math.random() * 100,
          y: Math.random() * 100,
          duration: Math.random() * 3 + 2,
          delay: Math.random() * 6,
        };
      })
    );
  }, [count]);

  return { stars, mounted };
};


