"use client";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const textStyles = [
  { text: "text-brand-pink", shadow: "drop-shadow-[3px_3px_0px_#00BFFF]" },
  { text: "text-brand-blue", shadow: "drop-shadow-[3px_3px_0px_#FFFFFF]" },
  { text: "text-brand-yellow", shadow: "drop-shadow-[3px_3px_0px_#FF00B6]" },
] as const;

const restingStyle = {
  text: "text-brand-pink",
  shadow: "drop-shadow-[6px_3px_0px_rgba(0,0,0,1)]",
} as const;

const FLICKER_MS = 300;
const FLICKER_DURATION_MS = 2400;

interface ProductMediaViewerProps {
  name: string;
  videoSrc?: string;
  fallbackImageUrl?: string;
  /** Tailwind override for the outer wrapper (responsive sizing). */
  className?: string;
}

export default function ProductMediaViewer({
  name,
  videoSrc,
  fallbackImageUrl,
  className = "w-full max-w-42 md:max-w-106 mx-auto md:mx-0",
}: ProductMediaViewerProps) {
  const [styleIndex, setStyleIndex] = useState(0);
  const [flickering, setFlickering] = useState(true);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % textStyles.length;
      setStyleIndex(i);
    }, FLICKER_MS);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setFlickering(false);
    }, FLICKER_DURATION_MS);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const current = flickering ? textStyles[styleIndex] : restingStyle;

  return (
    <div
      className={clsx(
        "relative aspect-9/16 border-4 border-black dark:border-brand-pink-light shadow-[8px_8px_0px] shadow-brand-pink dark:shadow-brand-blue overflow-hidden bg-black",
        className,
      )}
    >
      <AnimatePresence>
        {flickering && (
          <motion.div
            className="absolute w-full h-full bg-black z-20"
            initial={{ opacity: 0.75 }}
            animate={{ opacity: 0.75 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {videoSrc ? (
        <video
          src={videoSrc}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          aria-label={name}
        />
      ) : fallbackImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={fallbackImageUrl}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-[#111]" aria-hidden="true" />
      )}

      <div
        className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none z-30"
        aria-hidden="true"
      >
        <h2
          className={clsx(
            "text-5xl md:text-6xl font-poppins font-black uppercase tracking-wider text-center px-4",
            current.text,
            current.shadow,
            !flickering && "hidden",
          )}
        >
          {name}
        </h2>
      </div>
    </div>
  );
}
