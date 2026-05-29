# Internacionalização (i18n)

3 idiomas suportados: **pt-BR** (padrão), **en-US**, **es-ES**. Baseado em `i18next` + `react-i18next`.

## Estrutura

```
i18n/
├── i18n.ts                Config do i18next (namespaces, fallback)
├── i18nProvider.tsx       Provider React
└── locales/
    ├── pt-BR/            Traduções em português
    ├── en-US/            Traduções em inglês
    ├── es-ES/            Traduções em espanhol
    └── index.ts          Re-export dos namespaces
```

## Dois tipos de tradução

| Tipo | Localização | Quando usar |
|------|-------------|-------------|
| Global | `i18n/locales/{locale}/{namespace}.json` | Conteúdo cross-feature (cart, checkout, footer, general, home, navigation, order, products, search, wishlist) |
| Feature-scoped | `features/<feature>/translations/{locale}.json` | Conteúdo exclusivo de 1 feature |

## Como usar

```tsx
"use client";
import { useTranslation } from "react-i18next";

const { t } = useTranslation("namespace");
return <h1>{t("page.title")}</h1>;
```

## Conteúdo dinâmico do banco

Categorias, banners e outros conteúdos do DB usam colunas localizadas: `name_pt`, `name_en`, `name_es`. O front seleciona via `pickLocale(entity, lang)` (`shared/utils/pickLocale.ts`).

## Regras

- Adicionar keys nos **3 idiomas** ao mesmo tempo. Nunca commitar com idioma faltando.
- Keys em `camelCase`: `t("page.colorLabel")` não `t("page.color_label")`.
- Máximo 3 níveis de aninhamento.
- Ver detalhes em `AGENT/CODE_STANDARDS.md` §15.
