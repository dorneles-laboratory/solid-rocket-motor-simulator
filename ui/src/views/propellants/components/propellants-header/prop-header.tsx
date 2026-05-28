import styles from "./prop-header.module.css"

export default function PropellantsHeader() {
  return (
    <header className={styles.tableHeader}>  
      <span>
        Nome do Propelente
      </span>

      <span className={styles.headerRight}>
        Densidade
      </span>

      <span className={styles.headerRight}>
        {"Coef. Queima 'a'"}
      </span>

      <span className={styles.headerRight}>
        {"Expoente 'n'"}
      </span>

      <span className={styles.headerRight}>
        Isp Teórico
      </span>

      <span className={styles.headerCenter}>
        Tipo
      </span>

      <span className={styles.headerCenter}>
        Ações
      </span>
    </header>
  )
}