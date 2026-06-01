// ─── Base inputs (sem RHF — usáveis em qualquer contexto) ─────────────

export { TextInput } from "./inputs/TextInput";
export type { TextInputProps } from "./inputs/TextInput";

export { NumberInput } from "./inputs/NumberInput";
export type { NumberInputProps } from "./inputs/NumberInput";

export { MaskedInput, CNPJInput, CPFInput, CEPInput } from "./inputs/MaskedInput";
export type { MaskedInputProps } from "./inputs/MaskedInput";

export { SelectInput } from "./inputs/SelectInput";
export type { SelectInputProps, SelectOption } from "./inputs/SelectInput";

export { CheckboxInput } from "./inputs/CheckboxInput";
export type { CheckboxInputProps } from "./inputs/CheckboxInput";

export { PhoneInput } from "./inputs/PhoneInput";
export type { PhoneInputProps } from "./inputs/PhoneInput";

export { DateInput } from "./inputs/DateInput";
export type { DateInputProps } from "./inputs/DateInput";

// ─── RHF inputs (requerem <FormProvider> do react-hook-form) ──────────

export {
  RHFTextInput,
  RHFNumberInput,
  RHFMaskedInput,
  RHFCNPJInput,
  RHFCPFInput,
  RHFCEPInput,
  RHFSelectInput,
  RHFCheckboxInput,
  RHFPhoneInput,
  RHFDateInput,
} from "./rhf";
