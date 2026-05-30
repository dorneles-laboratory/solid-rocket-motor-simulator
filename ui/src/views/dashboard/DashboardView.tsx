import styles from './DashboardView.module.css'
import iconDashboard from "../../assets/dashboard.png"
import { FooterProps } from '../../components/layout/footer/footer';
import { useEffect, useState } from 'react';
import DashboardHeader from './components/dash-header/dash-header';
import { showToast } from '../../ui/toast/toast-container';
import { AlertTriangle, Layers  } from 'lucide-react';

interface DashboardViewProps {
  projectId: string | null;
  setFooter: (data: FooterProps) => void;
}

export default function DashboardView({ projectId, setFooter }: DashboardViewProps) {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setFooter({
      description: projectId 
        ? "Visualize e edite os detalhes do seu projeto." 
        : "Crie ou abra um projeto para acessar o dashboard.",
      rightText: "Em breve uma nova funcionalidade."
    });
  }, [projectId, setFooter]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/projects/${projectId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProject(data);
      }
    } catch (error) {
      console.error("Erro ao buscar projeto:", error);
      showToast({
        type: "error",
        title: "Fetch Failed",
        message: "Failed to fetch project.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={styles.dashboard_view}>
      {isLoading ? (
        <div
          style={{
            padding: "1rem",
            textAlign: "center",
            color: "var(--muted-foreground)",
          }}
        >
          Carregando dados do servidor...
        </div>
      ) : project ? (
        <>
          <DashboardHeader project={project} />

          <div className={styles.dashboardContent}>
            {/* Thrust Curve Chart */}
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <span className={styles.panelTitle}>
                  Thrust vs. Time Curve
                </span>
                <div className={styles.chartLegend}>
                  <div className={styles.legendItem}>
                    <div className={`${styles.legendColor} ${styles.colorPrimary}`} />
                    <span className={styles.legendLabel}>Thrust</span>
                  </div>
                  <div className={styles.legendItem}>
                    <div className={`${styles.legendColor} ${styles.colorBlue}`} />
                    <span className={styles.legendLabel}>Pressure</span>
                  </div>
                </div>
              </div>
              {/* Chart Area */}
              <div className={styles.chartContainer}>
                <div className={styles.chartGrid} />
                <svg className={styles.chartSvg} preserveAspectRatio="none">
                  <path
                    d="M 0 180 Q 20 180 40 100 Q 80 40 120 50 Q 200 55 280 55 Q 360 55 440 55 Q 500 55 520 60 Q 560 80 580 180"
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="2"
                    style={{ filter: "drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))" }}
                  />
                  <path
                    d="M 0 180 Q 20 180 40 100 Q 80 40 120 50 Q 200 55 280 55 Q 360 55 440 55 Q 500 55 520 60 Q 560 80 580 180 L 580 200 L 0 200 Z"
                    fill="url(#thrustGradient)"
                    opacity="0.3"
                  />
                  <defs>
                    <linearGradient id="thrustGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Y Axis Labels */}
                <div className={styles.chartAxisY}>
                  <span className={styles.axisLabel}>1200N</span>
                  <span className={styles.axisLabel}>800N</span>
                  <span className={styles.axisLabel}>400N</span>
                  <span className={styles.axisLabel}>0N</span>
                </div>
                {/* X Axis Labels */}
                <div className={styles.chartAxisX}>
                  <span className={styles.axisLabel}>0s</span>
                  <span className={styles.axisLabel}>0.5s</span>
                  <span className={styles.axisLabel}>1.0s</span>
                  <span className={styles.axisLabel}>1.5s</span>
                  <span className={styles.axisLabel}>2.0s</span>
                </div>
              </div>
            </div>

            {/* Bottom Row - Two Panels */}
            <div className={styles.grid2Cols}>
              {/* Grain Geometry Summary */}
              <div className={styles.panel}>
                <div className={styles.panelHeader} style={{ justifyContent: "flex-start" }}>
                  <div className={styles.panelTitleWrapper}>
                    <Layers className={styles.panelIcon} strokeWidth={1.5} />
                    <span className={styles.panelTitle}>
                      Current Grain Geometry
                    </span>
                  </div>
                </div>
                <div className={styles.panelBody}>
                  <div className={styles.grid2Cols}>
                    <div className={styles.geometryItem}>
                      <span className={styles.geoLabel}>Core Type</span>
                      <span className={styles.geoValue}>BATES</span>
                    </div>
                    <div className={styles.geometryItem}>
                      <span className={styles.geoLabel}>Segments</span>
                      <span className={styles.geoValue}>4</span>
                    </div>
                    <div className={styles.geometryItem}>
                      <span className={styles.geoLabel}>Outer Diameter</span>
                      <span className={styles.geoValue}>75.0 mm</span>
                    </div>
                    <div className={styles.geometryItem}>
                      <span className={styles.geoLabel}>Inner Diameter</span>
                      <span className={styles.geoValue}>20.0 mm</span>
                    </div>
                    <div className={styles.geometryItem}>
                      <span className={styles.geoLabel}>Length</span>
                      <span className={styles.geoValue}>200.0 mm</span>
                    </div>
                    <div className={styles.geometryItem}>
                      <span className={styles.geoLabel}>Propellant Mass</span>
                      <span className={styles.geoValue}>1.24 kg</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Warnings/Alerts */}
              <div className={styles.panel}>
                <div className={styles.panelHeader} style={{ justifyContent: "flex-start" }}>
                  <div className={styles.panelTitleWrapper}>
                    <AlertTriangle className={styles.panelIcon} strokeWidth={1.5} />
                    <span className={styles.panelTitle}>
                      Recent Warnings & Alerts
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
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