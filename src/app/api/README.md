# API Routes

REST API routes via Next.js App Router. Todas as rotas admin são protegidas por `withAdmin`. Rate limiting via Upstash (configurado em `src/proxy.ts`).

## Mapa de rotas

### Públicas

| Rota | Método(s) | Descrição |
|------|-----------|-----------|
| `/api/categories` | GET | Lista categorias ativas com subcategorias |
| `/api/checkout` | POST | Cria pedido + processa pagamento (PIX/boleto/cartão) + retry |
| `/api/checkout/coupon/validate` | POST | Preview de cupom (validação sem consumir) |
| `/api/checkout/shipping/quote` | POST | Cotação de frete via Melhor Envio |
| `/api/home` | GET | Dados da home (stories, banners) |
| `/api/orders` | GET | Rastreio por order_number + email |
| `/api/review/submit` | POST | Submissão de avaliação via token |
| `/api/search` | GET | Busca full-text com facets |
| `/api/site-banners` | GET | Banners ativos do topo |
| `/api/site-settings` | GET | Configurações públicas do site |
| `/api/wishlist` | GET/POST/DELETE | CRUD de favoritos (anonymous_id) |

### Admin (`/api/admin/*`) — todas protegidas por `withAdmin`

| Rota | Métodos | Descrição |
|------|---------|-----------|
| `/api/admin/categories` | GET/POST/PATCH | CRUD de categorias + reorder |
| `/api/admin/subcategories` | POST/PATCH/DELETE | CRUD de subcategorias |
| `/api/admin/coupons` | GET/POST/PATCH | CRUD de cupons |
| `/api/admin/home-stories` | GET/POST/PATCH/DELETE | Stories da home (upload de mídia) |
| `/api/admin/me` | GET | Dados do admin autenticado |
| `/api/admin/melhor-envio` | * | Integração Melhor Envio (OAuth, etiqueta, tracking) |
| `/api/admin/orders` | GET/PATCH | Gestão de pedidos (status, envio) |
| `/api/admin/products` | GET/POST/PATCH | CRUD de produtos |
| `/api/admin/reviews` | GET/PATCH/DELETE | Moderação de avaliações |
| `/api/admin/site-banners` | POST/PATCH/DELETE | Banners do topo |
| `/api/admin/site-settings` | PATCH | Configurações do site (Zod por chave) |
| `/api/admin/variants` | PATCH | Atualizar variantes (estoque, cor) |
| `/api/admin/test-email` | POST | Envio de email de teste |

### Webhooks

| Rota | Descrição |
|------|-----------|
| `/api/webhooks/mercadopago` | Notificações de pagamento MP → atualiza status do pedido |
| `/api/webhooks/melhor-envio` | Eventos de tracking ME → atualiza rastreio |

### Cron

| Rota | Descrição |
|------|-----------|
| `/api/cron` | Cancela pedidos expirados (PIX +30min, Boleto +2 dias) |

## Padrões

- **Auth admin:** `withAdmin(handler)` → 401 automático
- **Validação:** `safeParse` Zod → 400 com issues
- **JSON malformado:** `await req.json().catch(() => null)` → 400
- **Resposta:** sempre `NextResponse.json(...)`
- **Status codes:** 200 (ok) · 201 (criado) · 400 (validação) · 401 (auth) · 404 (não encontrado) · 409 (conflito) · 500 (erro)
- **Body fields:** snake_case (matching DB)
- **Rate limiting:** configurado em `src/proxy.ts`, limiters em `shared/lib/ratelimit.ts`
- **Detalhes:** [CODE_STANDARDS.md §10](../../../AGENT/CODE_STANDARDS.md)
