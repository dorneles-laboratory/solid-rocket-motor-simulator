import styles from "./struct-header.module.css"

export default function StructuralHeader() {
  return (
    <header className={styles.tableHeader}>  
      <span>
        Nome do Material
      </span>

      <span className={styles.headerRight}>
        Yield Strength
      </span>

      <span className={styles.headerRight}>
        Ultimate Tensile
      </span>

      <span className={styles.headerRight}>
        Densidade
      </span>

      <span className={styles.headerRight}>
        Módulo Elástico
      </span>

      <span className={styles.headerCenter}>
        Ações
      </span>
    </header>
  )
}