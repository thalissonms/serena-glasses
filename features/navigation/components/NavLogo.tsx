import Image from "next/image";
import Link from "next/link";
import { Glasses, Sparkles } from "lucide-react";

export const NavLogo = () => {
  return (
    <div className="flex items-center">
      <div className="relative">
        <div className="absolute inset-0 bg-brand-pink-light transform rotate-2 border-3 border-black shadow-[6px_6px_0px_#000]"></div>
        <div className="relative px-4 py-3 border-3 border-black transform -rotate-2 flex items-center gap-3">
          <Link href="/" className="flex items-center group">
            <Image
              src="/logos/sublogo-dark.png"
              alt="Serena Sunglasses Logo"
              width={38.1}
              height={40}
              className="h-8"
            />
          </Link>
        </div>
        <div className="absolute -top-2 -right-2 text-white">
          <Sparkles size={16} fill="currentColor" className="animate-pulse" />
        </div>
        <div className="absolute -bottom-1 -left-1 text-white">
          <Glasses size={12} fill="currentColor" className="animate-pulse" />
        </div>
      </div>
    </div>
  );
};
