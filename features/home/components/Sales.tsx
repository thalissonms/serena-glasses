"use client";

import Image from "next/image";
import { useTheme } from "@shared/providers/ThemeProvider";
import { Product } from "@features/products/types";
import ProductCardY2K from "@/features/products/components/ProductCardY2K";

export default function Sales({ products }: { products: Product[] }) {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = theme === "system" ? resolvedTheme : theme;

    return (
        <div className="max-w-[calc(100%-14rem)] flex flex-col gap-15 mx-auto -mt-15">

            <Image
                src={
                    currentTheme === "dark" ?
                        "/backgrounds/bg-sale-dark.png" :
                        "/backgrounds/bg-sale.png"
                }
                alt={"sale"}
                width={1920}
                height={1080}
                priority
                quality={100}
                role="img"
                className="drop-shadow-[4px_-4px_0px] drop-shadow-brand-purple dark:drop-shadow-brand-dark-surface-2"
            />
            <div className="flex flex-col items-center justify-center">
                <p className="font-poppins text-base uppercase tracking-[0.3em] text-gray-500 dark:text-brand-pink-light font-semibold">
                    PROMOÇÕES
                </p>
                <div className="flex items-center justify-center gap-2">
                    <div className="w-8 h-0.5 pt-px bg-brand-pink" />
                    <span className="text-brand-pink text-2xl sm:text-3xl">✦</span>
                    <div className="w-8 h-0.5 pt-px bg-brand-pink" />
                </div>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,400px))] justify-center gap-6">
                {products.map((product, i) => (
                    <ProductCardY2K key={product.id} product={product} index={i} />
                ))}
            </div>
        </div>
    )
}