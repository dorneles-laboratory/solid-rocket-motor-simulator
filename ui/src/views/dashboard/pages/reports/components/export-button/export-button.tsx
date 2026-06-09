import styles from "./export-button.module.css"

interface ExportButtonProps {
  icon: React.ReactNode
  label: string
  format: string
  onClick?: () => void
}

export default function ExportButton({ icon, label, format, onClick }: ExportButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={styles.exportBtn}
    >
      <span className={styles.exportIcon}>{icon}</span>
      <span className={styles.exportLabel}>{label}</span>
      <span className={styles.exportFormat}>{format}</span>
    </button>
  )
}
