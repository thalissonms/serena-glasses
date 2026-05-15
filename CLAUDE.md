# Serena Glasses — Claude Code Guide

## Code Organization

### Next.js Proxy (Middleware)

Next.js deprecated `middleware.ts` in favor of `proxy.ts`. **Never create `src/middleware.ts`.**

- All request interception lives in **`src/proxy.ts`** (exported function must be named `proxy`)
- `src/middleware.ts` will conflict with `src/proxy.ts` and crash the dev server
- Add new rate-limited routes to `proxy.ts` → `config.matcher` array AND the `if/else if` limiter block

### Rate Limiting

Rate limiters are defined in `shared/lib/ratelimit.ts` and imported into `src/proxy.ts`.
Add a new limiter there when creating a new public API endpoint that needs protection.

### Project Structure

```
features/          # Feature-scoped components, hooks, services, types
shared/            # Cross-feature utilities, lib integrations, UI primitives
src/app/           # Next.js App Router pages and API routes
src/proxy.ts       # Single entry point for all request interception (auth + rate limiting)
AGENT/             # Implementation plans and dev notes
```

### Parcelamento

`products.max_installments` (1–12, default 1) por produto + `site_settings.installments_bulk` (threshold global: acima de N centavos libera M parcelas, sobrescreve o produto pra cima). Cálculo centralizado em `shared/utils/effectiveInstallments.ts`. Validação server-side em `/api/checkout` (criação e retry). UI esconde o select de parcelas quando teto efetivo = 1.
