import { FileText } from "lucide-react"
import styles from "./generate-pdf-button.module.css"

interface ExportPDFButtonProps {
  selectedCount: number
}

export default function ExportPDFButton({ selectedCount }: ExportPDFButtonProps) {
  return (
    <button
      type="button"
      className={styles.generatePdfBtn}
      disabled={selectedCount === 0}
    >
      <FileText size={16} strokeWidth={1.5} />
      Generate PDF Report
      {selectedCount > 0 && (
        <span className={styles.generatePdfBadge}>
          {selectedCount}
        </span>
      )}
    </button>
  )
}