import { ReactNode } from "react";
import styles from "./header.module.css";

interface HeaderProps {
  path: string | string[];
  title: string;
  icon?: ReactNode;
}

export default function Header({ path, title, icon }: HeaderProps) {
  const formattedPath = (Array.isArray(path) ? path.join("/") : path)
    .split("/")
    .map(word => word.trim())
    .filter(Boolean)
    .join(" / ");

  return (
    <header className={styles.header}>
      <div className={styles.header_content}>
        {icon && <span className={styles.header_icon}>{icon}</span>}
        <p className={styles.header_text}>
          {title}
        </p>
      </div>
      
      <small className={styles.header_path}>
        {formattedPath ? `${formattedPath}` : ""}
      </small>
    </header>
  );
}