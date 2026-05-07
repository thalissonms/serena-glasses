import Link from "next/link";
import { Truck } from "lucide-react";

interface Props {
  connected: boolean;
  accountEmail: string | null;
}

export default function MelhorEnvioStatusCard({ connected, accountEmail }: Props) {
  return (
    <div className="bg-[#0f0f0f] border-2 border-white/10 p-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Truck size={20} className={connected ? "text-green-400" : "text-red-400"} />
        <div>
          <p className="font-poppins font-black text-sm text-white uppercase tracking-wide">
            Melhor Envio
          </p>
          {connected && accountEmail ? (
            <p className="font-inter text-xs text-gray-400 mt-0.5">{accountEmail}</p>
          ) : (
            <p className="font-inter text-xs text-red-400 mt-0.5">Não conectado</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`font-poppins font-black text-[10px] uppercase tracking-widest border px-2 py-1 ${
            connected
              ? "border-green-500/40 text-green-400"
              : "border-red-500/40 text-red-400"
          }`}
        >
          {connected ? "✓ Conectado" : "✗ Desconectado"}
        </span>
        {!connected && (
          <Link
            href="/api/admin/melhor-envio/oauth/start"
            className="font-poppins text-xs font-bold uppercase tracking-wider border-2 border-brand-pink/40 text-brand-pink hover:border-brand-pink px-3 py-1.5 transition-colors"
          >
            Reconectar
          </Link>
        )}
      </div>
    </div>
  );
}
