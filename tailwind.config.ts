// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  // 1. 'content': Essencial para o Tailwind escanear seus arquivos.
  //    Garanta que todos os diretórios que contêm classes Tailwind estejam listados aqui.
  //    Isso inclui seus componentes, páginas e quaisquer outros arquivos JSX/TSX.
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./modules/**/*.{ts,tsx}", // Incluído como discutido anteriormente, se tiver JSX/TSX aqui
    // Adicione quaisquer outros caminhos se você tiver classes Tailwind em outros lugares
  ],

  // 3. 'plugins': Onde você adiciona plugins oficiais ou de terceiros.
  //    Por exemplo: @tailwindcss/forms, @tailwindcss/typography, etc.
  plugins: [],

  // 4. 'presets': (Opcional) Para reutilizar configurações do Tailwind em múltiplos projetos.
  //    Você provavelmente não precisará disso para um único projeto de portfólio.
  // presets: [],
};

export default config;
