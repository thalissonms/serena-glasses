# Storefront Y2K System
Interface Design guidelines for Serena Glasses Public Storefront.

## Intent
- **Who is this human?** A young, trend-focused shopper looking for unique eyewear.
- **What must they accomplish?** Browse collections, feel the brand's energetic vibe, and purchase products seamlessly.
- **What should this feel like?** Y2K nostalgia meets modern pop. Bubbly, maximalist, sticker-book aesthetics.

## Direction and feel
- **Aesthetic:** Y2K / Maximalist Pop
- **Geometry:** Rounded edges (`rounded-lg`, `rounded-full`), thick solid borders (`border-4 border-brand-black`).
- **Accents:** Sparkles (`✦`), diamonds (`◆`), floating sticker badges, heavy drop shadows (`shadow-[4px_4px_0px] shadow-brand-purple`).
- **Palette:**
  - Background: `brand-light-surface-0` or `brand-pink-light/60`
  - Primary (Pink): `brand-pink` (`#FF00B6`)
  - Accent (Cyan/Purple/Yellow): `brand-blue`, `brand-purple`, `brand-yellow`
  - Text: `brand-black` for high contrast, or white strokes.

## Depth strategy
- **Solid Offset Shadows:** No soft blurs. Depth is created by solid offset shadows (e.g. `shadow-[4px_4px_0px] shadow-black`).
- **Text Strokes:** Titles use `-webkit-text-stroke` for a sticker/cutout effect.

## Key component patterns
- **Product Cards:** Thick borders, solid colored shadow, offset inner image container with rounded asymmetrical corners.
- **Section Titles:** Monospaced, highly tracked uppercase text with diamond/sparkle decorators (e.g., `◆ ACABOU DE CHEGAR ◆`).
- **Badges:** Pill-shaped with solid colors and thick borders, resembling stickers.
- **Typography:**
  - Headlines/Logos: `font-family-shrikhand` (Bubble/Retro)
  - Text/Descriptions: `font-family-poppins`
  - Labels/Tags/Metadata: `font-mono`
