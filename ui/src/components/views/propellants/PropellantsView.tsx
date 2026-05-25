import styles from "./Propellants.module.css"

export default function PropellantsView() {
  return (
    <div className={styles.propellants_container}>
      <h1>Propellants</h1>
      <p>
        This section will allow you to explore different propellant formulations and their properties. In the future, you will be able to create custom propellant formulations, view their performance characteristics, and compare them against standard formulations.
      </p>
    </div>
  )
}