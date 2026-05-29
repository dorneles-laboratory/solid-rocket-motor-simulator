import styles from "./text-area.module.css"

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export default function Textarea({
  className = "",
  ...props
}: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={`
        ${styles.textarea}
        ${className}
      `}
      {...props}
    />
  )
}