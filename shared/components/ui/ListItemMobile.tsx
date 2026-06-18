"use client";

import { m, useAnimation, PanInfo } from "framer-motion";
import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import clsx from "clsx";
import { formatPrice } from "@features/products/utils/formatPrice";
import React, { useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

export interface ListItemMobileProps {
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  price: number;
  compareAtPrice?: number | null;
  name: string;
  image?: { url: string; alt?: string | null } | null;
  index?: number;
  /** Callback disparado ao arrastar para a esquerda além do threshold */
  onSwipeAction?: () => void;
  color?: { name: string; hex: string };
  quantity?: number;
  onChangeQty?: (delta: number) => void;
}

const SWIPE_THRESHOLD = 100;

export function ListItemMobile({
  href,
  onClick,
  icon,
  price,
  compareAtPrice,
  name,
  image,
  index = 0,
  onSwipeAction,
  color,
  quantity,
  onChangeQty,
}: ListItemMobileProps) {
  const controls = useAnimation();
  const swiping = useRef(false);

  const handleDragEnd = useCallback(
    async (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (!onSwipeAction) return;

      const { x: offset } = info.offset;
      const { x: velocity } = info.velocity;

      if (offset < -SWIPE_THRESHOLD || velocity < -600) {
        swiping.current = true;
        await controls.start({
          x: "-100%",
          transition: { duration: 0.18, ease: "easeOut" },
        });
        onSwipeAction();
        return;
      }

      controls.start({
        x: 0,
        transition: { type: "spring", stiffness: 400, damping: 40 },
      });
    },
    [onSwipeAction, controls],
  );

  const content = (
    <>
      <div className="flex gap-1.5">
        <div className="relative isolate w-20 h-20 shrink-0 overflow-hidden border-r-2 border-brand-black/5 ml-px">
          <div className="z-2 w-20 h-20 absolute bottom-0 left-0 bg-linear-to-t from-brand-black/5 via-transparent to-brand-black/5" />
          {image ? (
            <Image
              src={image.url}
              alt={image.alt ?? name}
              fill
              sizes="64px"
              className="object-cover -z-1"
            />
          ) : (
            <span className="absolute z-1 inset-0 flex items-center justify-center text-brand-pink/20 text-xl font-jocham">
              ✦
            </span>
          )}
        </div>

        <div className="py-1.5 flex flex-col justify-center">
          <p
            className={clsx(
              "font-poppins font-bold text-base text-brand-pink dark:text-brand-pink-light leading-tight truncate",
              "[-webkit-text-stroke:0.5px_rgba(18,18,18,1)] [text-stroke:0.5px_rgba(18,18,18,1)] dark:[-webkit-text-stroke:0.5px_rgba(155,0,255,0.75)] dark:[text-stroke:1.5px_rgba(155,0,255,0.75)]",
              "text-shadow-[1px_1px_0px] text-shadow-brand-black"
            )}
          >
            {name}
          </p>
          {color && (
            <div className="flex items-center gap-1 mt-0.5">
              <span
                className="w-2.5 h-2.5 rounded-full border border-brand-black/20"
                style={{ backgroundColor: color.hex }}
                aria-hidden="true"
              />
              <span className="text-[10px] text-brand-black/60 dark:text-brand-white/60 font-inter">
                {color.name}
              </span>
            </div>
          )}
          <div className="flex flex-col items-baseline justify-end gap-1 mt-1">
            <span
              className={clsx(
                "font-family-jocham text-lg text-brand-yellow leading-none",
                "[-webkit-text-stroke:0.5px_rgba(255,0,182,1)] [text-stroke:0.5px_rgba(255,0,182,1)] dark:[-webkit-text-stroke:0.5px_rgba(155,0,255,0.75)] dark:[text-stroke:1.5px_rgba(155,0,255,0.75)]"
              )}
            >
              {formatPrice(price * (quantity || 1))}
            </span>
            {(!quantity !== undefined && !onChangeQty &&
              compareAtPrice !== undefined && compareAtPrice !== null && compareAtPrice > 0 && (
                <span className="text-[10px] text-brand-black/30 dark:text-brand-white/40 font-inter line-through">
                  {formatPrice(compareAtPrice)}
                </span>
              )
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end justify-center gap-2 py-1 px-2">
        <div className="flex items-center mr-2 shrink-0">
          {icon || (
            <ArrowRight className="w-6 h-6 text-brand-pink dark:text-brand-pink-light shrink-0" />
          )}
        </div>
        {quantity !== undefined && onChangeQty && (
          <div
            className="flex items-center border border-brand-black dark:border-brand-pink/50 rounded-sm bg-brand-light-surface-0 dark:bg-brand-dark-surface-0 shadow-[1px_1px_0] shadow-brand-black mr-1"
            role="group"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChangeQty(-1);
              }}
              className="px-1.5 py-0.5 hover:bg-brand-pink hover:text-white transition-colors border-r border-brand-black dark:border-brand-pink/50 cursor-pointer"
            >
              <Minus size={10} />
            </button>
            <span className="px-2 py-0.5 font-poppins font-bold text-[10px] min-w-6 text-center text-brand-black dark:text-brand-white">
              {quantity}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChangeQty(1);
              }}
              className="px-1.5 py-0.5 hover:bg-brand-pink hover:text-white transition-colors border-l border-brand-black dark:border-brand-pink/50 cursor-pointer"
            >
              <Plus size={10} />
            </button>
          </div>
        )}
      </div>
    </>
  );

  const router = useRouter();

  const innerClassName = "min-h-20 flex justify-between gap-3 hover:bg-brand-pink/5 active:bg-brand-pink/10 active:translate-x-0.5 transition-all text-left w-full cursor-pointer";

  const handleContainerClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (swiping.current) {
      e.preventDefault();
      swiping.current = false;
      return;
    }

    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      return;
    }

    if (onClick) {
      onClick();
    }

    if (href) {
      router.push(href);
    }
  };

  const innerContent = (
    <div
      role={href ? "link" : "button"}
      tabIndex={0}
      className={innerClassName}
      onClick={handleContainerClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleContainerClick(e);
        }
      }}
    >
      {content}
    </div>
  );

  return (
    <m.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -32, transition: { duration: 0.18 } }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      className={clsx(
        "relative isolate mt-1.5 overflow-hidden rounded-sm",
      )}
    >
      {onSwipeAction && (
        <div className="absolute inset-0 flex items-center justify-end px-6 bg-red-500/90 dark:bg-red-600/90 rounded-sm">
          <Trash2 className="w-6 h-6 text-white" strokeWidth={2.5} />
        </div>
      )}

      <m.div
        animate={controls}
        drag={onSwipeAction ? "x" : false}
        dragDirectionLock
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0.3, right: 0 }}
        dragMomentum={false}
        onDragEnd={onSwipeAction ? handleDragEnd : undefined}
        onDrag={onSwipeAction ? (_, info) => {
          // Impede arrastar para a direita
          if (info.offset.x > 0) controls.set({ x: 0 });
        } : undefined}
        className={clsx(
          "bg-brand-light-surface-2 dark:bg-brand-dark-surface-2 border-2 border-brand-black relative rounded-sm",
          "shadow-[2px_2px_0px] shadow-brand-pink dark:shadow-brand-purple dark:border-brand-pink",
        )}
      >
        {innerContent}

        <div
          className={clsx(
            "-z-1 absolute top-0 left-0 rounded-[3px] w-full h-full border-2 pointer-events-none",
            "border-t-brand-white/40 border-l-brand-white/40 border-b-brand-white/75 border-r-brand-white/75",
            "dark:border-t-brand-white/10 dark:border-l-brand-white/10 dark:border-b-brand-white/5 dark:border-r-brand-white/5"
          )}
        />
        <div
          className={clsx(
            "-z-2 absolute top-0.5 left-0.5 w-[98%] h-[80%] pointer-events-none",
            "bg-linear-to-br from-brand-white/75 via-brand-white/50 to-brand-white/5 rounded-br-lg rounded-bl-xs rounded-tl-xs rounded-tr-xs",
            "dark:from-brand-white/10 dark:via-brand-white/5 dark:to-brand-white/2 "
          )}
        />
      </m.div>
    </m.li>
  );
}
