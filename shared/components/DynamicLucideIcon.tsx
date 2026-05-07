"use client";
import { lazy, Suspense, type ComponentType } from "react";
import { HelpCircle, type LucideProps } from "lucide-react";
import { ALLOWED_CATEGORY_ICONS } from "@features/admin/consts/categoryIcons";

interface Props extends LucideProps {
  name: string;
}

const cache = new Map<string, ComponentType<LucideProps>>();

function getIcon(name: string): ComponentType<LucideProps> {
  if (cache.has(name)) return cache.get(name)!;
  const Comp = lazy(async () => {
    const mod = await import("lucide-react");
    const Icon = (mod as Record<string, unknown>)[name] as ComponentType<LucideProps> | undefined;
    return { default: Icon ?? HelpCircle };
  });
  cache.set(name, Comp);
  return Comp;
}

export function DynamicLucideIcon({ name, ...props }: Props) {
  if (!ALLOWED_CATEGORY_ICONS.includes(name as never)) {
    return <HelpCircle {...props} />;
  }
  const Icon = getIcon(name);
  const placeholder = (
    <span
      style={{ display: "inline-block", width: props.size ?? 24, height: props.size ?? 24 }}
    />
  );
  return (
    <Suspense fallback={placeholder}>
      <Icon {...props} />
    </Suspense>
  );
}
