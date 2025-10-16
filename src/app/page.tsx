// src/components/TypographyExamples.tsx
import { SerenaCollageBackground } from "@/components/layout";
import Showcase from "@/modules/home/components/Showcase";
import React from "react";

const TypographyExamples: React.FC = () => {
  return (
    <article className="bg-gradient-to-b bg-white from-white/80 to-white text-black min-h-screen">
      <SerenaCollageBackground>
        <Showcase />
      </SerenaCollageBackground>
    </article>
  );
};

export default TypographyExamples;
