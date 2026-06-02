import React, { useState } from "react"
import { ChevronDown } from "lucide-react"
import styles from "./dash-property-group.module.css" 

interface PropertyGroupProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export default function DashboardPropertyGroup({ title, children, defaultOpen = true }: PropertyGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const contentClass = isOpen ? styles.groupContentOpen : styles.groupContentClosed
  const iconClass = !isOpen ? styles.groupIconClosed : ""

  return (
    <div className={styles.groupContainer}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.groupButton}
        type="button"
      >
        <span className={styles.groupTitle}>
          {title}
        </span>
        <ChevronDown
          className={`${styles.groupIcon} ${iconClass}`}
        />
      </button>
      <div className={`${styles.groupContent} ${contentClass}`}>
        {children}
      </div>
    </div>
  )
}