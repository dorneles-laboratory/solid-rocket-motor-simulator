import styles from "./sidebar-collapse-button.module.css"
import { ChevronDown } from "lucide-react"

export default function SidebarCollapseButton({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return (
    <button
        onClick={onToggle}
        className={styles.toggleButton}
      >
        <ChevronDown
          className={`${styles.icon} ${
            collapsed ? styles.collapsed : styles.expanded
          }`}
          strokeWidth={1.5}
        />
    </button>
  )
}