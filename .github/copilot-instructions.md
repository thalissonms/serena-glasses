# Serena Glasses — Copilot Instructions

## Projeto

Site e-commerce boutique de óculos solar — **Serena Glasses**.
Público-alvo: mulheres estilosas, autênticas e fashionistas (15-35 anos).
Posicionamento: óculos diferentes, autênticos, da moda, que não se encontra em qualquer loja. Inspiração na gringa, modelos de boutique.
Referência visual: [Foss Eyewear](https://fosseyewear.com/).

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack em dev)
- **UI**: React 19, Framer Motion (animações)
- **Estilo**: Tailwind CSS v4 (CSS-first com `@theme`), PostCSS, CVA (variantes)
- **Formulários**: react-hook-form + Zod
- **i18n**: i18next + react-i18next (pt-BR default, en-US, es-ES)
- **Ícones**: lucide-react
- **Testes**: Vitest + Testing Library + jsdom
- **Lint**: ESLint 9 + eslint-config-next

## Arquitetura de Pastas

```
src/app/           → App Router (layouts, pages)
features/          → Módulos isolados por feature (home, navigation, products, etc.)
shared/            → Componentes, config, utils reutilizáveis
  components/ui/   → Button, SerenaLoader
  components/layout/ → Header, Footer, Backgrounds
  config/          → siteConfig (metadata, social, SEO)
  utils/typography/ → Fontes (3 locais + 6 Google Fonts)
i18n/              → Config i18next, provider, locales
styles/            → tailwind.css (design tokens), CSS modules
mock/              → Dados mock de produtos (legado — usar features/products/mock)
dev/               → Utilitários de desenvolvimento
public/            → Assets estáticos (logos, backgrounds, fontes, produtos, vídeos)
```

## Convenções de Código

### Imports — Usar SEMPRE aliases

```typescript
import { Button } from "@shared/components/ui";
import { Nav } from "@features/navigation/components/Nav";
import { siteConfig } from "@shared/config";
```

**Aliases disponíveis** (tsconfig paths):
- `@/*` → raiz
- `@features/*` → `features/*`
- `@shared/*` → `shared/*`
- `@i18n/*` → `i18n/*`
- `@styles` → `styles/*`
- `@config` → `config/*`
- `@public/*` → `public/*`

ESLint bloqueia imports relativos cruzando `features/` e `shared/`. Nunca use `@/features/*` ou `@/shared/*`.

### Novas Features

Cada feature segue esta estrutura:

```
features/<nome>/
  components/      → Componentes React
  hooks/           → Custom hooks
  utils/           → Funções utilitárias
  types/           → TypeScript types
  schemas/         → Zod schemas de validação
  config/          → Configuração da feature
  translations/    → Arquivos i18n (en-US.json, es-ES.json, pt-BR.json)
  __tests__/       → Testes Vitest
  README.md        → Documentação da feature
```

### Barrel Exports

Cada pasta com múltiplos exports deve ter um `index.ts`:

```typescript
export { ComponentA } from "./ComponentA";
export { ComponentB } from "./ComponentB";
```

### Componentes

- Client Components: usar `"use client"` no topo
- Server Components: padrão do Next.js (sem diretiva)
- Props: interface nomeada `<NomeComponente>Props`
- Variantes de estilo: usar CVA (`class-variance-authority`)

## Design System

### Cores Brand

| Token | Valor | Uso |
|-------|-------|-----|
| `--brand-pink` | `#FF00B6` | Cor primária (neon pink) |
| `--brand-pink-light` | `#FEB6DE` | Pink claro |
| `--brand-blue` | `#31cfe9` | Accent/destaque |
| `--brand-black` | `#000000` | Texto/fundo escuro |
| `--brand-white` | `#FFFFFF` | Texto/fundo claro |
| `--primary-dark` | `#030213` | Fundo dark mode |

### Fontes

