// src/modules/utils/typography.ts

import {
  Poppins,
  Dancing_Script,
  Playfair_Display,
  Beth_Ellen,
  Shrikhand,
  Inter,
} from "next/font/google";

// Configurando Inter (fonte principal para substituir a importação CSS)
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800", "900"],
});

// Configurando Poppins (sua fonte sans-serif principal)
export const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"], // Pesos comuns para um texto sans-serif
});

export const shrikhand = Shrikhand({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-shrikhand",
  weight: ["400"], // Pesos comuns para um texto sans-serif
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
  inter: inter.variable,
  poppins: poppins.variable,
  dancingScript: dancingScript.variable,
  playfairDisplay: playfairDisplay.variable,
  bethEllen: bethEllen.variable,
  shrikhand: shrikhand.variable,
};

// Se você precisar de todas as classes de variáveis de uma vez
export const allFontVariablesClassNames = `${inter.variable} ${poppins.variable} ${dancingScript.variable} ${playfairDisplay.variable} ${bethEllen.variable} ${shrikhand.variable}`;
