"use client";
import clsx from "clsx";
import { InputError, InputLabel, applyMask, inputCls, type InputVariant } from "./_shared";

export interface MaskedInputProps {
  label?: string;
  placeholder?: string;
  pattern: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  id?: string;
  className?: string;
  variant?: InputVariant;
}

export function MaskedInput({
  label,
  placeholder,
  pattern,
  value = "",
  onChange,
  onBlur,
  disabled,
  required,
  error,
  id,
  className,
  variant,
}: MaskedInputProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange?.(applyMask(e.target.value, pattern));
  }

  return (
    <div className={clsx("flex flex-col", className)}>
      {label && <InputLabel htmlFor={id} label={label} required={required} variant={variant} />}
      <input
        id={id}
        type="text"
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder={placeholder ?? pattern.replace(/#/g, "0")}
        disabled={disabled}
        maxLength={pattern.length}
        className={inputCls(error, undefined, variant)}
      />
      <InputError message={error} variant={variant} />
    </div>
  );
}

type MaskedPresetProps = Omit<MaskedInputProps, "pattern">;

export function CNPJInput(props: MaskedPresetProps) {
  return (
    <MaskedInput
      {...props}
      pattern="##.###.###/####-##"
      placeholder={props.placeholder ?? "00.000.000/0000-00"}
    />
  );
}

export function CPFInput(props: MaskedPresetProps) {
  return (
    <MaskedInput
      {...props}
      pattern="###.###.###-##"
      placeholder={props.placeholder ?? "000.000.000-00"}
    />
  );
}

export function CEPInput(props: MaskedPresetProps) {
  return (
    <MaskedInput
      {...props}
      pattern="#####-###"
      placeholder={props.placeholder ?? "00000-000"}
    />
  );
}
