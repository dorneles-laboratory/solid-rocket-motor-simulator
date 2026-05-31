import styles from "./HomeView.module.css"
import rocketMotor from "../../assets/rocket-motor.png"
import { FooterProps } from "../../components/layout/footer/footer";
import { useEffect } from "react";
import { showToast } from "../../ui/toast/toast-container";

const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;


interface HomeViewProps {
  setFooter: (data: FooterProps) => void;
}

export default function HomeView({ setFooter }: HomeViewProps) {
  useEffect(() => {
    setFooter({
      description: "Bem vindo ao Solid Rocket Motor (SRM)",
      rightText: "Simulador de motores-foguete de propelente sólido"
    });
  }, [setFooter]);

  useEffect(() => {
    if (!isTauri) {
      showToast({
        type: "info",
        title: "Running in Web Mode",
        message: "Você está rodando a aplicação em modo Web, algumas funcionalidades podem estar limitadas. Para a melhor experiência, rode a aplicação em modo Desktop usando Tauri."
      });
    }
  }, []);
  
  return (
    <section className={styles.home_view}>
      <header className={styles.header}>
        <p className={styles.header_text}>Bem-vindo!</p>
      </header>

      <section className={styles.home_content}>
        <img
          src={rocketMotor}
          alt="Solid rocket motor"
          className={styles.rocket_image}
        />

        <div className={styles.welcome_message}>
          <h1 className={styles.title}>
            Solid Rocket Motor Simulator
          </h1>

          <p className={styles.subtitle}>
            Simule o desempenho de motores-foguete de propelente sólido
            utilizando diferentes formulações de propelente e geometrias
            internas do motor.
          </p>

          <p className={styles.description}>
            Navegue pelos módulos utilizando a barra lateral ou pressione
            <strong className={styles.keyboard_shortcut}> Ctrl + O </strong> 
            para abrir um projeto.
          </p>
        </div>
      </section>
    </section>
  )
}