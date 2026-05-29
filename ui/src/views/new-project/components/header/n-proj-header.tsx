import styles from './n-proj-header.module.css'
import { Rocket } from 'lucide-react'

export default function NewProjectHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.iconWrapper}>
        <Rocket
          className={styles.headerIcon}
          strokeWidth={1.5}
        />
      </div>

      <div className={styles.headerContent}>
        <h1 className={styles.title}>
          Create New Motor Design
        </h1>

        <p className={styles.description}>
          Configure your solid rocket motor
          project
        </p>
      </div>
    </header>
  )
}