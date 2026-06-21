import { useEffect, useState } from "react";
import styles from "./HomeView.module.css";
import rocketMotor from "../../assets/rocket-motor.png";
import { FooterProps } from "../../components/layout/footer/footer";
import { showToast } from "../../ui/toast/toast-container";
import { ProjectData } from "../dashboard/DashboardView";
import { HomeCardLastProject } from "./components/home-card-last-project";
import { formatDate } from "../../utils/formatDate";
import { getBaseUrl } from "../../api/api";

const isTauri =
  typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

interface HomeViewProps {
  setFooter: (data: FooterProps) => void;
  onNavigate: (projectId: string) => void;
}

export default function HomeView({ setFooter, onNavigate }: HomeViewProps) {
  const [projects, setProjects] = useState<ProjectData[]>([]);

  // Configuração do Footer
  useEffect(() => {
    setFooter({
      description: "Bem vindo ao Solid Rocket Motor (SRM)",
      rightText: "Simulador de motores-foguete de propelente sólido",
    });
  }, [setFooter]);

  // Verificação de ambiente e busca de dados
  useEffect(() => {
    if (!isTauri) {
      showToast({
        type: "info",
        title: "Running in Web Mode",
        message:
          "Você está rodando a aplicação em modo Web, algumas funcionalidades podem estar limitadas. Para a melhor experiência, rode a aplicação em modo Desktop usando Tauri.",
      });
    }

    const fetchLastProject = async () => {
      try {
        const baseUrl = await getBaseUrl();
        const response = await fetch(`${baseUrl}/api/projects/recent`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Falha ao buscar dados da API");
        }

        const data = await response.json();
        setProjects(data);
      } catch (error) {
        showToast({
          type: "error",
          title: "Erro de Comunicação",
          message: "Não foi possível carregar os projetos recentes.",
        });
        console.error("Error fetching recent projects:", error);
      }
    };

    fetchLastProject();
  }, []);

  return (
    <section className={styles.home_view}>
      <section className={styles.welcome_section}>
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
            <h1 className={styles.title}>Solid Rocket Motor Simulator</h1>

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

      {projects.length > 0 && (
        <section className={styles.recent_section}>
          <h2 className={styles.section_title}>Últimos Projetos</h2>
          <div className={styles.last_projects}>
            {projects.map((project) => (
              <HomeCardLastProject
                key={project.id}
                projectName={project.name}
                impulseClass={project.impulseClass}
                lastOpenedAt={formatDate(project.lastOpenedAt)}
                onClick={() => onNavigate(`/dashboard?projectId=${project.id}`)}
              />
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
