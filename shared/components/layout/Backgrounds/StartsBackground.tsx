import { HeartIcon, StarIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { ReactNode, useMemo } from "react";

export default function StartsBackgroud({ children }: { children: ReactNode }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        size: Math.random() * 5 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      })),
    [],
  );

  const sparkles = useMemo(
    () =>
      Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        size: Math.random() * 10 + 6,
        opacity: Math.random() * 0.5 + 0.1,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        rotate: Math.random() * 180,
      })),
    [],
  );
  return (
    <>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        {particles.map((particle) => (
          <div
            key={particle.id}
            className={clsx("absolute rounded-full bg-brand-pink dark:bg-brand-blue animate-pulse")}
            style={{
              width: particle.size,
              height: particle.size,
              left: particle.left,
              top: particle.top,
              opacity: particle.opacity,
              filter: "blur(0.6px)",
              boxShadow: "0 0 12px rgba(255,0,182,0.25)",
              animationDuration: `${particle.opacity * 10}s`
            }}
          />
        ))}

        {sparkles.map((sparkle, i) => {
          const Icon = i % 2 === 0 ? StarIcon : HeartIcon;

          return (
            <Icon
              key={sparkle.id}
              className={clsx("absolute text-brand-pink dark:text-brand-purple animate-ping")}
              style={{
                width: sparkle.size,
                height: sparkle.size,
                left: sparkle.left,
                top: sparkle.top,
                opacity: sparkle.opacity,
                transform: `rotate(${sparkle.rotate}deg)`,
                filter: `
              drop-shadow(0 0 6px rgba(255,255,255,0.6))
              drop-shadow(0 0 12px rgba(255,0,182,0.35))
            `,
                animationDuration: `${sparkle.opacity * 20}s`
              }}
            />
          );
        })}

        <div
          className="absolute inset-0 opacity-[1] mix-blend-overlay"
          style={{
            backgroundImage:
              "url('https://grainy-gradients.vercel.app/noise.svg')",
          }}
        />
      </div>
      {children}
    </>
  );
}
