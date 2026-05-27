import { ReactNode } from "react";
import styles from "./doc-header.module.css";

interface HeaderProps {
  path?: string | string[];
  title: string;
  icon?: ReactNode;
  showSearch?: boolean;
}

export default function Header({ path = [], title, icon }: HeaderProps) {
  const pathArray = Array.isArray(path) ? path : path.split("/");
  const formattedPath = pathArray
    .map(word => word.trim())
    .filter(Boolean)
    .join(" / ");

  return (
    <header className={styles.header}>
      <div className={styles.header_content}>
        {icon && (
          <span className={styles.header_icon} aria-hidden="true">
            {icon}
          </span>
        )}

        <h1 className={styles.header_text}>
          {title}
        </h1>
      </div>
      
      <div className={styles.header_left}>
        {formattedPath && (
          <nav aria-label="Breadcrumb">
            <small className={styles.header_path}>
              {formattedPath}
            </small>
          </nav>
        )}
      </div>
    </header>
  );
}