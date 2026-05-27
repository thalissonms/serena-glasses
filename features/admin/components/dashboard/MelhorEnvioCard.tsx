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
    <div className="flex items-center justify-between gap-8">
      <div className="flex items-center gap-3">
        <div
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{
            background: color,
            boxShadow: `0 0 8px ${color}, 0 0 16px ${color}44`,
          }}
          aria-label={connected ? "Conectado" : "Desconectado"}
        />
        <div>
          <p
            className="font-mono text-[10px] uppercase tracking-[0.25em]"
            style={{ color }}
          >
            {connected ? "Conectado" : "Desconectado"}
          </p>
          {connected && accountEmail && (
            <p className="font-mono text-[8px] text-white/25 mt-0.5">
              {accountEmail}
            </p>
          )}
          {!connected && (
            <p className="font-mono text-[8px] text-white/20 mt-0.5">
              Verifique as configurações de integração
            </p>
          )}
        </div>
      </div>

      <Link
        href="/admin/integrations/melhor-envio"
        className="flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wider text-white/80 hover:text-[#00F0FF] transition-colors"
      >
        <ExternalLink size={20} />
        Config
      </Link>
    </div>
  );
}
