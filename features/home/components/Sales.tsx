"use client";

import { Product } from "@features/products/types";
import ProductCardY2K from "@features/products/components/ProductCardY2K";

export default function Sales({ products }: { products: Product[] }) {

    return (
        <div className="mx-auto -mt-15 flex max-w-[calc(100%-14rem)] flex-col gap-15">
            <div className="flex flex-col items-center justify-center">
                <p className="font-poppins text-base font-semibold tracking-[0.3em] text-gray-500 uppercase dark:text-brand-pink-light">
                    PROMOÇÕES
                </p>
                <div className="flex items-center justify-center gap-2">
                    <div className="h-0.5 w-8 bg-brand-pink pt-px" />
                    <span className="text-2xl text-brand-pink sm:text-3xl">✦</span>
                    <div className="h-0.5 w-8 bg-brand-pink pt-px" />
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