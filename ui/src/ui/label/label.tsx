import styles from "./label.module.css"

interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export default function Label({
  className = "",
  ...props
}: LabelProps) {
  return (
    <label
      className={`
        ${styles.label}
        ${className}
      `}
      {...props}
    />
  )
}