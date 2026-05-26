import ComingSoon from "../../components/cooming-soon/coming-soon"
import styles from "./SettingsView.module.css"

export default function Settings() {
  return (
    <main className={styles.settings_view}>
      <ComingSoon />
    </main>
  )
}