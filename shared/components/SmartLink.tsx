"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ComponentProps } from "react";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

export function SmartLink({ href, children, prefetch, replace, scroll, ...rest }: Props) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
  }, []);

  if (isDesktop) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} prefetch={prefetch} replace={replace} scroll={scroll} {...rest}>
      {children}
    </Link>
  );
}
