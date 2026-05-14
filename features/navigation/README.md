# Feature: Navigation

## Objetivo
Centraliza toda a lógica e os artefatos relacionados à navegação principal (desktop + mobile) incluindo:
- Componentes (`components/Nav`, `components/NavPages`, `components/MobileNav`, `components/NavLogo`)
- Utilidades (`utils/isActive.ts`)

## Fonte das páginas de navegação

As páginas do menu são **DB-driven** via `useCategories()` (hook em `features/categories/hooks/useCategories.ts`). Cada categoria no banco possui `kind: 'category' | 'flag'`, `slug`, `icon_name` e nomes localizados (`name_pt / name_en / name_es`).

- Para adicionar uma nova página de navegação, crie a categoria via `/admin/categories`.
- A label localizada é obtida via `pickLocale(category, lang)` (`shared/utils/pickLocale.ts`).
- O ícone é obtido via `getCategoryIcon(category.icon_name)` (`features/products/utils/getCategoryIcon.ts`).

Não há mais arquivo de config estático (`navPages.ts`) nem hook derivado (`useNavPages`). Toda navegação reflete o banco em tempo real.

## Regras de detecção de ativo (`isActive`)
- `/` só ativa se o pathname for exatamente `/`.
- Match exato ativa.
- Subrotas (`/outlet/promos`) ativam a rota base (`/outlet`).
- Evita falso positivo (`/outlet-vip` não ativa `/outlet`).

## Acessibilidade
- `aria-current="page"` aplicado para item ativo (desktop e mobile).
- Estrutura semântica: `<nav><ul><li><Link />` no desktop.

## Testes
- Teste de `isActive` em `__tests__/navigation/isActive.test.ts` (Vitest).
