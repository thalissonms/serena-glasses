"use client";

import React from "react";
import { Shield, Star, Truck, Instagram, Facebook } from "lucide-react";
import Link from "next/link"; 
import { siteConfig } from "@shared/config"; 

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10 md:gap-y-0 md:gap-x-8 text-center border-b border-gray-700 pb-10 mb-10">
          {[
            {
              icon: <Truck className="w-7 h-7 text-white" />,
              title: "FRETE GRÁTIS",
              desc: "Em compras acima de R$ 199,00 para todo o Brasil",
            },
            {
              icon: <Shield className="w-7 h-7 text-white" />,
              title: "PROTEÇÃO UV400",
              desc: "Máxima proteção contra raios ultravioleta em todos os modelos",
            },
            {
              icon: <Star className="w-7 h-7 text-white" />,
              title: "QUALIDADE PREMIUM",
              desc: "Materiais de alta qualidade e design exclusivo",
            },
          ].map(({ icon, title, desc }, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-primary rounded-full shadow-neon">
                  {icon}
                </div>
              </div>
              <h3 className="text-lg font-bold mb-1 tracking-wide">{title}</h3>
              <p className="text-sm text-gray-400 max-w-xs">{desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm text-gray-300">
          <div>
            <h4 className="text-white font-semibold mb-4 text-base">
              Sobre a {siteConfig.siteName}
            </h4>
            <p className="leading-relaxed">{siteConfig.siteDescription}</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-base">
              Mapa do Site
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link
                  href="/produtos"
                  className="hover:text-primary transition-colors"
                >
                  Produtos
                </Link>
              </li>
              <li>
                <Link
                  href="/sobre"
                  className="hover:text-primary transition-colors"
                >
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link
                  href="/contato"
                  className="hover:text-primary transition-colors"
                >
                  Contato
                </Link>
              </li>
              <li>
                <Link
                  href="/politica-de-privacidade"
                  className="hover:text-primary transition-colors"
                >
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-base">
              Siga-nos
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href={siteConfig.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Instagram size={18} /> Instagram
                </Link>
              </li>
              <li>
                <Link
                  href={siteConfig.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Facebook size={18} /> Facebook
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-base">
              Créditos
            </h4>
            <p className="leading-relaxed">
              © {currentYear} {siteConfig.siteName}
            </p>
            <p className="mt-2 leading-relaxed">
              Desenvolvido por{" "}
              <span className="text-primary">{siteConfig.author}</span>
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-8 text-center text-sm text-gray-500">
          <p>Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
