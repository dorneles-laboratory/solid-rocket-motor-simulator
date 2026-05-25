import styles from './DashboardView.module.css'

export default function DashboardView() {
  return (
    <div className={styles.dashboard_view}>
      <h1>Dashboard</h1>
      <p>Bem-vindo ao simulador de motores de foguete! Selecione uma opção no menu para começar.</p>
    </div>
  )
}