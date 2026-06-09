import styles from "./dash-input-header.module.css"

export default function DashboardInputHeader() {
  return (
    <header className={styles.header}>
      <h2 className={styles.headerTitle}>
        Propriedades
      </h2>
      <div className={styles.statusIndicator}>
        <div className={styles.statusDot} />
      </div>
    </header>
  );
}