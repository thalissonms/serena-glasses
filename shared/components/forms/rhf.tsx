"use client";
import { Controller, useFormContext, type RegisterOptions } from "react-hook-form";

import { TextInput, type TextInputProps } from "./inputs/TextInput";
import { NumberInput, type NumberInputProps } from "./inputs/NumberInput";
import {
  MaskedInput,
  CNPJInput,
  CPFInput,
  CEPInput,
  type MaskedInputProps,
} from "./inputs/MaskedInput";
import { SelectInput, type SelectInputProps } from "./inputs/SelectInput";
import { CheckboxInput, type CheckboxInputProps } from "./inputs/CheckboxInput";
import { PhoneInput, type PhoneInputProps } from "./inputs/PhoneInput";
import { DateInput, type DateInputProps } from "./inputs/DateInput";

type RHF<T> = Omit<T, "value" | "onChange" | "onBlur" | "error"> & {
  name: string;
  rules?: RegisterOptions;
};

// ─── Text ──────────────────────────────────────────────────────────────

export function RHFTextInput({ name, rules, id, ...props }: RHF<TextInputProps>) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextInput
          {...props}
          id={id ?? name}
          value={field.value ?? ""}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

// ─── Number ────────────────────────────────────────────────────────────

export function RHFNumberInput({ name, rules, id, ...props }: RHF<NumberInputProps>) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <NumberInput
          {...props}
          id={id ?? name}
          value={field.value ?? ""}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

// ─── Masked (generic) ──────────────────────────────────────────────────

export function RHFMaskedInput({ name, rules, id, ...props }: RHF<MaskedInputProps>) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <MaskedInput
          {...props}
          id={id ?? name}
          value={field.value ?? ""}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

// ─── CNPJ / CPF / CEP ─────────────────────────────────────────────────

type MaskedPreset = RHF<Omit<MaskedInputProps, "pattern">>;

export function RHFCNPJInput({ name, rules, id, ...props }: MaskedPreset) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <CNPJInput
          {...props}
          id={id ?? name}
          value={field.value ?? ""}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

export function RHFCPFInput({ name, rules, id, ...props }: MaskedPreset) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <CPFInput
          {...props}
          id={id ?? name}
          value={field.value ?? ""}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

export function RHFCEPInput({ name, rules, id, ...props }: MaskedPreset) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <CEPInput
          {...props}
          id={id ?? name}
          value={field.value ?? ""}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

// ─── Select ────────────────────────────────────────────────────────────

export function RHFSelectInput({ name, rules, id, ...props }: RHF<SelectInputProps>) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <SelectInput
          {...props}
          id={id ?? name}
          value={field.value ?? ""}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

// ─── Checkbox ──────────────────────────────────────────────────────────

type RHFCheckbox = Omit<CheckboxInputProps, "checked" | "onChange" | "onBlur" | "error"> & {
  name: string;
  rules?: RegisterOptions;
};

export function RHFCheckboxInput({ name, rules, ...props }: RHFCheckbox) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <CheckboxInput
          {...props}
          checked={field.value ?? false}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

// ─── Phone ─────────────────────────────────────────────────────────────

export function RHFPhoneInput({ name, rules, id, ...props }: RHF<PhoneInputProps>) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <PhoneInput
          {...props}
          id={id ?? name}
          value={field.value ?? ""}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

// ─── Date ──────────────────────────────────────────────────────────────

export function RHFDateInput({ name, rules, id, ...props }: RHF<DateInputProps>) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <DateInput
          {...props}
          id={id ?? name}
          value={field.value ?? ""}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
