import styles from "./dash-class-badge.module.css";
import { Badge } from "../../../../ui/badge/badge";

interface ClassBadgeProps {
  value: string;
  simulationRun?: boolean;
}

export default function ClassBadge({ value, simulationRun }: ClassBadgeProps) {
  const containerClass = simulationRun
    ? styles.classBadgeHighlight
    : styles.classBadgeNormal;

  return (
    <div className={`${styles.classBadge} ${containerClass}`}>
      <span className={styles.cbLabel}>Classe</span>
      {simulationRun ? (
        <Badge variant="default" className={styles.cbActiveBadgeExt}>
          {value}
        </Badge>
      ) : (
        <div className={styles.cbInactiveWrapper}>
          <span className={styles.cbInactiveText}>---</span>
        </div>
      )}
    </div>
  );
}
