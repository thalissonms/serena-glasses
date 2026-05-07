"use client";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const textStyles = [
  { text: "text-brand-pink", shadow: "drop-shadow-[3px_3px_0px_#00BFFF]" },
  { text: "text-brand-blue", shadow: "drop-shadow-[3px_3px_0px_#FFFFFF]" },
  { text: "text-brand-yellow", shadow: "drop-shadow-[3px_3px_0px_#FF00B6]" },
];

interface ProductMediaViewerProps {
  name: string;
  videoSrc?: string;
  fallbackImageUrl?: string;
}

export default function ProductMediaViewer({ name, videoSrc, fallbackImageUrl }: ProductMediaViewerProps) {
  const [styleIndex, setStyleIndex] = useState(0);
  const [vidAnimation, setVidAnimation] = useState(true);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % textStyles.length;
      setStyleIndex(index);
    }, 300);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setStyleIndex(999);
      setVidAnimation(false);
    }, 2400);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const current =
    styleIndex === 999
      ? { text: "text-brand-pink", shadow: "drop-shadow-[6px_3px_0px_rgba(0,0,0,1)]" }
      : textStyles[styleIndex];

  return (
    <div className="relative w-full max-w-106 mx-auto md:mx-0 aspect-9/16 border-4 border-black dark:border-brand-pink-light shadow-[8px_8px_0px] shadow-brand-pink dark:shadow-brand-blue overflow-hidden bg-black">
      <AnimatePresence>
        {vidAnimation && (
          <motion.div
            className="absolute w-full h-full bg-black z-20"
            initial={{ opacity: 0.75 }}
            animate={{ opacity: 0.75 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
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
        />
      ) : fallbackImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={fallbackImageUrl}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-[#111]" />
      )}

      <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none z-30">
        <h1
          className={clsx(
            "text-5xl md:text-6xl font-poppins font-black uppercase tracking-wider text-center px-4",
            current.text,
            current.shadow,
            !vidAnimation && "hidden",
          )}
        >
          {name}
        </h1>
      </div>
    </div>
  );
}
