import styles from './cmotors-card.module.css';
import { CommercialMotor } from '../../CommercialMotorsView';
import { GitCompare, ExternalLink } from 'lucide-react'; // CORREÇÃO: Faltava importar os ícones!

interface CMotorsCardProps {
  motor: CommercialMotor
  isSelected: boolean
  toggleMotorSelection: (id: string) => void // CORREÇÃO: Descomentado!
}

// CORREÇÃO: Extraindo as props 'isSelected' e 'toggleMotorSelection'
export default function CMotorsCard({ motor, isSelected, toggleMotorSelection }: CMotorsCardProps) {

  const getClassColor = (cls: string) => {
    const key = `class${cls}` as keyof typeof styles;
    return styles[key] || styles.classDefault;
  }

  return (
    <div
      // A prop 'key' foi movida para o pai (CommercialMotorsView) onde o .map() acontece.
      className={`${styles.card} ${isSelected ? styles.cardSelected : ""}`}
    >
      {/* Card Header */}
      <div className={styles.cardHeader}>
        <div className={styles.cardHeaderInfo}>
          <span className={styles.manufacturerText}>{motor.manufacturer}</span>
          <span className={styles.designationText}>{motor.designation}</span>
        </div>
        <span className={`${styles.badge} ${getClassColor(motor.impulseClass)}`}>
          {motor.impulseClass}
        </span>
      </div>

      {/* Card Body */}
      <div className={styles.cardBody}>
        <div className={styles.metricsRowPrimary}>
          <div className={styles.metricCol}>
            <span className={styles.metricLabelPrimary}>Impulso Total</span>
            <span className={styles.metricValuePrimary}>
              {motor.totalImpulse}
              <span className={styles.metricUnitPrimary}>N·s</span>
            </span>
          </div>
          <div className={styles.metricCol}>
            <span className={styles.metricLabelPrimary}>Empuxo Máx.</span>
            <span className={styles.metricValuePrimary}>
              {motor.maxThrust}
              <span className={styles.metricUnitPrimary}>N</span>
            </span>
          </div>
        </div>
        <div className={styles.metricsRowSecondary}>
          <div className={styles.metricCol}>
            <span className={styles.metricLabelSecondary}>Queima</span>
            <span className={styles.metricValueSecondary}>
              {motor.burnTime}s
            </span>
          </div>
          <div className={styles.metricCol}>
            <span className={styles.metricLabelSecondary}>Massa</span>
            <span className={styles.metricValueSecondary}>
              {motor.propellantMass}g
            </span>
          </div>
          <div className={styles.metricCol}>
            <span className={styles.metricLabelSecondary}>Diâm.</span>
            <span className={styles.metricValueSecondary}>
              {motor.diameter}mm
            </span>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className={styles.cardActions}>
        <button
          type="button"
          onClick={() => toggleMotorSelection(motor.id)}
          className={`${styles.actionBtn} ${styles.actionBtnCompare} ${isSelected ? styles.actionBtnCompareActive : styles.actionBtnCompareInactive}`}
        >
          <GitCompare size={12} strokeWidth={1.5} />
          {isSelected ? "Selecionado" : "Comparar"}
        </button>
        <button
          type="button"
          className={`${styles.actionBtn} ${styles.actionBtnLink}`}
        >
          <ExternalLink size={12} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}