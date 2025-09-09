"use client"
import { Menu, X, Search, User, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { href: "/", label: "HOME" },
    { href: "/oculos-solares", label: "ÓCULOS SOLARES" },
    { href: "/mini-drop", label: "MINI DROP 2.0" },
    { href: "/acessorios", label: "ACESSÓRIOS" },
    { href: "/outlet", label: "OUTLET" },
    { href: "/sobre", label: "SOBRE" },
  ];

  return (
    <>
      <header className="w-full bg-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-10">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Image
                  src="/logos/logo-black.png"
                  alt="Serena Sunglasses Logo"
                  width={100}
                  height={100}
                />
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative text-sm font-bold text-black hover:text-primary transition-colors duration-300 group tracking-wide"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-black hover:text-primary"
              >
                <Search className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-black hover:text-primary"
              >
                <User className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-black hover:text-primary relative"
              >
                <ShoppingBag className="h-8 w-8" />
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-black"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
          {isMobileMenuOpen && (
            <div className="lg:hidden bg-white border-t border-gray py-4">
              <nav className="flex flex-col gap-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-black hover:text-primary transition-colors duration-300 font-bold py-2 tracking-wide"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="flex gap-4 pt-4 border-t border-gray">
                  <Button variant="ghost" size="icon">
                    <Search className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingBag className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      0
                    </span>
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
