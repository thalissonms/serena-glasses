"use client";
import { Search, PackageSearch } from "lucide-react";

interface OrderTrackFormProps {
  defaultOrder?: string;
  defaultEmail?: string;
  notFound?: boolean;
}

export default function OrderTrackForm({
  defaultOrder,
  defaultEmail,
  notFound,
}: OrderTrackFormProps) {
  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-brand-pink transform rotate-3 border-2 border-black shadow-[4px_4px_0_#000]" />
          <div className="relative w-14 h-14 bg-white dark:bg-[#1a1a1a] border-2 border-black flex items-center justify-center transform -rotate-1">
            <PackageSearch size={26} className="text-brand-pink" />
          </div>
        </div>
        <div>
          <h1 className="font-poppins font-black text-2xl uppercase tracking-wide leading-none">
            Acompanhar Pedido
          </h1>
          <p className="font-inter text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Informe o número do pedido e seu e-mail
          </p>
        </div>
      </div>

      <form action="/order/track" method="get" className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="font-poppins text-xs font-bold uppercase tracking-wider text-black dark:text-white">
            Número do pedido
          </label>
          <input
            name="order"
            defaultValue={defaultOrder}
            placeholder="SRN-XXXXXXXX"
            autoComplete="off"
            className="w-full border-2 border-black dark:border-brand-pink bg-white dark:bg-[#1a1a1a] dark:text-white px-4 py-3 font-poppins text-sm font-semibold uppercase tracking-widest placeholder:normal-case placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:border-brand-pink focus:shadow-[3px_3px_0_#FF00B6] transition-shadow"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-poppins text-xs font-bold uppercase tracking-wider text-black dark:text-white">
            E-mail do pedido
          </label>
          <input
            name="email"
            type="email"
            defaultValue={defaultEmail}
            placeholder="seu@email.com"
            className="w-full border-2 border-black dark:border-brand-pink bg-white dark:bg-[#1a1a1a] dark:text-white px-4 py-3 font-inter text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:border-brand-pink focus:shadow-[3px_3px_0_#FF00B6] transition-shadow"
          />
        </div>

        {notFound && (
          <p className="font-poppins text-sm font-semibold text-red-600 dark:text-red-400 border-2 border-red-400 dark:border-red-700 bg-red-50 dark:bg-red-950/30 px-4 py-3">
            Pedido não encontrado. Verifique o número e o e-mail informados.
          </p>
        )}

        <button
          type="submit"
          className="flex items-center justify-center gap-2 w-full py-4 mt-1 font-poppins text-sm font-black uppercase tracking-widest border-4 border-black dark:border-brand-pink bg-brand-pink text-white shadow-[6px_6px_0_#000] hover:translate-y-0.5 hover:shadow-[4px_4px_0_#000] transition-all"
        >
          <Search size={14} />
          Buscar pedido
        </button>
      </form>
    </div>
  );
}
