/**
 * Component: Table — tabela de dados com estilo Cyber HUD.
 *
 * Cabeçalho oscuro com borders sutis. Linhas hoverables com neon sutil.
 * Sort via callback externo.
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
    <div className={clsx("w-full overflow-x-auto border border-brand-pink/20 bg-[#050505] shadow-[inset_0_0_20px_rgba(255,0,182,0.02)]", className)}>
      <table className="w-full text-left text-base text-white border-collapse whitespace-nowrap">
        <thead className="bg-[#000000] border-b border-brand-pink/20">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={col.sortable && onSort ? () => onSort(col.key) : undefined}
                className={clsx(
                  "px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-brand-pink/60 font-normal select-none",
                  col.align === "center" && "text-center",
                  col.align === "right" && "text-right",
                  col.sortable && "cursor-pointer hover:text-brand-pink transition-colors",
                )}
              >
                <span className={clsx("inline-flex items-center gap-1", col.align === "center" && "justify-center", col.align === "right" && "justify-end")}>
                  // {col.label}
                  {col.sortable &&
                    (sort?.key === col.key ? (
                      sort.direction === "asc" ? (
                        <ChevronUp size={12} className="text-brand-pink" />
                      ) : (
                        <ChevronDown size={12} className="text-brand-pink" />
                      )
                    ) : (
                      <ChevronsUpDown size={12} className="text-brand-pink/20" />
                    ))}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center bg-[#0a0a0a]">
                <span className="font-mono text-[11px] uppercase tracking-widest text-brand-pink animate-pulse">
                  PROCESSANDO DADOS...
                </span>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center bg-[#0a0a0a]">
                <span className="font-mono text-[11px] uppercase tracking-widest text-white/20">
                  [ {emptyMessage} ]
                </span>
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={keyExtractor(row, i)}
                className={clsx(
                  "bg-[#0a0a0a] transition-colors group",
                  "hover:bg-brand-pink/5 hover:shadow-[inset_0_0_10px_rgba(255,0,182,0.05)]",
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={clsx(
                      "px-4 py-3 font-mono text-[13px] text-white/55 group-hover:text-white/80 transition-colors",
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
