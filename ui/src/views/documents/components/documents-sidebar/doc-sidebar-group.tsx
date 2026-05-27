import React, { useState } from "react"
import { ChevronDown } from "lucide-react"

import styles from "./doc-sidebar-group.module.css"

interface DocumentsNavGroupProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export default function DocumentsNavGroup({
  title,
  children,
  defaultOpen = true,
}: DocumentsNavGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={styles.section}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.groupTitle}
      >
        <span>
          {title}
        </span>

        <ChevronDown
          className={`
            ${styles.chevron}
            ${!isOpen ? styles.closed : ""}
          `}
          strokeWidth={1.5}
        />
      </button>

      <div
        className={`
          ${styles.groupContent}
          ${!isOpen ? styles.hidden : ""}
        `}
      >
        {children}
      </div>
    </div>
  )
}