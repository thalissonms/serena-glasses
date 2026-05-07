// export function getAnonymousId(): string {
//   if (typeof window === "undefined") return "";
//   let id = localStorage.getItem("serena_anon_id");
//   if (!id) {
//     id = crypto.randomUUID();
//     localStorage.setItem("serena_anon_id", id);
//   }
//   return id;
// }
export function getAnonymousId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("serena_anon_id");
  if (!id) {
    id =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem("serena_anon_id", id);
  }
  return id;
}
