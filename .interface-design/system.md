# System
Interface Design guidelines for Serena Glasses Admin Dashboard.

## Intent
- **Who is this human?** A high-fashion/tech e-commerce admin updating their optical catalog.
- **What must they accomplish?** Quickly scan, manage, and configure dynamic site layouts, products, and metrics with high precision.
- **What should this feel like?** A Cyber HUD or Hacker Terminal. Precision optics meets underground cyberpunk. High contrast, sharp edges, neon reflections.

## Direction and feel
- **Aesthetic:** Cyber Visor / Y2K Terminal
- **Geometry:** Sharp, `rounded-none`. No soft curves.
- **Accents:** Brackets `[ ]` for actions, forward slashes `//` for metadata, blinking blocks for active states.
- **Palette:**
  - Background (Void): `#050505`, `#000000`, `#0f0f0f`
  - Primary Neon (Pink): `var(--brand-pink)`
  - Secondary/Alert (Magenta): `var(--brand-pink-light)`
  - Text (Chrome): `#E0E0E0`, `#ffffff`

## Depth strategy
- **Borders over Shadows:** Depth is established by 1px neon borders (`border-brand-pink/30`) and subtle inset glows (`shadow-[inset_0_0_15px_rgba(255,0,182,0.05)]`).
- **Surface Color Shifts:** Very slight background color changes (`bg-white/5` to `bg-brand-pink/10`) to indicate hover and elevation.

## Spacing base unit
- Base unit: `4px` (`space-x-1`, `gap-2`).
- Dense inner component padding to feel precise and technical.
- Generous outer section margins to emphasize the "void" of the background.

## Key component patterns
- **Buttons:** Sharp rectangles, `[ ]` bracketing text, hover states slide a neon line or background fill.
- **Inputs:** Dark backgrounds, neon borders on focus, mono font for values.
- **Cards/Containers:** Simple 1px borders with decorative corner accents (e.g. 2x2px solid blocks at corners).
- **Typography:**
  - Headlines/Titles: Poppins (Bold/Black)
  - Data/Metadata/Labels: Mono (Uppercase, highly tracked e.g. `tracking-widest`, size `9px` or `10px`).
