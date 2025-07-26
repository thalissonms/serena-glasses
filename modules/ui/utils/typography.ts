// src/modules/utils/typography.ts

import {
  Poppins,
  Dancing_Script,
  Playfair_Display,
  Beth_Ellen,
} from "next/font/google";

// Configurando Poppins (sua fonte sans-serif principal)
export const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"], // Pesos comuns para um texto sans-serif
});

// Configurando Dancing Script (para títulos ou elementos decorativos)
export const dancingScript = Dancing_Script({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-routhers", // Mantendo a variável original para o Tailwind
  weight: "400", // Geralmente tem um único peso
});

// Configurando Playfair Display (para títulos ou sub-títulos elegantes)
export const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jocham", // Mantendo a variável original para o Tailwind
  weight: ["400", "500", "600", "700", "800", "900"], // Vários pesos, escolha os que precisar
  style: ["normal", "italic"], // Para usar o estilo itálico
});

// Configurando Beth Ellen (para detalhes ou assinaturas)
export const bethEllen = Beth_Ellen({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-aisha", // Mantendo a variável original para o Tailwind
  weight: "400", // Geralmente tem um único peso
});

// Opcional: Você pode exportar um objeto para facilitar o uso no layout
export const fontVariables = {
  poppins: poppins.variable,
  dancingScript: dancingScript.variable,
  playfairDisplay: playfairDisplay.variable,
  bethEllen: bethEllen.variable,
};

// Se você precisar de todas as classes de variáveis de uma vez
export const allFontVariablesClassNames = `${poppins.variable} ${dancingScript.variable} ${playfairDisplay.variable} ${bethEllen.variable}`;
