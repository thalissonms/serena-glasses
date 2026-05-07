export function getStorePackage() {
  return {
    widthCm:  Number(process.env.STORE_PACKAGE_WIDTH_CM  ?? 24),
    heightCm: Number(process.env.STORE_PACKAGE_HEIGHT_CM ?? 4),
    lengthCm: Number(process.env.STORE_PACKAGE_LENGTH_CM ?? 16),
    weightG:  Number(process.env.STORE_PACKAGE_WEIGHT_G  ?? 110),
  };
}
