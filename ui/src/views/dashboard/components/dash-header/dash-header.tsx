import styles from "./dash-header.module.css";
import { Project } from "../../../open-project/OpenProjectView";

interface DashboardHeaderProps {
  project: Project;
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
