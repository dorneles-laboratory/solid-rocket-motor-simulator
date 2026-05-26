import styles from "./NewProjectView.module.css"
import ComingSoon from "../../components/cooming-soon/coming-soon"

export default function NewProjectView() {
  return (
    <main className={styles.new_project_view}>
      <ComingSoon />
    </main>
  )
}