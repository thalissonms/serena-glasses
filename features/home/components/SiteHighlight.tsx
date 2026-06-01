"use client"
import Image from "next/image";
import { useTheme } from "@shared/providers/ThemeProvider";
import { PublicSiteHighlight } from "../services/siteHighlightPublic.service";


export default function SiteHighlight({ hightlight }: { hightlight: PublicSiteHighlight | null }) {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = theme === "system" ? resolvedTheme : theme;

    if (!hightlight || !hightlight.image_url_dark || !hightlight.image_url_light) return null;

    return (
        <div>
            <Image
                src={
                    currentTheme === "dark" ?
                        hightlight.image_url_dark :
                        hightlight.image_url_light
                }
                alt={"sale"}
                width={1920}
                height={1080}
                priority
                quality={100}
                role="hightlight"
                className="drop-shadow-[4px_-4px_0px] drop-shadow-brand-purple dark:drop-shadow-brand-dark-surface-2"
            />
        </div>
    )
}