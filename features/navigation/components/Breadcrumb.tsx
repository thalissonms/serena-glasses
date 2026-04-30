import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { BreadcrumbItem } from "../types/breadcrumb.types";

const Breadcrumb = ({ items }: { items: BreadcrumbItem[] }) => {
  return (
    <>
      <div className="max-w-7xl mx-auto mb-8 flex items-center gap-2 text-xs font-poppins font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
        {items.map((item, index) => (
          <span key={index} className="flex items-center gap-2">
            {index > 0 && <ChevronRight size={12} />}
            {item.url ? (
              <Link
                href={item.url}
                className="hover:text-brand-pink transition-colors"
              >
                {item.navs}
              </Link>
            ) : (
              <span className="text-black dark:text-white">{item.navs}</span>
            )}
          </span>
        ))}

      </div>

    </>
  );
};

export default Breadcrumb;
