/**
 * Golden Ratio angle utilities for organic, harmonious layouts.
 *
 * The golden angle ≈ 137.508° — the angle that divides a full rotation
 * by the golden ratio. It produces the most visually balanced distribution
 * of rotations (same principle as sunflower seed spirals).
 *
 * φ = 1.6180339887…
 * Golden angle = 360° / φ² ≈ 137.508°
 */

const PHI = 1.6180339887;
const GOLDEN_ANGLE = 360 / (PHI * PHI); // ≈ 137.508°

/**
 * Generate a sequence of rotation angles based on the golden angle.
 * Each successive angle is offset by the golden angle, then mapped
 * to a range of ±maxDegrees for polaroid-style rotations.
 *
 * @param count   How many angles to generate
 * @param maxDeg  Maximum rotation in degrees (default 18°)
 * @returns Array of rotation angles in degrees
 */
export function generateGoldenAngles(count: number, maxDeg: number = 18): number[] {
  return Array.from({ length: count }, (_, i) => {
    // Raw angle in 0–360 range
    const raw = (i * GOLDEN_ANGLE) % 360;
    // Normalize to -180..+180
    const normalized = raw > 180 ? raw - 360 : raw;
    // Scale to ±maxDeg range
    return Math.round((normalized / 180) * maxDeg * 100) / 100;
  });
}

/**
 * Get a single golden-ratio-based rotation for index `i`.
 */
export function goldenAngle(i: number, maxDeg: number = 18): number {
  const raw = (i * GOLDEN_ANGLE) % 360;
  const normalized = raw > 180 ? raw - 360 : raw;
  return Math.round((normalized / 180) * maxDeg * 100) / 100;
}

/**
 * Generate golden-ratio-based X offsets for stacking polaroids.
 * Produces small horizontal offsets that feel organic.
 *
 * @param i       Index of the polaroid in the stack
 * @param maxPx   Maximum offset in pixels (default 30)
 */
export function goldenOffsetX(i: number, maxPx: number = 30): number {
  const raw = (i * GOLDEN_ANGLE) % 360;
  return Math.round(Math.sin((raw * Math.PI) / 180) * maxPx * 100) / 100;
}

export { PHI, GOLDEN_ANGLE };
