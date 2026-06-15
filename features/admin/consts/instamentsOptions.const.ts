export const INSTALLMENTS_OPTIONS = [
  { value: "1", label: "1x (sem parcelamento)" },
  ...Array.from({ length: 11 }, (_, i) => ({
    value: String(i + 2),
    label: `até ${i + 2}x`,
  })),
];
