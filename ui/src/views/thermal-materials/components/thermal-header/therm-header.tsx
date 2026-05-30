import styles from "./therm-header.module.css"

export default function ThermalHeader() {
  return (
    <header className={styles.tableHeader}>  
      <span>
        Nome do Material
      </span>

      <span className={styles.headerRight}>
        Condutividade Térmica
      </span>

      <span className={styles.headerRight}>
        Calor Específico
      </span>

      <span className={styles.headerRight}>
        Densidade
      </span>

      <span className={styles.headerRight}>
        Temperatura Máxima de Serviço
      </span>

      <span className={styles.headerCenter}>
        Aplicações
      </span>

      <span className={styles.headerCenter}>
        Ações
      </span>
    </header>
  )
}