import styles from "./text-area.module.css";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  className?: string;
};

export default function Textarea({ className = "", ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={`
        ${styles.textarea}
        ${className}
      `}
      {...props}
    />
  );
}
