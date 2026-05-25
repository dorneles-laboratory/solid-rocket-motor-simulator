import styles from './ReportsView.module.css';

export default function ReportsView() {
  return (
    <div className={styles.reports_view}>
      <h1>Reports</h1>
      <p>
        This section will allow you to generate and view reports based on your simulation results. In the future, you will be able to customize the report content, format, and export options.
      </p>
    </div>
  );
}