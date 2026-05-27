/**
 * Component: Table — tabela de dados chrome com hover neon e sort indicators.
 *
 * Cabeçalho com chrome bevel. Linhas alternadas dark/darker. Hover row com glow pink.
 * Sort via callback externo; indicator ativo em pink. Colunas tipadas com render opcional.
 *
 * Usado em: listagens de pedidos, produtos, cupons e demais tabelas do /admin.
 */
import { type ReactNode } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { clsx } from "clsx";

export interface TableColumn<T> {
  key: string;
  label: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  render?: (row: T, index: number) => ReactNode;
}

export interface SortState {
  key: string;
  direction: "asc" | "desc";
}

interface Props<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string;
  sort?: SortState;
  onSort?: (key: string) => void;
  emptyMessage?: string;
  loading?: boolean;
  className?: string;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  sort,
  onSort,
  emptyMessage = "Nenhum resultado",
  loading,
  className,
}: Props<T>) {
  return (
    <div className={clsx("w-full overflow-x-auto border border-white/5", className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#1a1a1a] shadow-[inset_1px_1px_0_rgba(255,255,255,0.05),inset_-1px_-1px_0_rgba(0,0,0,0.3)]">
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={col.sortable && onSort ? () => onSort(col.key) : undefined}
                className={clsx(
                  "px-4 py-3 font-mono text-[8px] uppercase tracking-[0.25em] text-white/25 font-normal",
                  "border-b border-white/5 select-none",
                  col.align === "center" && "text-center",
                  col.align === "right" && "text-right",
                  col.sortable && "cursor-pointer hover:text-white/50 transition-colors",
                )}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {col.sortable &&
                    (sort?.key === col.key ? (
                      sort.direction === "asc" ? (
                        <ChevronUp size={9} className="text-[#FF00B6]" />
                      ) : (
                        <ChevronDown size={9} className="text-[#FF00B6]" />
                      )
                    ) : (
                      <ChevronsUpDown size={9} className="text-white/15" />
                    ))}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#00F0FF] animate-neon-pulse">
                  Carregando dados...
                </span>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center">
                <span className="font-mono text-[9px] uppercase tracking-widest text-white/20">
                  {emptyMessage}
                </span>
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={keyExtractor(row, i)}
                className={clsx(
                  "border-b border-white/3 transition-colors group",
                  i % 2 === 0 ? "bg-[#141414]" : "bg-[#111111]",
                  "hover:bg-[#FF00B6]/4",
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={clsx(
                      "px-4 py-3 font-mono text-[11px] text-white/55 group-hover:text-white/80 transition-colors",
                      col.align === "center" && "text-center",
                      col.align === "right" && "text-right",
                    )}
                  >
                    {col.render
                      ? col.render(row, i)
                      : String((row as Record<string, unknown>)[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
