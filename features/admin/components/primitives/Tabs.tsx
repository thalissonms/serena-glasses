"use client";
/**
 * Component: Tabs — abas navegáveis com underline animado pink via Radix UI.
 *
 * Tab list com fundo chrome; trigger inativo em white/30, ativo em branco.
 * Underline pink com scale-x transition. Content sem padding (deixar ao consumidor).
 *
 * Usado em: páginas de detalhe, formulários multi-step e filtros do /admin.
 */
import * as RadixTabs from "@radix-ui/react-tabs";
import { type ReactNode } from "react";

export interface TabItem {
  value: string;
  label: string;
  content: ReactNode;
}

interface Props {
  tabs: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function Tabs({ tabs, defaultValue, value, onValueChange, className }: Props) {
  return (
    <RadixTabs.Root
      defaultValue={defaultValue ?? tabs[0]?.value}
      value={value}
      onValueChange={onValueChange}
      className={className}
    >
      <RadixTabs.List className="flex border-b border-white/8 bg-[#0a0a0a]">
        {tabs.map((tab) => (
          <RadixTabs.Trigger
            key={tab.value}
            value={tab.value}
            className={[
              "relative px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em]",
              "text-white/30 hover:text-white/60 transition-colors duration-150",
              "data-[state=active]:text-white",
              "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px]",
              "after:bg-brand-pink after:transition-transform after:duration-200 after:origin-left",
              "after:scale-x-0 data-[state=active]:after:scale-x-100",
              "outline-none focus-visible:ring-1 focus-visible:ring-[var(--brand-pink)]/50",
            ].join(" ")}
          >
            {tab.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {tabs.map((tab) => (
        <RadixTabs.Content key={tab.value} value={tab.value} className="pt-5 outline-none">
          {tab.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  );
}
