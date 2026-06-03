import { CloudCheck, CloudUpload, Cloud } from "lucide-react";
import styles from "./dash-header.module.css";

export type SaveStatus = "saved" | "saving" | "unsaved";

interface DashboardHeaderProps {
  project_name: string;
  project_class?: string;
  saveStatus?: SaveStatus;
  onSave: () => void;
}

export default function DashboardHeader({
  project_name,
  project_class,
  saveStatus = "saved",
  onSave,
}: DashboardHeaderProps) {
  const statusConfig = {
    saved: { Icon: CloudCheck, text: "Salvo" },
    saving: { Icon: CloudUpload, text: "Salvando..." },
    unsaved: { Icon: Cloud, text: "Alterações pendentes" },
  };

  const { Icon, text } = statusConfig[saveStatus];

  const isButtonDisabled = saveStatus === "saved" || saveStatus === "saving";

  return (
    <header className={styles.header}>
      <div className={styles.headerInfo}>
        <h1 className={styles.headerTitle}>{project_name}</h1>
        <span className={styles.impulseClass}>{project_class}</span>
      </div>

      <div className={styles.actionsContainer}>
        <div className={`${styles.statusCloud} ${styles[saveStatus]}`}>
          <Icon size={18} strokeWidth={2.5} />
          <span className={styles.statusText}>{text}</span>
        </div>

        <button 
          type="button" 
          className={styles.applyButton}
          onClick={onSave}
          disabled={isButtonDisabled}
          style={{ opacity: isButtonDisabled ? 0.5 : 1, cursor: isButtonDisabled ? "not-allowed" : "pointer" }}
        >
          {saveStatus === "saving" ? "Salvando..." : "Apply Changes"}
        </button>
      </div>
    </header>
  );
}