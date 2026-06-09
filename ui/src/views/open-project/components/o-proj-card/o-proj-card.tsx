import styles from "./o-proj-card.module.css";
import {
  FileDigit,
  Clock,
  ExternalLink,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  LucideIcon,
} from "lucide-react";
import { Button } from "../../../../ui/button/button";
import { showToast } from "../../../../ui/toast/toast-container";
import { Project } from "../../OpenProjectView";
import { formatDate } from "../../../../utils/formatDate";

export type ImpulseClass =
  | "-"
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O";
export type ProjectStatus = "in-progress" | "optimized" | "tested" | "draft";

interface OpenProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
  onNavigate: (view: string) => void;
}

type StatusData = {
  label: string;
  icon: LucideIcon;
};

const statusConfig: Record<ProjectStatus, StatusData> = {
  "in-progress": {
    label: "In Progress",
    icon: Loader2,
  },
  optimized: {
    label: "Optimized",
    icon: CheckCircle2,
  },
  tested: {
    label: "Tested",
    icon: CheckCircle2,
  },
  draft: {
    label: "Draft",
    icon: AlertCircle,
  },
};

export default function OpenProjectCard({
  project,
  onDelete,
  onNavigate,
}: OpenProjectCardProps) {
    const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/projects/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        showToast({
          type: "success",
          title: "Deleted",
          message: "Project deleted successfully.",
        });

        onDelete(id);
      } else {
        showToast({
          type: "error",
          title: "Deletion Failed",
          message: "Failed to delete project.",
        });
      }
    } catch (error) {
      showToast({
        type: "error",
        title: "Deletion Failed",
        message: "Failed to delete project.",
      });
    }
  };

  const status = statusConfig[project.status] || statusConfig["draft"];
  const StatusIcon = status.icon;

  return (
    <div key={project.id} className={styles.projectCard}>
      {/* CARD HEADER */}
      <div className={styles.cardHeader}>
        <div className={styles.fileIconWrapper}>
          <FileDigit className={styles.fileIcon} strokeWidth={1.5} />
        </div>

        <div className={styles.cardContent}>
          <h3 className={styles.projectName}>{project.name}</h3>

          <div className={styles.projectMeta}>
            <span className={styles.impulseClass}>{project.impulseClass}</span>

            <span className={styles.date}>
              <Clock className={styles.dateIcon} strokeWidth={1.5} />

              {formatDate(project.updatedAt)}
            </span>
          </div>
        </div>
      </div>

      {/* CARD FOOTER */}
      <div className={styles.cardFooter}>
        <span
          className={`
            ${styles.status}
            ${styles[project.status]}
          `}
        >
          <StatusIcon
            className={`
              ${styles.statusIcon}
              ${project.status === "in-progress" ? styles.spinning : ""}
            `}
          />

          {status.label}
        </span>

        <div className={styles.actions}>
          <Button
            variant="ghost"
            size="icon"
            className={styles.actionButton}
            onClick={() => onNavigate(project.id)}
          >
            <ExternalLink className={styles.actionIcon} strokeWidth={1.5} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={`${styles.actionButton} ${styles.deleteButton}`}
            onClick={() => handleDelete(project.id)}
          >
            <Trash2 className={styles.actionIcon} strokeWidth={1.5} />
          </Button>
        </div>
      </div>
    </div>
  );
}
