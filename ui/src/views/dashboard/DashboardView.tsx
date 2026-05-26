import ComingSoon from '../../components/cooming-soon/coming-soon'
import styles from './DashboardView.module.css'

export default function DashboardView() {
  return (
    <main className={styles.dashboard_view}>
      <ComingSoon />
    </main>
  )
}