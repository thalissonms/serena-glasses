"use client";
import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface ReviewItem {
  name: string;
  city: string;
  stars: number;
  text: string;
  date: string;
  verified: boolean;
}

interface ProductReviewsProps {
  reviews: ReviewItem[];
}

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < count ? "text-brand-yellow fill-brand-yellow" : "text-gray-300 dark:text-gray-700 fill-gray-300 dark:fill-gray-700"
          }
        />
      ))}
    </div>
  );
}

export default function ProductReviews({ reviews }: ProductReviewsProps) {
  const { t } = useTranslation("products");
  const avgStars = (reviews.reduce((a, r) => a + r.stars, 0) / reviews.length).toFixed(1);

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-8 bg-brand-pink" />
          <h3 className="font-poppins font-black text-2xl uppercase tracking-wide">
            {t("description.reviews.title")}
          </h3>
        </div>

        <div className="flex items-center gap-3 border-4 border-black dark:border-brand-pink px-5 py-2 shadow-[4px_4px_0_#FF00B6] bg-white dark:bg-[#1a1a1a]">
          <span className="font-poppins font-black text-4xl text-brand-pink leading-none">
            {avgStars}
          </span>
          <div className="flex flex-col gap-1">
            <StarRow count={5} />
            <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">
              {t("description.reviews.count", { count: reviews.length })}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map((review, i) => (
          <div
            key={i}
            className={`border-4 border-black dark:border-brand-pink shadow-[5px_5px_0_#000] dark:shadow-[5px_5px_0_#FF00B6] p-5 flex flex-col gap-3 ${
              i === 0 ? "md:col-span-2 lg:col-span-1" : ""
            } bg-white dark:bg-[#1a1a1a]`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-black text-sm uppercase tracking-wide">{review.name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {review.city} · {review.date}
                </p>
              </div>
              {review.verified && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-pink border border-brand-pink px-2 py-0.5 rounded-full shrink-0">
                  {t("description.reviews.verified")}
                </span>
              )}
            </div>

            <StarRow count={review.stars} />

            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed border-l-4 border-brand-pink pl-3">
              {review.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
