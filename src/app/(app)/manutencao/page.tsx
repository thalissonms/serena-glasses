import { getSetting } from "@features/admin/services/siteSettings.service";
import Logo from "@shared/components/layout/Logos/Logo";

export const dynamic = "force-dynamic";

export default async function ManutencaoPage() {
  const cfg = await getSetting("maintenance").catch(() => null);

  const message = cfg?.message_pt ?? "Estamos em manutenção. Voltamos em breve!";
  const expectedReturn = cfg?.expected_return
    ? new Date(cfg.expected_return).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="min-h-screen bg-brand-pink-light dark:bg-brand-pink-bg-dark flex flex-col items-center justify-center gap-8 px-6 text-center">
      <Logo className="w-48 text-brand-pink" />

      <div className="flex flex-col gap-4 max-w-md">
        <h1 className="font-shrikhand text-4xl text-brand-pink drop-shadow-[2px_2px_0_#000]">
          Em Manutenção
        </h1>
        <p className="font-poppins text-lg text-foreground/80">{message}</p>

        {expectedReturn && (
          <p className="font-inter text-sm text-foreground/60">
            Previsão de retorno: <strong>{expectedReturn}</strong>
          </p>
        )}
      </div>

      <div className="w-32 h-1 bg-brand-pink opacity-60" />
    </div>
  );
}
