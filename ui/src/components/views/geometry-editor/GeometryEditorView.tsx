import styles from './GeometryEditorView.module.css';

export default function GeometryEditorView() {
  return (
    <div className={styles.geometry_editor_view}>
      <h1>Geometry Editor</h1>
      <p>
        This section will allow you to edit the geometry of your solid rocket motor. In the future, you will be able to modify the dimensions of the motor, adjust the grain geometry, and visualize the changes in real-time.
      </p>
    </div>
  )
}