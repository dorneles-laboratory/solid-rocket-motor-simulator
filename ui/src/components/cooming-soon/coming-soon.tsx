import styles from "./coming-soon.module.css"
import rocket from "../../assets/em-breve.png"

export default function ComingSoon() {
  return (
    <section className={styles.placeholder_view}>
      <div>
        <img
          src={rocket}
          alt="Solid rocket motor"
          className={styles.rocket_image}
        />

        <div className={styles.placeholder_message}>
          <h1 className={styles.placeholder_title}>
            Nova funcionalidade em desenvolvimento!
          </h1>

          <p className={styles.subtitle}>
            Estamos trabalhando para trazer esta funcionalidade em breve. Fique atento às atualizações!
          </p>
        </div>
      </div>
    </section>
  )
}