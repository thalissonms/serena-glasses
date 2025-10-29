// src/components/TypographyExamples.tsx
import { SerenaCollageBackground } from "@shared/components/layout";
import Showcase from "@features/home/components/Showcase";
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
