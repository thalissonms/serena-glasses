import { AnimatePresence, m } from "framer-motion";
import { useProductModal } from '../../hooks/useProductModal';
import { Expand, Share2, X } from 'lucide-react';
import ProductPageContent from '../ProductPageContent';
import { useEffect } from 'react';
import clsx from 'clsx';
import ButtonIconY2K from '@shared/components/ui/ButtonIconY2K';
import { Sublogo } from '@shared/components/layout/Logos/Sublogo';
import { getPrimaryTag } from '../../utils/getPrimaryTag';
import { useTranslation } from 'react-i18next';
import { ProductBadgeY2K } from '../ProductBadge';
import { discountPercentage } from '../../utils/formatPrice';
import { y2kToast } from '@shared/lib/y2kToast';

export default function ProductModal() {
    const { selectedProduct, closeModal } = useProductModal();
    const { i18n, t } = useTranslation("products");
    const expandModal = () => {
        if (selectedProduct) {
            window.location.href = `/products/${selectedProduct.slug}`;
        }
    }

    const share = () => {
        if (selectedProduct) {
            const url = `${process.env.NEXT_PUBLIC_BASE_URL}/products/${selectedProduct.slug}`;
            navigator.clipboard.writeText(url);
            y2kToast.success("Link copiado para a área de transferência!");
        }
    }

    useEffect(() => {
        if (selectedProduct) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedProduct]);

    return (
        <AnimatePresence>
            {selectedProduct && (
                <section className="fixed inset-0 z-100 flex h-screen w-screen items-center justify-center bg-brand-black/30 backdrop-blur-sm">
                    <m.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className={clsx("m-auto flex h-[calc(100vh-32px)] w-[calc(100%-32px)] flex-col overflow-hidden bg-brand-light-surface-0 shadow-2xl md:h-[calc(100vh-64px)] md:w-[calc(100%-64px)] dark:bg-brand-dark-surface-0",
                            "rounded-md border-6 border-brand-black shadow-[10px_6px_0] shadow-brand-black dark:shadow-brand-dark-surface-2"
                        )}
                        style={{
                            backgroundImage: "url('/backgrounds/bg-grid.svg')",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                        }}
                    >
                        <div className={clsx("isoled mx-auto mt-1 flex h-15 w-[99%] shrink-0 items-center justify-between rounded-md border-4 border-brand-black bg-brand-light-surface-2 p-2",
                            "z-999 shadow-[4px_4px_0px] shadow-brand-black dark:border-brand-black dark:bg-brand-dark-surface-1 dark:shadow-brand-purple"
                        )}>
                            <div className={clsx(
                                "absolute top-0 left-0 -z-1 flex h-12 w-[98%] justify-end bg-linear-0 from-transparent via-brand-black/10 to-brand-black/5",
                                "rounded-tr-md rounded-br-3xl rounded-bl-sm"
                            )} />
                            <div className="flex items-center px-3">
                                {(selectedProduct.isNew ||
                                    selectedProduct.isOutlet ||
                                    (selectedProduct.isOnSale && selectedProduct.compareAtPrice)) || !selectedProduct.inStock ? (

                                    <div className="ml-1 flex gap-1">
                                        {selectedProduct.isNew && (
                                            <ProductBadgeY2K variant="new">
                                                {t("card.newBadge")}
                                            </ProductBadgeY2K>
                                        )}
                                        {selectedProduct.isOutlet && (
                                            <ProductBadgeY2K variant="outlet">
                                                {t("card.outletBadge")}
                                            </ProductBadgeY2K>
                                        )}
                                        {selectedProduct.isOnSale && selectedProduct.compareAtPrice && (
                                            <ProductBadgeY2K variant="sale">
                                                -
                                                {discountPercentage(
                                                    selectedProduct.price,
                                                    selectedProduct.compareAtPrice,
                                                )}
                                                %
                                            </ProductBadgeY2K>
                                        )}
                                        {!selectedProduct.inStock && (
                                            <ProductBadgeY2K variant="soldOut">
                                                {t("card.soldOut")}
                                            </ProductBadgeY2K>
                                        )}
                                    </div>
                                ) : (
                                    <div className="items center ml-2 flex">
                                        <Sublogo className="h-8 w-8 text-brand-black/80 dark:text-brand-white/80" />
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center justify-center">
                                <span className="font-family-mono text-xl font-bold tracking-tighter text-brand-black/75 uppercase dark:text-brand-white/80">{`${selectedProduct.name} - ${getPrimaryTag(selectedProduct, i18n.language)}`}</span>
                            </div>
                            <div className="flex gap-2">
                                <ButtonIconY2K
                                    variant="sm"
                                    icon={Share2}
                                    onClick={share}
                                    label={'Share'}
                                />
                                <ButtonIconY2K
                                    variant="sm"
                                    icon={Expand}
                                    onClick={() => expandModal()}
                                    label={'Expand Modal'}
                                />
                                <ButtonIconY2K
                                    variant="sm"
                                    icon={X}
                                    onClick={closeModal}
                                    label={'Close Modal'}
                                />
                            </div>

                        </div>

                        <div className={clsx(
                            "mt-0.5 hidden flex-1 overflow-y-auto md:block"
                        )}>
                            <ProductPageContent
                                product={selectedProduct}
                                videoSrc={selectedProduct.videoUrl}
                                reviews={[]}
                            />
                        </div>
                    </m.div>
                </section>
            )}
        </AnimatePresence>
    );
}