import { y2kToast } from "@shared/lib/y2kToast";

export async function smartShare(url: string, title?: string) {
  const fullUrl = typeof window !== "undefined" && url.startsWith("/") 
    ? `${window.location.origin}${url}` 
    : url;

  if (navigator.share) {
    try {
      await navigator.share({ title: title || "Serena Glasses", url: fullUrl });
      return;
    } catch (e) {
      // Aborted or failed. Only fallback if it's not a user abort.
      // Often, a user abort is an AbortError DOMException.
      if (e instanceof Error && e.name === "AbortError") {
        return;
      }
    }
  }

  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(fullUrl);
      y2kToast.success("Link copiado para a área de transferência!");
    } catch {
      y2kToast.error("Não foi possível copiar o link.");
    }
  } else {
    y2kToast.error("Não foi possível copiar o link.");
  }
}
