import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { homeSectionCreateSchema } from "../../schemas/homeSection.schema";
import { HomeSection, HomeSectionCreateInput } from "../../types/homeSection/homeSection.types";

export function useHomeSectionForm(
  defaultValues?: Partial<HomeSection>
): UseFormReturn<HomeSectionCreateInput> {
  return useForm<HomeSectionCreateInput>({
    resolver: zodResolver(homeSectionCreateSchema),
    defaultValues: {
      title_pt: "",
      type: "subcategory",
      subcategory_id: null,
      category_id: null,
      is_special_component: false,
      active: true,
      display_order: 0,
      product_ids: defaultValues?.home_section_products
        ? defaultValues.home_section_products
            .sort((a, b) => a.position - b.position)
            .map((p) => p.product_id)
        : [],
      ...defaultValues,
    },
  });
}
