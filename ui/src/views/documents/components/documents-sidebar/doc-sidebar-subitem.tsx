import styles from "./doc-sidebar-subitem.module.css"

interface NavSubItemProps {
  label: string
  onClick?: () => void
  active?: boolean
}

export default function NavSubItem({
  label,
  onClick,
  active,
}: NavSubItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        ${styles.subItem}
        ${active ? styles.active : ""}
      `}
    >
      <span className={styles.dot} />

      <span className={styles.label}>
        {label}
      </span>
    </button>
  )
}