import ComingSoon from '../../components/cooming-soon/coming-soon';
import styles from './BoundaryConditionsView.module.css';

export default function BoundaryConditionsView() {
  return (
    <main className={styles.boundary_conditions_view}>
      <ComingSoon />
    </main>
  )
}