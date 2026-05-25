import styles from './ThermalMaterialsView.module.css';

export default function ThermalMaterialsView() {
  return (
    <div className={styles.thermal_materials_view}>
      <h1>Thermal Materials</h1>
      <p>
        This section will allow you to explore different thermal materials and their properties. In the future, you will be able to create custom thermal material formulations, view their performance characteristics, and compare them against standard formulations.
      </p>
    </div>
  )
}