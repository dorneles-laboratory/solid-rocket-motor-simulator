import { ReactNode } from "react";
import styles from "./header.module.css";
import { Input } from "../../../ui/input/input";
import { Search } from "lucide-react";

interface HeaderProps {
  path?: string | string[];
  title: string;
  icon?: ReactNode;
  showSearch?: boolean;
}

export default function Header({ path = [], title, icon, showSearch }: HeaderProps) {
  // Transforma em array e filtra diretamente, evitando joins e splits redundantes
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
        {showSearch && (
          <div className={styles.search_wrapper}>
            <Search className={styles.search_icon} size={20} aria-hidden="true" />
            <Input 
              type="search"
              placeholder="Buscar..." 
              className={styles.search_input} 
              aria-label="Buscar no sistema"
            />
          </div>
        )}

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