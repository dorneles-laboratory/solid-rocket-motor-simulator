import styles from "./SettingsView.module.css"

export default function Settings() {
  return (
    <div className={styles.settings_view}>
      <h1>Settings</h1>
      <p>
        This section will allow you to configure the settings for the Solid Rocket Motor Simulator. Here you can adjust various parameters to customize your simulation experience.
      </p>
    </div>
  )
}