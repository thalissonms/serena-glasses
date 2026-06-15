/**
 * Page: /admin/settings — 6 painéis de configuração do site + Melhor Envio health.
 *
 * Carrega todos os settings via getAllSettings() e passa ao SettingsClient.
 * O SettingsClient exibe accordion com os painéis: free_shipping, maintenance,
 * pixels, whatsapp, popup_capture, installments_bulk.
 *
 * Usado em: Sidebar → Operations → Configurações.
 */
import { requireAdmin } from "@shared/lib/auth/admin";
import { getAllSettings } from "@features/admin/services/siteSettings.service";
import SettingsClient from "@features/admin/components/settings/SettingsClient";

export default async function SettingsPage() {
  await requireAdmin("/admin/login");
  const settings = await getAllSettings();

  return (
    <div className="p-8">
      <SettingsClient settings={settings} />
    </div>
  );
}
