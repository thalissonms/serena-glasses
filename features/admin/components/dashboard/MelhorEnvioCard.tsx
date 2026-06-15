/**
 * Component: MelhorEnvioCard — status da integração Melhor Envio no dashboard.
 *
 * Exibe dot neon + email da conta quando conectado, ou indicador de falha.
 * Pure display: dados vêm do servidor (unstable_cache 5min) via props.
 *
 * Usado em: src/app/admin/page.tsx.
 */
import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface Props {
  connected: boolean;
  accountEmail: string | null;
}

export function MelhorEnvioCard({ connected, accountEmail }: Props) {
  const color = connected ? "#00EE88" : "#FF3355";

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 gap-8">
      <div className="flex items-center gap-3">
        <div
          className="w-2.5 h-2.5 rounded-none shrink-0"
          style={{
            background: color,
            border: `1px solid ${color}`,
            boxShadow: `inset 0 0 10px ${color}1a`,
          }}
          aria-label={connected ? "Conectado" : "Desconectado"}
        />
        <div>
          <p
            className="font-mono text-[12px] uppercase tracking-[0.25em]"
            style={{ color }}
          >
            {connected ? "Conectado" : "Desconectado"}
          </p>
          {connected && accountEmail && (
            <p className="font-mono text-[10px] text-white/25 mt-0.5">
              {accountEmail}
            </p>
          )}
          {!connected && (
            <p className="font-mono text-[10px] text-white/20 mt-0.5">
              Verifique as configurações de integração
            </p>
          )}
        </div>
      </div>

      <Link
        href="/admin/integrations/melhor-envio"
        className="flex items-center gap-1.5 font-mono text-[14px] uppercase tracking-wider text-white/80 hover:text-brand-pink transition-colors"
      >
        <ExternalLink size={20} />
        Config
      </Link>
    </div>
  );
}
