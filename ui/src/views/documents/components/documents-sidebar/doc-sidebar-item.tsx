import { ReactNode, useState } from "react"
import { ChevronDown } from "lucide-react"

import styles from "./doc-sidebar-item.module.css"

interface DocumentsNavItemProps {
  icon?: ReactNode
  label: string
  onClick?: () => void
  active?: boolean
  children?: ReactNode
  defaultOpen?: boolean
}

export default function DocumentsNavItem({
  icon,
  label,
  onClick,
  active,
  children,
  defaultOpen = true,
}: DocumentsNavItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const hasChildren = Boolean(children)

  const buttonClassName = [
    styles.navItem,
    active ? styles.navItemActive : "",
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className={styles.wrapper}>
      <button
        onClick={() => {
          onClick?.()

          if (hasChildren) {
            setIsOpen(!isOpen)
          }
        }}
        className={buttonClassName}
      >
        <div className={styles.navLeft}>
          <span
            className={styles.navIcon}
            aria-hidden="true"
          >
            {icon}
          </span>

          <span className={styles.navItemLabel}>
            {label}
          </span>
        </div>

        {hasChildren && (
          <ChevronDown
            className={`
              ${styles.chevron}
              ${!isOpen ? styles.chevronClosed : ""}
            `}
            strokeWidth={1.5}
          />
        )}
      </button>

      {hasChildren && (
        <div
          className={`
            ${styles.children}
            ${!isOpen ? styles.childrenHidden : ""}
          `}
        >
          {children}
        </div>
      )}
    </div>
  )
}