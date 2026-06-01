import { FRAME_MATERIALS, FRAME_SHAPES, LENS_TYPES } from "../schemas/product/payload/productEdit.schema";

export const FRAME_SHAPE_OPTIONS = [
  { value: "", label: "Sem forma" },
  ...FRAME_SHAPES.map((s) => ({ value: s, label: s })),
];
export  const FRAME_MATERIAL_OPTIONS = [
  { value: "", label: "Sem material" },
  ...FRAME_MATERIALS.map((s) => ({ value: s, label: s })),
];
export const LENS_TYPE_OPTIONS = [
  { value: "", label: "Sem tipo" },
  ...LENS_TYPES.map((s) => ({ value: s, label: s })),
];