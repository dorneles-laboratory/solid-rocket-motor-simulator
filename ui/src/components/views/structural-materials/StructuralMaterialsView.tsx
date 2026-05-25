import styles from './StructuralMaterialsView.module.css';

export default function StructuralMaterialsView() {
  return (
    <div className={styles.structural_materials_view}>
      <h1>Structural Materials</h1>
      <p>
        This section will allow you to manage the structural materials used in your simulations. You will be able to add new materials, edit their properties, and organize them into categories for easy access during the design process.
      </p>
    </div>
  );
}