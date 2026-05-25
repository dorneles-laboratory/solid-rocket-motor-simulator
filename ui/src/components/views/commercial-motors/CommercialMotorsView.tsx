import styles from './CommercialMotorsView.module.css';

export default function CommercialMotorsView() {
  return (
    <div className={styles.commercial_motors_view}>
      <h1>Commercial Motors</h1>
      <p>
        This section will allow you to explore a library of commercial solid rocket motors. You will be able to view detailed information about each motor, including its performance characteristics, dimensions, and propellant formulation. In the future, you will also be able to compare different motors and select one for your simulation.
      </p>
    </div>
  )
}