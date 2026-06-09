import styles from './dash-metric-card.module.css';

interface MetricCardProps {
  title: string
  value: string
  unit: string
  icon: React.ReactNode
  highlight?: boolean
}

export default function MetricCard({ title, value, unit, icon, highlight = false }: MetricCardProps) {
  const cardClass = highlight ? styles.metricCardHighlight : styles.metricCardNormal
  const iconWrapperClass = highlight ? styles.mcIconWrapperHighlight : styles.mcIconWrapperNormal
  const valueClass = highlight ? styles.mcValueHighlight : styles.mcValueNormal
  const cornerClass = highlight ? styles.mcCornerHighlight : styles.mcCornerNormal

  return (
    <div className={`${styles.metricCard} ${cardClass}`}>
      {/* Icon Badge */}
      <div className={`${styles.mcIconWrapper} ${iconWrapperClass}`}>
        {icon}
      </div>

      {/* Label */}
      <span className={styles.mcLabel}>
        {title}
      </span>

      {/* Value */}
      <div className={styles.mcValueContainer}>
        <span className={`${styles.mcValue} ${valueClass}`}>
          {value}
        </span>
        {unit && (
          <span className={styles.mcUnit}>{unit}</span>
        )}
      </div>

      {/* Decorative corner */}
      <div className={`${styles.mcCorner} ${cornerClass}`} />
    </div>
  )
}
