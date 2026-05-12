"use client";

import PageInterceptTransition from "@features/navigation/components/mobile/modals/PageInterceptTransition";
    import { useRouter } from "next/navigation";

export default function ProductModalPage() {
  const router = useRouter();

  return (
    <PageInterceptTransition>
      <section className="w-screen h-screen fixed bg-red-500 inset-0">
        <button onClick={() => router.back()}>Fechar</button>

        <h1>MODAL INTERCEPTADO</h1>

        <p>Isso deslizou por cima da home.</p>
      </section>
    </PageInterceptTransition>
  );
}
