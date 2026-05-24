import { Rocket } from "lucide-react"
import styles from "./sidebar-header.module.css"
import pkg from "../../../../package.json";

interface SidebarHeaderProps {
  collapsed: boolean
}

export function SidebarHeader({
  collapsed,
}: SidebarHeaderProps) {
  return (
    <header
      className={`
        ${styles.header}
        ${collapsed ? styles.collapsed : styles.expanded}
      `}
    >
      <div className={styles.logo}>
        <Rocket
          className={styles.logoIcon}
        />
      </div>

      {!collapsed && (
        <div className={styles.info}>
          <span className={styles.title}>
            Solid Rocket Motor
          </span>

          <span className={styles.subtitle}>
            Simulator v{pkg.version}
          </span>
        </div>
      )}
    </header>
  )
}