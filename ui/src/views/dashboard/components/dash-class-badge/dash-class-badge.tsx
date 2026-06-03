import styles from "./dash-class-badge.module.css";
import { Badge } from "../../../../ui/badge/badge";

interface ClassBadgeProps {
  value: string;
  simulationData?: boolean;
}

export default function ClassBadge({ value, simulationData }: ClassBadgeProps) {
  const containerClass = simulationData
    ? styles.classBadgeHighlight
    : styles.classBadgeNormal;

  return (
    <div className={`${styles.classBadge} ${containerClass}`}>
      <span className={styles.cbLabel}>Classe</span>
      {simulationData ? (
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
