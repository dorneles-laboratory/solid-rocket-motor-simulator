import styles from "./home-card-last-project.module.css";

export interface HomeCardLastProjectProps {
  projectName: string;
  impulseClass?: string;
  lastOpenedAt: string;
  onClick: () => void;
}

export function HomeCardLastProject({
  projectName,
  impulseClass,
  lastOpenedAt,
  onClick
}: HomeCardLastProjectProps) {
  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.projectName}>{projectName}</h2>

          {impulseClass && (
            <span className={styles.impulseClass}>
              {impulseClass}
            </span>
          )}
        </div>

        <p className={styles.lastOpened}>
          Última abertura • {lastOpenedAt}
        </p>
      </div>
    </div>
  );
}