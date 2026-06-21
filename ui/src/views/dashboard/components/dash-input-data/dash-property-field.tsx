import { useState } from "react";
import styles from "./dash-property-field.module.css";

type typeValue = "number" | "string" | "select";

export interface SelectOption {
  value: string | number;
  label: string;
}

interface PropertyFieldProps {
  id: string;
  label: string;
  unit?: string; // Transformei em opcional
  value: number | string;
  type?: typeValue;
  options?: SelectOption[]; // Nova prop para o dropdown
  onChange: (value: number | string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export default function PropertyField({
  id,
  label,
  unit,
  value,
  onChange,
  onFocus,
  onBlur,
  type = "number",
  options = [],
}: PropertyFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  const containerClass = isFocused ? styles.fieldContainerFocused : "";
  const labelClass = isFocused ? styles.fieldLabelFocused : "";
  const wrapperClass = isFocused
    ? styles.inputWrapperFocused
    : styles.inputWrapperNormal;

  return (
    <div className={`${styles.fieldContainer} ${containerClass}`}>
      <label htmlFor={id} className={`${styles.fieldLabel} ${labelClass}`}>
        {label}
      </label>
      <div className={`${styles.inputWrapper} ${wrapperClass}`}>
        {type === "select" ? (
          <select
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              onFocus?.();
            }}
            onBlur={() => {
              setIsFocused(false);
              onBlur?.();
            }}
            className={styles.numberInput}
            style={{
              cursor: "pointer",
              width: "100%",
              background: "transparent",
            }}
          >
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                style={{
                  background: "var(--card)",
                  color: "var(--foreground)",
                }}
              >
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={id}
            type={type === "number" ? "number" : "text"}
            step="any"
            value={value}
            onChange={(e) => {
              if (type === "number") {
                onChange(parseFloat(e.target.value) || 0);
              } else {
                onChange(e.target.value);
              }
            }}
            onFocus={() => {
              setIsFocused(true);
              onFocus?.();
            }}
            onBlur={() => {
              setIsFocused(false);
              onBlur?.();
            }}
            className={styles.numberInput}
          />
        )}

        {unit && <span className={styles.unitLabel}>{unit}</span>}
      </div>
    </div>
  );
}
