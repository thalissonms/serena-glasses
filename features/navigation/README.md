# Feature: Navigation

## Objetivo
Centraliza toda a lógica e os artefatos relacionados à navegação principal (desktop + mobile) incluindo:
- Configuração de rotas (`config/navPages.ts`)
- Traduções específicas (`translations/*.json`)
- Hook de derivação de páginas (`hooks/useNavPages.ts`)
- Componentes (`components/Nav`, `components/NavPages`, `components/MobileNav`, `components/NavLogo`)
- Utilidades (`utils/isActive.ts`)
- Schemas e tipos (`schemas/navPages.schema.ts`, `types/navPages.types.ts`)

## Como adicionar uma nova página
1. Edite `config/navPages.ts` e acrescente um objeto `{ href: '/nova-rota', key: 'novaKey' }`.
2. Adicione a chave de tradução em cada arquivo de `translations/<lang>.json` dentro de `pages`.
3. (Opcional) Crie a rota em `src/app/nova-rota/page.tsx`.
4. A navegação refletirá automaticamente.

## Regras de detecção de ativo (`isActive`)
- `/` só ativa se o pathname for exatamente `/`.
- Match exato ativa.
- Subrotas (`/outlet/promos`) ativam a rota base (`/outlet`).
- Evita falso positivo (`/outlet-vip` não ativa `/outlet`).

## Acessibilidade
- `aria-current="page"` aplicado para item ativo (desktop e mobile).
- Estrutura semântica: `<nav><ul><li><Link />` no desktop.

## Fontes
- Fontes globais do design system vêm de `modules/ui/utils/typography.ts`.
- Fontes locais customizadas (arquivos em `public/fonts`) expostas via `src/app/fonts.ts`.

## Testes
- Teste de `isActive` em `__tests__/navigation/isActive.test.ts` (Vitest).
- Para adicionar mais testes, criar arquivos `*.test.ts(x)` dentro de `__tests__/navigation`.

## Extensões futuras
- Dropdowns / mega menu: criar subpasta `components/dropdowns`.
- Estados de permissão: adicionar campo opcional `requiresAuth?: boolean` em `RawNavPage`.
- Segmentação por idioma prefixado: normalizar pathname antes de chamar `isActive`.

## Boas práticas
- Não importar diretamente arquivos de tradução fora deste feature – usar sempre via i18n loader central.
- Evitar duplicar lógica de ativo; reutilizar `isActive`.
- Manter ordem de `NAV_PAGES` consistente para UX previsível.
