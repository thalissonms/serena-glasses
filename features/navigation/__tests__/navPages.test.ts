import { describe, it, expect } from "vitest";
import { hrefSchema, labelEnum, navPageSchema, navPagesSchema } from "../schemas/navPages.schema";
import { NAV_PAGES } from "../config/navPages";

describe("navPages schema", () => {
  describe("hrefSchema", () => {
    it("accepts paths starting with /", () => {
      expect(hrefSchema.safeParse("/").success).toBe(true);
      expect(hrefSchema.safeParse("/sun-glasses").success).toBe(true);
      expect(hrefSchema.safeParse("/outlet/promos").success).toBe(true);
    });

    it("accepts full URLs", () => {
      expect(hrefSchema.safeParse("https://serenaglasses.com").success).toBe(true);
      expect(hrefSchema.safeParse("http://localhost:3000").success).toBe(true);
    });

    it("rejects invalid hrefs", () => {
      expect(hrefSchema.safeParse("").success).toBe(false);
      expect(hrefSchema.safeParse("sun-glasses").success).toBe(false);
      expect(hrefSchema.safeParse("ftp://file").success).toBe(false);
    });
  });

  describe("labelEnum", () => {
    it("accepts all valid labels", () => {
      const validLabels = ["home", "sunGlasses", "miniDrop", "accessories", "outlet", "promotions", "about"];
      validLabels.forEach((label) => {
        expect(labelEnum.safeParse(label).success).toBe(true);
      });
    });

    it("rejects invalid labels", () => {
      expect(labelEnum.safeParse("").success).toBe(false);
      expect(labelEnum.safeParse("contact").success).toBe(false);
      expect(labelEnum.safeParse("Home").success).toBe(false);
    });
  });

  describe("navPageSchema", () => {
    it("accepts valid nav page", () => {
      const result = navPageSchema.safeParse({ href: "/outlet", label: "outlet" });
      expect(result.success).toBe(true);
    });

    it("rejects missing fields", () => {
      expect(navPageSchema.safeParse({ href: "/outlet" }).success).toBe(false);
      expect(navPageSchema.safeParse({ label: "outlet" }).success).toBe(false);
    });

    it("rejects invalid href + valid label", () => {
      expect(navPageSchema.safeParse({ href: "outlet", label: "outlet" }).success).toBe(false);
    });

    it("rejects valid href + invalid label", () => {
      expect(navPageSchema.safeParse({ href: "/outlet", label: "invalid" }).success).toBe(false);
    });
  });

  describe("navPagesSchema", () => {
    it("accepts valid array", () => {
      const pages = [
        { href: "/", label: "home" },
        { href: "/outlet", label: "outlet" },
      ];
      expect(navPagesSchema.safeParse(pages).success).toBe(true);
    });

    it("accepts empty array", () => {
      expect(navPagesSchema.safeParse([]).success).toBe(true);
    });

    it("rejects if any page is invalid", () => {
      const pages = [
        { href: "/", label: "home" },
        { href: "bad", label: "outlet" },
      ];
      expect(navPagesSchema.safeParse(pages).success).toBe(false);
    });
  });
});

describe("NAV_PAGES config", () => {
  it("has at least one page", () => {
    expect(NAV_PAGES.length).toBeGreaterThan(0);
  });

  it("all pages have valid href starting with /", () => {
    NAV_PAGES.forEach((page) => {
      expect(page.href).toMatch(/^\//);
    });
  });

  it("all pages have non-empty key", () => {
    NAV_PAGES.forEach((page) => {
      expect(page.key).toBeTruthy();
    });
  });

  it("has no duplicate hrefs", () => {
    const hrefs = NAV_PAGES.map((p) => p.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("has no duplicate keys", () => {
    const keys = NAV_PAGES.map((p) => p.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("includes home route /", () => {
    expect(NAV_PAGES.some((p) => p.href === "/")).toBe(true);
  });
});
