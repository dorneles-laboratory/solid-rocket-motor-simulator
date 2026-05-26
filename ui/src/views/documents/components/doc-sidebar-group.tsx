import styles from "./doc-sidebar-group.module.css"

interface DocumentsNavGroupProps {
  title: string
  collapsed?: boolean
  children: React.ReactNode
}

export default function DocumentsNavGroup({ title, collapsed, children }: DocumentsNavGroupProps) {
  return (
  <div className={styles.section}>
      {!collapsed && (
        <span className={styles.group_title}>
          {title}
        </span>
      )}

      <div className={styles.group_content}>
        {children}
      </div>
    </div>
  )
}