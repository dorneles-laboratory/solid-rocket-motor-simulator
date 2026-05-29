import styles from './DashboardView.module.css'
import iconDashboard from "../../assets/dashboard.png"
import { FooterProps } from '../../components/layout/footer/footer';
import { useEffect } from 'react';

interface DashboardViewProps {
  projectId: string | null;
  setFooter: (data: FooterProps) => void;
}

export default function DashboardView({ projectId, setFooter }: DashboardViewProps) {
  useEffect(() => {
  setFooter({
    description: projectId 
      ? "Visualize e edite os detalhes do seu projeto." 
      : "Crie ou abra um projeto para acessar o dashboard.",
    rightText: "Em breve uma nova funcionalidade."
  });
}, [projectId, setFooter]);

  return (
    <section className={styles.dashboard_view}>
      {projectId ? (
        <div className={styles.content}>
          <h1>Dashboard do Projeto</h1>
          <p>Aqui você pode visualizar e editar os detalhes do seu projeto.</p>
        </div>
      ) : (
        <section className={styles.noItensGrid}>
          <div>
            <img
              src={iconDashboard}
              alt="Solid rocket motor"
              className={styles.rocket_image}
            />

            <div className={styles.noItensMessage}>
              <h1 className={styles.noItensTitle}>
                Nenhum projeto aberto!
              </h1>

              <p className={styles.noItensSubtitle}>
                Crie ou um novo projeto ou abra um existente para acessar o dashboard do projeto. Aperte{" "}
                <strong className={styles.keyboard_shortcut}> Ctrl + O </strong>{" "}
                para abrir um projeto existente.
              </p>
            </div>
          </div>
        </section>
      )}
    </section>
  )
}