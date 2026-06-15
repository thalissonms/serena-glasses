# Features

Arquitetura feature-based: cada feature é uma fatia de domínio autocontida com seus próprios componentes, hooks, services, tipos, etc.

## Mapa de features

| Feature | Descrição | Subdirs |
|---|---|---|
| `admin/` | Painel administrativo: CRUD de produtos, pedidos, categorias, cupons, stories, banners, settings | 9 |
| `cart/` | Carrinho de compras com persistência via Zustand | 4 |
| `categories/` | Hooks e tipos para categorias DB-driven | 2 |
| `checkout/` | Fluxo de checkout completo: formulário, pagamento (PIX/boleto/cartão), retry, validação | 8 |
| `coupons/` | Sistema de cupons: validação server-side, tipos e constantes | 3 |
| `emails/` | Templates transacionais (Resend): confirmação, envio, entrega, review request | 2 |
| `home/` | Página inicial: stories, showcase, polaroid carousel, new arrivals | 6 |
| `navigation/` | Navegação desktop + mobile DB-driven | 8 |
| `orders/` | Rastreio de pedidos e detalhes | 1 |
| `products/` | Catálogo de produtos: listagem, filtros, página de produto, variantes | 8 |
| `reviews/` | Formulário público de avaliação via token | 1 |
| `search/` | Busca full-text com facets, filtros e modal mobile | 4 |
| `wishlist/` | Lista de desejos com anonymous_id ou usuário logado | 3 |

## Estrutura padrão de uma feature

```
features/<feature>/
├── components/        Componentes React (desktop + mobile/)
│   └── mobile/        Variantes mobile-only
├── hooks/             Custom hooks (useX.ts)
├── services/          Data fetching server-side (xxx.service.ts)
├── store/             Zustand stores (xxx.store.ts)
├── schemas/           Schemas Zod (xxx.schema.ts)
├── types/             Tipos e interfaces (xxx.types.ts)
├── consts/            Constantes (xxx.const.ts)
├── config/            Config estática derivada
├── translations/      i18n feature-scoped (pt-BR.json, en-US.json, es-ES.json)
├── utils/             Funções puras (sem side-effects)
├── mappers/           Mappers DB → domain
├── enums/             Enums e unions
├── mock/              Dados de mock para dev
└── __tests__/         Testes Vitest
```

> Cada subpasta é criada somente quando há conteúdo.

## Regras de dependência

- **Dentro da mesma feature:** path relativo (`../consts/orders.const`)
- **Cruzando features:** sempre alias `@features/<feature>/...`
- **Utils puros** de outra feature: OK importar cross-feature
- **Componentes client** de outra feature: NÃO importar — mover para `shared/components/`

## Testes

Features com `__tests__/`: **admin**, **home**, **navigation**, **products**. Stack: Vitest + Testing Library.
