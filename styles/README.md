# Styles — Design System Y2K

Identidade visual Y2K brutalista com Tailwind CSS v4. A fonte da verdade é `tailwind.css`.

## Arquivos

| Arquivo | Propósito |
|---------|-----------|
| `tailwind.css` | Token-set principal: CSS vars, cores, tipografia, sombras, animações, utilities custom |
| `SerenaLoader.module.css` | Animação do loader da marca (CSS Modules) |

## Paleta

| Token | Valor | Uso |
|-------|-------|-----|
| `brand-pink` | `#FF00B6` | Acento primário, links, badges, focus |
| `brand-pink-light` | `#FEB6DE` | Superfície rosa clara, chips inativos |
| `brand-pink-dark` | `#3B2A32` | Superfície rosa escura (dark mode) |
| `brand-pink-bg-dark` | `#11050B` | Background dark global |
| `brand-blue` | `#31cfe9` | Acento secundário |
| `brand-yellow` | `#ffa500` | Acento terciário |

## Tipografia

| Classe | Família | Uso |
|--------|---------|-----|
| `font-jocham` | Jocham | Display principal (títulos, h1/h2 brutalistas) |
| `font-yellowtail` | Yellowtail | Display script (preços, citações decorativas) |
| `font-poppins` | Poppins | UI/labels/CTA (uppercase tracking-wider) |
| `font-inter` | Inter | Body, descrições longas |

## Sombras brutalistas (assinatura Y2K)

- **Card:** `border-2 border-black shadow-[4px_4px_0_#000]` / dark: `border-brand-pink-light shadow-[4px_4px_0_#FF00B6]`
- **Hover:** `hover:translate-y-0.5 hover:shadow-[2px_2px_0_#000]`
- **Botão CTA:** `shadow-[4px_4px_0] shadow-brand-blue active:shadow-[2px_2px_0]`
- **Layers rotacionados:** wrapper `rotate-[1-2deg]` atrás do elemento (assinatura visual)

## Tailwind v4 — atenção

| Use | NÃO use |
|-----|---------|
| `bg-linear-to-t` | `bg-gradient-to-t` |
| `aspect-9/16` | `aspect-[9/16]` |

## Regras

- Nunca usar `style={}` para algo que Tailwind faz
- Preferir composição de classes Tailwind a CSS modules
- `clsx` para merge condicional de classes
