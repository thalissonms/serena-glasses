"use client";
import { useTranslation } from "react-i18next";

export interface LookbookItem {
  id: number;
  label: string;
}

interface ProductLookbookProps {
  items: LookbookItem[];
}

export default function ProductLookbook({ items }: ProductLookbookProps) {
  const { t } = useTranslation("products");

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-3 h-8 bg-brand-pink" />
        <h3 className="font-poppins font-black text-2xl uppercase tracking-wide">
          {t("description.lookbook.title")}
        </h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <div
            key={item.id}
            className="relative border-4 border-black shadow-[5px_5px_0_#000] overflow-hidden group"
            style={{ aspectRatio: "3/4" }}
          >
            <div
              className="absolute inset-0 flex items-end justify-start p-3"
              style={{
                background:
                  i % 2 === 0
                    ? "linear-gradient(135deg, #FFF0FA 0%, #FFB3E6 100%)"
                    : "linear-gradient(135deg, #000 0%, #FF00B6 100%)",
              }}
            >
              <svg
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 w-24"
                viewBox="0 0 460 460"
                fill={i % 2 === 0 ? "#FF00B6" : "#fff"}
              >
                <path d="M443.293,151.905c-21.556-2.48-41.537-3.737-59.347-3.737c-74.245,0-98.029,21.416-110.809,32.923l-2.052,1.833c-9.394,8.263-25.03,9.521-33.534,9.536l-7.2,0.008l-7.197-0.008c-8.496-0.014-24.131-1.272-33.522-9.536l-2.048-1.833c-12.78-11.507-36.576-32.923-110.817-32.923c-17.819,0-37.784,1.256-59.348,3.737c-10.093,1.162-18.047,10.496-17.38,20.377c1.713,25.235,10.652,87.354,56.609,119.093c20.065,13.854,42.731,21.176,65.551,21.176c46.907,0,81.904-30.36,89.163-77.332c0.104-0.629,2.733-15.362,18.089-15.362l1.026,0.014l0.793-0.014c15.356,0,17.977,14.733,18.085,15.339c7.262,46.995,42.258,77.355,89.161,77.355c22.822,0,45.484-7.322,65.554-21.176c45.953-31.755,54.894-93.857,56.608-119.093C461.351,162.401,453.392,153.06,443.293,151.905z" />
              </svg>

              <span
                className="relative z-10 text-xs font-black uppercase tracking-widest px-3 py-1 border-2 border-black"
                style={{
                  backgroundColor: i % 2 === 0 ? "#FF00B6" : "#fff",
                  color: i % 2 === 0 ? "#fff" : "#000",
                }}
              >
                {item.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
