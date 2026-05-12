import { useCartStore } from "@features/cart/store/cart.store";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Product } from "../../types";
import { useRouter } from "next/navigation";
import clsx from "clsx";

interface ProductActionsProps {
  product: Product;
  selectedColorIndex: number;
}

const ProductActionsMobile = ({
  product,
  selectedColorIndex,
}: ProductActionsProps) => {
  const { t } = useTranslation("products");
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  const uniqueColors = product.variants.filter(
    (v, i, arr) => arr.findIndex((x) => x.color.slug === v.color.slug) === i,
  );
  const activeVariant = uniqueColors[selectedColorIndex] ?? uniqueColors[0];
  const primaryImage =
    product.images.find((img) => img.isPrimary) ?? product.images[0];
  const image = activeVariant?.images[0] ?? primaryImage?.url ?? "";

  function handleAddToCart(add: boolean = true) {
    if (!activeVariant) return;
    addItem({
      variantId: activeVariant.id,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: activeVariant.price ?? product.price,
      compareAtPrice: activeVariant.compareAtPrice ?? product.compareAtPrice,
      quantity: 1,
      image,
      color: activeVariant.color,
    });
    if (add) setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }
  function handleBuyNow() {
    handleAddToCart(false);
    router.push("/cart");
  }

  return (
    <div className="flex items-center justify-center h-full gap-4">
      <button className="w-full h-full font-bold shadow-[4px_4px_0px] border-2 border-black dark:border-brand-pink-light bg-black dark:bg-brand-black-dark text-white hover:translate-y-0.5 hover:shadow-[2px_2px_0_#FF00B6] shadow-brand-pink transition-all active:translate-y-1 cursor-pointer">
        Comprar Agora
      </button>
      <button
        onClick={() => handleAddToCart()}
        disabled={!activeVariant?.inStock}
        className={clsx(
          "w-full h-full font-bold shadow-brand-black dark:shadow-brand-blue border-2 border-brand-black dark:border-brand-pink-light disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-[2px_2px_0px]",
          added
            ? "bg-green-400 dark:border-green-100 text-black shadow-[4px_4px_0] translate-y-0.5"
            : "bg-brand-pink dark:bg-brand-pink text-white dark:text-white dark:hover:text-brand-pink-light shadow-[4px_4px_0] dark:shadow-brand-blue hover:translate-y-0.5 hover:shadow-[4px_4px_0] active:translate-y-1",
        )}
      >
        {added ? t("page.added") : t("page.addToCart")}
      </button>
    </div>
  );
};

export default ProductActionsMobile;
