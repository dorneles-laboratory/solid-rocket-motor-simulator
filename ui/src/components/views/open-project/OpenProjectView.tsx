import styles from "./OpenProjectView.module.css"

export default function OpenProjectView() {
  return (
    <div className={styles.open_project_container}>
      <h1>Open Project</h1>
      <p>
        This section will allow you to open an existing project. Soon, you will be able to browse your saved projects, select one to open, and continue working on it.
      </p>
    </div>    
  )
}