| Família | Variável CSS | Uso |
|---------|-------------|-----|
| Inter | `--font-inter` | Texto principal |
| Poppins | `--font-poppins` | Sans-serif secundária |
| Shrikhand | `--font-shrikhand` | Display/headlines |
| Routhers | `--font-routhers` | Decorativa |
| Jocham | `--font-jocham` | Itálica decorativa |
| Aisha | `--font-aisha` | Script/cursiva |

### Componentes UI Existentes

- **Button**: 9 variantes — `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`, `sunglasses`, `sunglasses-outline`, `sunglasses-black`
- **SerenaLoader**: Loading SVG animado com glow neon rosa

## i18n

- **Idiomas**: pt-BR (default/fallback), en-US, es-ES
- **Namespaces**: `general`, `home`, `nav` (cada feature pode ter o seu)
- **Pattern**: Traduções de feature ficam em `features/<nome>/translations/`, importadas no locale bundle em `i18n/locales/<locale>/index.ts`
- **Uso**: `const { t } = useTranslation("namespace");`

## Testes

```bash
yarn test          # Testes single run
yarn test:watch    # Watch mode
yarn test:ci       # Com coverage
```

- Arquivos de teste: `features/<nome>/__tests__/*.test.{ts,tsx}`
- Setup: `@testing-library/jest-dom` para matchers DOM
- Ambiente: jsdom

## Build & Dev

```bash
yarn dev           # Dev server (Turbopack)
yarn build         # Build produção
yarn start         # Serve produção
yarn lint          # ESLint
```

## Features Implementadas

### Home (`/`)
- Hero showcase com polaroids animados, estrelas geradas proceduralmente, CTA
- Componentes: `Showcase`, `StackedPolaroids`, `HeaderButton`

### Navigation
- NavBar responsiva com menu mobile (hambúrguer)
- Rotas configuradas: `/sun-glasses`, `/mini-drop`, `/accessories`, `/outlet`, `/promotions`
- Schema Zod para validação de nav pages
- Traduções pt-BR, en-US, es-ES

### Products (Data Layer)
- **Tipos**: `features/products/types/product.types.ts` — modelo de documento NoSQL completo
  - `Product` (documento principal), `ProductCard` (projeção para listagem), `ProductFilters`, `ProductSortBy`
  - Enums: `ProductCategory`, `FrameShape`, `FrameMaterial`, `LensType`, `ProductStatus`
  - Subdocumentos: `ProductColor`, `ProductImage`, `ProductVariant`, `ProductRating`, `ProductSeo`
- **Schemas Zod**: `features/products/schemas/product.schema.ts` — validação completa
  - Preço em centavos (`z.int().positive()`), hex color regex, slug lowercase-hyphen regex
- **Config**: `features/products/config/product.config.ts` — 12 cores, labels para categorias/shapes/materials/lenses
- **Mock Data**: `features/products/mock/products.mock.ts` — 8 produtos completos
- **Testes**: `features/products/__tests__/product.schema.test.ts` — 44 testes

### Suítes de Testes (88 testes passando)
- `isActive.test.ts` (4) — utilitário de navegação
- `siteConfig.test.ts` (15) — validação de configuração do site
- `navPages.test.ts` (18) — schema de páginas de navegação
- `product.schema.test.ts` (44) — schemas e mock data de produtos
- `generatedStars.test.ts` (7) — geração procedural de estrelas

## Banco de Dados

- **Target**: NoSQL (MongoDB / Firestore / DynamoDB)
- **Modelo**: Documento denormalizado — cada Product contém arrays de subdocumentos (images, variants, ratings, seo)
- **Preços**: Armazenados em centavos (inteiro) — ex: 24900 = R$ 249,00
- **Status atual**: Mock data em TypeScript. Migração para DB real planejada.

## Segurança

- CSP strict em produção (self + strict-dynamic)
- Headers: HSTS, X-Frame-Options DENY, X-Content-Type-Options nosniff
- Referrer-Policy: origin-when-cross-origin
- X-Powered-By removido
