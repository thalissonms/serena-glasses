export type Y2KToastType = "error" | "success";

export type Y2KToastItem = {
  id: string;
  type: Y2KToastType;
  message: string;
};

type Listener = (item: Y2KToastItem) => void;
const listeners = new Set<Listener>();

function emit(item: Y2KToastItem) {
  listeners.forEach((fn) => fn(item));
}

export const y2kToast = {
  error(message: string) {
    emit({ id: crypto.randomUUID(), type: "error", message });
  },
  success(message: string) {
    emit({ id: crypto.randomUUID(), type: "success", message });
  },
  _subscribe(fn: Listener): () => void {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};
