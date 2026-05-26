import { ReactNode } from "react";
import styles from "./doc-sidebar-item.module.css";

interface DocumentsNavItemProps {
  icon?: ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
  indent?: boolean;
}

export default function DocumentsNavItem({
  icon,
  label,
  onClick,
  active,
  indent,
}: DocumentsNavItemProps) {
  const buttonClassName = [
    styles.navItem,
    indent ? styles.navItemIndented : "",
    active ? styles.navItemActive : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button onClick={onClick} className={buttonClassName}>
      {icon && (
        <span 
          className={`${styles.navIcon} ${active ? styles.navIconActive : ""}`.trim()}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}

      <span className={styles.navItemLabel}>
        {label}
      </span>
    </button>
  );
}