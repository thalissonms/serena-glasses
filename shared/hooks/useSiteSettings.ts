"use client";
import { useQuery } from "@tanstack/react-query";
import { SETTING_SCHEMAS, type SettingKey, type SettingValue } from "@features/admin/schemas/siteSettings.schema";

export function useSiteSetting<K extends SettingKey>(key: K) {
  return useQuery<SettingValue<K>>({
    queryKey: ["site-settings", key],
    queryFn: async () => {
      const res = await fetch(`/api/site-settings/${key}`);
      if (!res.ok) throw new Error("Failed to fetch setting");
      const json = await res.json();
      return json.value as SettingValue<K>;
    },
    staleTime: 5 * 60_000,
  });
}

export function useAllSiteSettings() {
  return useQuery<Record<string, unknown>>({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const res = await fetch("/api/site-settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      const json = await res.json();
      return json.settings as Record<string, unknown>;
    },
    staleTime: 5 * 60_000,
  });
}

export { SETTING_SCHEMAS };
