# Shared

Código reutilizável cross-feature. Tudo que é usado por 2+ features ou tem responsabilidade global vive aqui.

## Estrutura

| Diretório | Propósito | Destaques |
|---|---|---|
| `components/` | Componentes UI cross-feature | Forms (inputs), Layout (Nav, Footer, Logos, SVGs, TopBanner), Skeletons, UI primitivos (Button, Badge, Pills, PageTitle, SerenaLoader) |
| `config/` | Configuração global | `siteConfig.ts` — metadados do site, URLs base |
| `hooks/` | Hooks utilitários | `useIsDesktop`, `useMounted`, `useSiteSettings` |
| `lib/` | Integrações externas | Supabase (3 clients), Mercado Pago, Melhor Envio, auth helpers, rate limiting, ViaCEP, y2kToast |
| `location/` | Enums de localização | `location.enum.ts` — estados BR |
| `providers/` | React Context Providers | `QueryProvider` (React Query), `ThemeProvider` (dark mode) |
| `utils/` | Funções puras cross-feature | `formatPrice`, `effectiveInstallments`, `shuffle`, `pickLocale`, `anonymousId`, `validators`, `validateUpload`, `slugifyCity` |

## Clientes Supabase

| Cliente | Arquivo | Uso |
|---|---|---|
| `supabaseServer` | `lib/supabase/server.ts` | Service/API admin — bypass RLS (service\_role) |
| `createSupabaseServerAuthClient()` | `lib/supabase/server-auth.ts` | Server Component que precisa do user |
| `supabase` | `lib/supabase/client.ts` | Client Component (raríssimo — preferir API route) |

## Auth Helpers

| Helper | Contexto | Comportamento |
|---|---|---|
| `withAdmin(handler)` | API route handler | 401 automático se não-admin |
| `requireAdmin()` | Server Component | Redirect para `/admin/login` |

## Quando algo vai para `shared/`

- Usado por **2+ features**
- Responsabilidade global (providers, config, auth)
- Componente UI primitivo (Button, Badge, Input)
- Integração com serviço externo (Supabase, MP, ME)
