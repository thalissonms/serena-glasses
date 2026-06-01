"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check, QrCode, Loader2 } from "lucide-react";
import Link from "next/link";

interface PixPaymentScreenProps {
  orderNumber: string;
  orderId: string;
  qrCodeBase64: string;
  pixCopyPaste: string;
  totalBRL: string;
}

export function PixPaymentScreen({ orderNumber, orderId, qrCodeBase64, pixCopyPaste, totalBRL }: PixPaymentScreenProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "checking">("pending");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  async function handleCopy() {
    await navigator.clipboard.writeText(pixCopyPaste);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2500);
  }

  useEffect(() => {
    // Polling a cada 5s enquanto status = pending
    async function pollStatus() {
      setPaymentStatus("checking");
      try {
        const res = await fetch(`/api/orders/${orderId}/status`);
        if (res.ok) {
          const { status } = await res.json();
          if (status === "paid") {
            router.push(`/checkout/success?order=${orderNumber}`);
            return;
          }
        }
      } catch {
        // silencioso — continua tentando
      }
      setPaymentStatus("pending");
      pollRef.current = setTimeout(pollStatus, 5000);
    }

    pollRef.current = setTimeout(pollStatus, 5000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (pollRef.current) clearTimeout(pollRef.current);
    };
  }, [orderId, orderNumber, router]);

  return (
    <div className="flex flex-col items-center gap-6 py-8 px-4 max-w-md mx-auto">
      <div className="w-full bg-white dark:bg-[#1a1a1a] border-4 border-black dark:border-brand-pink shadow-[8px_8px_0_#FF00B6] p-8 flex flex-col items-center gap-6">

        <div className="flex items-center gap-3 w-full">
          <div className="w-3 h-8 bg-brand-pink shrink-0" />
          <h2 className="font-poppins font-black text-xl uppercase tracking-wide">
            Pague via PIX
          </h2>
          {paymentStatus === "checking" && (
            <Loader2 size={14} className="animate-spin text-brand-pink ml-auto" />
          )}
        </div>

        <div className="text-center">
          <p className="font-inter text-sm text-gray-600 dark:text-gray-400 mb-1">
            Pedido <span className="font-black text-black dark:text-white">#{orderNumber}</span>
          </p>
          <p className="font-poppins font-black text-2xl text-brand-pink">{totalBRL}</p>
        </div>

        {/* QR Code */}
        {qrCodeBase64 ? (
          <div className="border-4 border-black dark:border-brand-pink shadow-[4px_4px_0_#FF00B6] p-3 bg-white">
            <img
              src={`data:image/png;base64,${qrCodeBase64}`}
              alt="QR Code PIX"
              width={200}
              height={200}
              className="block"
            />
          </div>
        ) : (
          <div className="w-[200px] h-[200px] border-4 border-black dark:border-brand-pink flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a]">
            <QrCode size={80} className="text-gray-300 dark:text-gray-600" />
          </div>
        )}

        {/* Pix Copia e Cola */}
        <div className="w-full">
          <p className="font-poppins font-bold text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
            Pix Copia e Cola
          </p>
          <div className="flex gap-2">
            <div className="flex-1 border-2 border-black dark:border-brand-pink bg-gray-50 dark:bg-[#0a0a0a] px-3 py-2 font-mono text-xs text-gray-700 dark:text-gray-300 truncate">
              {pixCopyPaste.slice(0, 40)}...
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 border-2 border-black dark:border-brand-pink bg-brand-pink text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-[3px_3px_0_#000] hover:translate-y-0.5 hover:shadow-[1px_1px_0_#000] transition-all cursor-pointer shrink-0"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copiado!" : "Copiar"}
            </button>
          </div>
        </div>

        <div className="w-full border-l-4 border-brand-pink pl-4">
          <p className="font-inter text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            O código PIX expira em <strong className="text-black dark:text-white">30 minutos</strong>.
            Após o pagamento, você será redirecionado automaticamente.
          </p>
        </div>

        <Link
          href="/"
          className="w-full text-center py-3 font-poppins font-black text-xs uppercase tracking-widest border-2 border-black dark:border-brand-pink text-black dark:text-white hover:bg-pink-50 dark:hover:bg-[#252525] transition-colors"
        >
          Continuar comprando
        </Link>
      </div>
    </div>
  );
}
