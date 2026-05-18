/**
 * Component: LowStockAlerts — lista de variantes com estoque crítico (< 5 unidades).
 *
 * Cada item linka para a página de edição do produto. Estoque zero exibe cor vermelha;
 * estoque baixo exibe amarelo. Número em font-jocham com neon glow.
 *
 * Usado em: src/app/admin-v2/page.tsx.
 */
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import type { LowStockItem } from "@features/admin-v2/services/dashboard.service";

interface Props {
  items: LowStockItem[];
}

export function LowStockAlerts({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-2">
        <div
          className="w-2 h-2 rounded-full bg-[#00EE88]"
          style={{ boxShadow: "0 0 8px #00EE88" }}
          aria-hidden="true"
        />
        <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-white/20">
          Estoque saudável
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {items.map((item) => {
        const isOut = item.stock_quantity === 0;
        const accent = isOut ? "#FF3355" : "#FFD700";
        return (
          <Link
            key={item.id}
            href={`/admin-v2/products/${item.product_id}`}
            className="flex items-center gap-3 py-2.5 border-b border-white/4 last:border-0 hover:bg-white/2 transition-colors group"
          >
            <AlertTriangle
              size={10}
              style={{
                color: accent,
                flexShrink: 0,
                filter: `drop-shadow(0 0 3px ${accent})`,
              }}
              aria-hidden="true"
            />
            <div className="flex-1 min-w-0">
              <p className="font-poppins text-[11px] text-white/60 truncate group-hover:text-white/80 transition-colors">
                {item.product_name}
              </p>
              <p className="font-mono text-[8px] text-white/25 truncate mt-0.5">
                {item.color_name}
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span
                className="font-jocham text-[18px] leading-none"
                style={{
                  color: accent,
                  textShadow: `0 0 10px ${accent}`,
                }}
              >
                {item.stock_quantity}
              </span>
              <span className="font-mono text-[7px] text-white/20 uppercase tracking-wider">
                un
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
