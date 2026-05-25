import styles from "./NewProjectView.module.css"

export default function NewProjectView() {
  return (
    <div className={styles.new_project_view}>
      <h1>New Project</h1>
      <p>
        This is where you can create a new project. In the future, this section will allow you to input various parameters for your solid rocket motor simulation, such as propellant formulation, motor geometry, and simulation settings.
      </p>
    </div>
  )
}