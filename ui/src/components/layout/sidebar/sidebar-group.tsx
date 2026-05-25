import styles from "./sidebar-group.module.css"

interface NavGroupProps {
  title: string
  collapsed: boolean
  children: React.ReactNode
}

export default function NavGroup({ title, collapsed, children }: NavGroupProps) {
  return (
  <div className={styles.section}>
      {!collapsed && (
        <span className={styles.sectionTitle}>
          {title}
        </span>
      )}

      <div className={styles.sectionContent}>
        {children}
      </div>
    </div>
  )
}