"use client";

import { motion } from "framer-motion";
import Image from "next/image"
export default function HeroHeader() {
  return (
    <header className="w-full h-screen relative bg-[#FF00B6] overflow-hidden">
      <div className="w-full h-6 bg-black/90 text-[#FF00B6] text-sm absolute top-0 px-2 z-50 flex items-center overflow-hidden">
        <motion.div
          className="whitespace-nowrap uppercase tracking-widest font-medium"
          animate={{ x: ["100%", "-100%"] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        >
          Serena 🕶️ Serena 🕶️ Serena 🕶️ Serena 🕶️ Serena 🕶️ Serena 🕶️ Serena 🕶️ Serena 🕶️ Serena 🕶️ Serena 🕶️ Serena 🕶️ Serena 🕶️
        </motion.div>
      </div>
      <div className="relative w-full min-h-[500px] sm:h-[600px] flex items-stretch mt-6">
        <div className="h-screen flex items-center justify-center mr-10">
            <Image
            src="/logo-black.png"
            width={800}
            height={600}
            alt="Logo"
            />
        </div>
        <div className="flex-1 hidden lg:block" />

        <div className="relative w-full lg:w-[700px] h-screen overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-32 z-10 pointer-events-none bg-gradient-to-r from-[#FF00B6] via-[#FF00B6]/70 to-transparent" />

           <div className="absolute right-0 top-0 h-full w-24 z-10 pointer-events-none bg-gradient-to-l from-[#FF00B6] via-[#FF00B6]/50 to-transparent" /> 

          <div className="absolute inset-0 bg-[#FF00B6]/20 z-10 pointer-events-none" />

          <motion.video
            className="w-full h-full object-cover object-center"
            autoPlay
            muted
            loop
            preload="metadata"
            poster="/poster.jpg"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5 }}
            aria-label="Vídeo de apresentação Serena Glasses"
            title="Vídeo de apresentação Serena Glasses"
          >
            <source src="/header-video.mp4" type="video/mp4" />
          </motion.video>
        </div>
      </div>
    </header>
  );
}
