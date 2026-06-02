import styles from "./dash-header.module.css";
import { ProjectData } from "../../../new-project/NewProjectView";

interface DashboardHeaderProps {
  project: ProjectData;
}

export default function DashboardHeader({ project }: DashboardHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerInfo}>
        <h1 className={styles.headerTitle}>{project.name}</h1>
      </div>

      <span className={styles.impulseClass}>CLASS K</span>
    </header>
  );
}
