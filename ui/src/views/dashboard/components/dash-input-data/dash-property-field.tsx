import { useState } from "react"
import styles from "./dash-property-field.module.css"

interface PropertyFieldProps {
  id: string
  label: string
  unit: string
  value: number | string;
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
}: PropertyFieldProps) {
  const [isFocused, setIsFocused] = useState(false)

  const containerClass = isFocused ? styles.fieldContainerFocused : ""
  const labelClass = isFocused ? styles.fieldLabelFocused : ""
  const wrapperClass = isFocused ? styles.inputWrapperFocused : styles.inputWrapperNormal

  return (
    <div className={`${styles.fieldContainer} ${containerClass}`}>
      <label
        htmlFor={id}
        className={`${styles.fieldLabel} ${labelClass}`}
      >
        {label}
      </label>
      <div className={`${styles.inputWrapper} ${wrapperClass}`}>
        <input
          id={id}
          type="number"
          step="any"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          onFocus={() => {
            setIsFocused(true)
            onFocus?.()
          }}
          onBlur={() => {
            setIsFocused(false)
            onBlur?.()
          }}
          className={styles.numberInput}
        />
        <span className={styles.unitLabel}>
          {unit}
        </span>
      </div>
    </div>
  )
}
