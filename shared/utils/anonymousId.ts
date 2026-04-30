export function getAnonymousId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("serena_anon_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("serena_anon_id", id);
  }
  return id;
}
