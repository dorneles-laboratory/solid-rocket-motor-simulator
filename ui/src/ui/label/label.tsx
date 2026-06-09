import styles from "./label.module.css";

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export default function Label({ className = "", ...props }: LabelProps) {
  return (
    <label
      className={`
        ${styles.label}
        ${className}
      `}
      {...props}
    />
  );
}
