"use client";
import {
  Glasses,
  Heart,
  Menu,
  Search,
  ShoppingCart,
  Sparkles,
  Star,
  Sun,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { NavLogo } from "./NavLogo";
import { NavPages } from "./NavPages";
import { MobileNav } from "./MobileNav";

export const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-brand-pink py-4 px-14 border-b-3 border-black shadow-[6px_6px_0px_#000] sticky top-0 z-50">
      <div className="w-full mx-auto">
        <div className="flex items-center justify-between">
          <NavLogo />
          <NavPages />
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-[#FEB6DE] transform rotate-2 border-2 border-black shadow-[4px_4px_0px_#000]"></div>
              <div className="relative flex items-center bg-white border-2 border-black transform -rotate-2">
                <Search className="ml-3 text-[#FF00B6]" size={18} />
                <input
                  type="text"
                  placeholder="BUSCAR ÓCULOS..."
                  className="w-32 md:w-48 px-2 py-2 font-inter uppercase text-xs text-black placeholder-gray-500 bg-transparent outline-none"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-[#FF00B6] transform rotate-2 group-hover:rotate-3 transition-transform duration-300 border-2 border-black shadow-[4px_4px_0px_#000] group-hover:shadow-[6px_6px_0px_#000]"></div>
                <div className="relative w-12 h-12 bg-white border-2 border-black flex items-center justify-center transform -rotate-2 group-hover:rotate-0 transition-transform duration-300">
                  <ShoppingCart size={20} className="text-black group-hover:text-[#FF00B6]" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#FF00B6] border-2 border-white rounded-full flex items-center justify-center shadow-[2px_2px_0px_#000]">
                    <span className="text-xs font-inter text-white">3</span>
                  </div>
                </div>
              </div>
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-[#FF00B6] transform rotate-2 group-hover:rotate-3 transition-transform duration-300 border-2 border-black shadow-[4px_4px_0px_#000] group-hover:shadow-[6px_6px_0px_#000]"></div>
                <div className="relative w-12 h-12 bg-white border-2 border-black flex items-center justify-center transform -rotate-2 group-hover:rotate-0 transition-transform duration-300">
                  <User size={20} className="text-black group-hover:text-[#FF00B6]" />
                </div>
              </div>
            </div>
            <button className="lg:hidden relative" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <div className="absolute inset-0 bg-[#FEB6DE] transform rotate-2 border-2 border-black shadow-[3px_3px_0px_#000]"></div>
              <div className="relative w-10 h-10 bg-white border-2 border-black flex items-center justify-center transform -rotate-2">
                {isMenuOpen ? <X size={20} className="text-[#FF00B6]" /> : <Menu size={20} className="text-[#FF00B6]" />}
              </div>
            </button>
          </div>
        </div>
        {isMenuOpen && <MobileNav />}
      </div>
    </div>
  );
};
