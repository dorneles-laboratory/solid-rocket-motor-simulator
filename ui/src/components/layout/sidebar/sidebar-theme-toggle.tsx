import { Monitor, Moon, Sun } from "lucide-react"

import { useTheme } from "../../../hooks/use-theme"

import styles from "./sidebar-theme-toggle.module.css"

interface SidebarThemeToggleProps {
  collapsed: boolean
}

export default function SidebarThemeToggle({
  collapsed,
}: SidebarThemeToggleProps) {
  const { theme, setTheme } = useTheme()

  const getButtonClass = (value: string) =>
    theme === value
      ? `${styles.themeButton} ${styles.active}`
      : styles.themeButton

  return (
    <div className={styles.container}>
      <div
        className={
          collapsed
            ? styles.themeToggleCollapsed
            : styles.themeToggle
        }
      >
        <button
          onClick={() => setTheme("light")}
          className={getButtonClass("light")}
        >
          <Sun
            className={styles.icon}
            strokeWidth={1.5}
          />
        </button>

        <button
          onClick={() => setTheme("dark")}
          className={getButtonClass("dark")}
        >
          <Moon
            className={styles.icon}
            strokeWidth={1.5}
          />
        </button>

        <button
          onClick={() => setTheme("system")}
          className={getButtonClass("system")}
        >
          <Monitor
            className={styles.icon}
            strokeWidth={1.5}
          />
        </button>
      </div>
    </div>
  )
}