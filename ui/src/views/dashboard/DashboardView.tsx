import { useEffect, useState } from "react";
import styles from "./DashboardView.module.css";
import iconDashboard from "../../assets/dashboard.png";
import { FooterProps } from "../../components/layout/footer/footer";
import { showToast } from "../../ui/toast/toast-container";
import {
  AlertTriangle,
  Flame,
  Gauge,
  Layers,
  LineChart,
  Settings,
  Timer,
  Zap,
} from "lucide-react";
import DashboardInputPanel from "./components/dash-input-data/dash-input";
import DashboardPanel from "./components/dash-panel/dash-panel";
import MotorGeometry, { FocusedSection, MotorDimensions } from "./components/dash-motor-geometry/dash-motor-geometry";
import DashboardHeader from "./components/dash-header/dash-header";
import MetricCard from "./components/dash-metric-card/dash-metric-card";
import ClassBadge from "./components/dash-class-badge/dash-class-badge";
import { ProjectStatus } from "../open-project/components/o-proj-card/o-proj-card";
import { Propellant } from "../propellants/PropellantsView";

// ==========================================
// 1. TIPAGENS (INTERFACES)
// ==========================================

export interface ProjectData {
  name: string;
  author?: string;
  missionObjective?: string;
  maxDiameter: number;
  maxLength?: number;
  propellantId: string;
  targetImpulse?: number;
  targetBurnTime?: number;
  maxThrust?: number;
  status: ProjectStatus;

  motorChamberDiameter: number;
  motorChamberLength: number;
  grainOuterDiameter: number;
  grainInnerDiameter: number;
  grainSegmentsLength: number;
  grainSegments: number;
  nozzleThroatDiameter: number;
  nozzleConvergenceAngle: number;
  nozzleDivergenceAngle: number;
}

type AlertType = "error" | "warning" | "note" | "info";

export interface AlertMessage {
  id: string;
  title?: string;
  message: string;
  type: AlertType;
  time: string;
}

// interface SimulationData {
//   alerts?: AlertMessage[];
//   thrustData: { x: number; y: number }[];
//   pressureData: { x: number; y: number }[];
//   pointsCount: number;
// }

interface DashboardViewProps {
  projectId: string | null;
  setFooter: (data: FooterProps) => void;
}

// ==========================================
// 2. UTILITÁRIOS (FUNÇÕES PURAS)
// ==========================================

// Movidada para fora do componente para evitar recriação desnecessária a cada render
const getPanelVariant = (type: string): 'Warning' | 'Info' | 'Success' | 'Critical' | undefined => {
  switch (type) {
    case 'error': return 'Critical';
    case 'warning': return 'Warning';
    case 'success': return 'Success';
    case 'info': 
    case 'note': return 'Info';
    default: return undefined;
  }
};

// ==========================================
// 3. COMPONENTE PRINCIPAL
// ==========================================

export default function DashboardView({
  projectId,
  setFooter,
}: DashboardViewProps) {
  
  // --- ESTADOS ---
  const [project, setProject] = useState<ProjectData | null>(null);
  const [propellant, setPropellant] = useState<Propellant | null>(null);
  // const [simulationData, setSimulationData] = useState<SimulationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [simulationRun, setSimulationRun] = useState(false);
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);
  const [focusedSection, setFocusedSection] = useState<FocusedSection>(null);

  // --- EFEITOS (LIFECYCLE) ---
  useEffect(() => {
    setFooter({
      description: projectId
        ? "Visualize e edite os detalhes do seu projeto."
        : "Crie ou abra um projeto para acessar o dashboard.",
      rightText: "Em breve uma nova funcionalidade.",
    });
  }, [projectId, setFooter]);

  useEffect(() => {
    fetchProjects();
  }, [projectId]);

  useEffect(() => {
    if (project?.propellantId) {
      fetchPropellants(project.propellantId);
    }
  }, [project?.propellantId]);

  // --- FUNÇÕES DE DADOS (FETCH) ---
  const fetchProjects = async () => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8080/api/projects/${projectId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setProject(data);
      } else {
        throw new Error("Falha ao buscar dados");
      }
    } catch (error) {
      console.error("Erro ao buscar projeto:", error);
      showToast({
        type: "error",
        title: "Erro de Comunicação",
        message: "Não foi possível carregar o projeto.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPropellants = async (propellantId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/propellants/${propellantId}`);
      
      // Se o banco de dados não achar o ID (404 Not Found)
      if (response.status === 404) {
        console.warn(`Aviso: Propelente ${propellantId} não existe mais no banco de dados.`);
        setPropellant(null);
        return; 
      }

      if (response.ok) {
        const data = await response.json();
        setPropellant(data);
      } else {
        throw new Error("Falha ao buscar dados do propelente");
      }
    } catch (error) {
      console.error(error);
      showToast({
        type: "error",
        title: "Erro no Propelente",
        message: "Falha na comunicação ao carregar o propelente.",
      });
      setPropellant(null);
    }
  };

  const handleDimensionsChange = (newDims: MotorDimensions) => {
    if (!project) return;

    const limitDiameter = project.maxDiameter || 0;
    const limitLength = project.maxLength ? project.maxLength : Infinity;

    // Array temporário que vai guardar apenas os erros atuais
    const currentActiveAlerts: AlertMessage[] = [];

    // Regra: Diâmetro
    if (limitDiameter > 0 && newDims.chamberDiameter > limitDiameter) {
      currentActiveAlerts.push({
        id: 'diameter-limit',
        title: 'Diâmetro Excedido',
        message: `Diâmetro da carcaça (${newDims.chamberDiameter}mm) maior que o permitido (${limitDiameter}mm).`,
        type: 'warning',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }

    // Regra: Comprimento
    if (limitLength > 0 && newDims.chamberLength > limitLength) {
      currentActiveAlerts.push({
        id: 'length-limit',
        title: 'Comprimento Excedido',
        message: `Comprimento da carcaça (${newDims.chamberLength}mm) maior que o permitido (${limitLength}mm).`,
        type: 'warning',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }

    // Regra: Diâmetro do grão não pode ser maior que o da carcaça
    if (limitDiameter > 0 && newDims.grainOuterDiameter > limitDiameter) {
      currentActiveAlerts.push({
        id: 'diameter-grain-limit',
        title: 'Diâmetro do Grão Excedido',
        message: `Diâmetro do grão (${newDims.grainOuterDiameter}mm) maior que o diâmetro interno da carcaça (${limitDiameter}mm).`,
        type: 'error',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }

    // Compara os erros novos com os que já estavam na tela
    currentActiveAlerts.forEach(newAlert => {
      const alreadyNotified = alerts.some(existingAlert => existingAlert.id === newAlert.id);
      
      if (!alreadyNotified) {
        showToast({
          type: newAlert.type === 'error' ? 'error' : 'warning',
          title: newAlert.title || '',
          message: newAlert.message,
        });
      }
    });

    setAlerts(currentActiveAlerts);

    // Atualiza o projeto
    setProject({
      ...project,
      motorChamberDiameter: newDims.chamberDiameter,
      motorChamberLength: newDims.chamberLength,
      grainOuterDiameter: newDims.grainOuterDiameter,
      grainInnerDiameter: newDims.grainCoreDiameter,
      grainSegmentsLength: newDims.grainLength,
      nozzleThroatDiameter: newDims.throatDiameter,
      nozzleConvergenceAngle: newDims.convergenceAngle,
      nozzleDivergenceAngle: newDims.divergenceAngle,
    });
  };

  return (
    <section className={styles.dashboardView}>
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
        <div className={styles.dashboardLayout}>
          <DashboardInputPanel 
            dimensions={
              project ? {
                chamberDiameter: project.motorChamberDiameter,
                chamberLength: project.motorChamberLength,
                grainOuterDiameter: project.grainOuterDiameter,
                grainCoreDiameter: project.grainInnerDiameter,
                grainLength: project.grainSegmentsLength,
                throatDiameter: project.nozzleThroatDiameter,
                convergenceAngle: project.nozzleConvergenceAngle,
                divergenceAngle: project.nozzleDivergenceAngle
              } : undefined
            } 
            onFocusChange={setFocusedSection}
            propellant={propellant || undefined}
            onDimensionsChange={handleDimensionsChange}
          />

          <div className={styles.divider}>
            {/* <DashboardHeader project={project} /> */}

            <div className={styles.dashboardContent}>
              {/* Painel com o Esquema do Motor */}
              <DashboardPanel
                type="custom"
                panelTitle="Motor Geometry"
                icon={
                  <Settings
                    className={styles.panelIcon}
                    strokeWidth={1.5}
                    style={{ color: "var(--chart-1)" }}
                  />
                }
              >
                <MotorGeometry  
                  dimensions={
                    project ? {
                      chamberDiameter: project.motorChamberDiameter || 0,
                      chamberLength: project.motorChamberLength || 0,
                      grainOuterDiameter: project.grainOuterDiameter || 0,
                      grainCoreDiameter: project.grainInnerDiameter || 0,
                      grainLength: project.grainSegmentsLength || 0,
                      throatDiameter: project.nozzleThroatDiameter || 0,
                      convergenceAngle: project.nozzleConvergenceAngle || 0,
                      divergenceAngle: project.nozzleDivergenceAngle || 0
                    } : undefined
                  }
                  focusedSection={focusedSection}
                />
              </DashboardPanel>

              <div className={styles.resultsStatus}>
                <span className={styles.statusTitle}>
                  Resultados da Simulação
                </span>
                {!simulationRun && (
                  <div className={styles.statusWrapper}>
                    <div className={styles.pulseIndicator} />
                    <span className={styles.statusText}>Incompleto</span>
                  </div>
                )}
              </div>

              {/* Metrics Grid */}
              <div className={styles.metricsGrid}>
                <MetricCard
                  title="Impulso Total"
                  value={simulationRun ? "433.2" : "---"}
                  unit="N·s"
                  icon={<Flame size={16} />}
                />
                <MetricCard
                  title="Empuxo Medio"
                  value={simulationRun ? "343.8" : "---"}
                  unit="N"
                  icon={<Gauge size={16} />}
                />
                <MetricCard
                  title="Empuxo Max."
                  value={simulationRun ? "382.1" : "---"}
                  unit="N"
                  icon={<Zap size={16} />}
                />
                <MetricCard
                  title="ISP"
                  value={simulationRun ? "118.5" : "---"}
                  unit="s"
                  icon={<Timer size={16} />}
                />
                <ClassBadge value="I" simulationRun={simulationRun} />
              </div>

              {/* {simulationRun ? (
                <DashboardPanel
                  type="graphic"
                  panelTitle="Curva de Empuxo / Pressão"
                  icon={
                    <LineChart
                      className={styles.panelIcon}
                      strokeWidth={1.5}
                      style={{ color: "var(--chart-2)" }}
                    />
                  }
                  xRange={[0, 2.0]}
                  xAxisUnit="s"
                  yRange={[0, 1500]}
                  yAxisUnit="N"
                  rightText={`${simulationData?.pointsCount || 0} pontos coletados`}
                  legends={[
                    {
                      label: "Empuxo",
                      color: "#f97316",
                      data: simulationData?.thrustData || [],
                    },
                    {
                      label: "Pressão",
                      color: "#22c55e",
                      data: simulationData?.pressureData || [],
                    },
                  ]}
                />
              ) : (
                <DashboardPanel
                  type="text"
                  panelTitle="Curva de Empuxo / Pressão"
                  icon={
                    <LineChart
                      className={styles.panelIcon}
                      strokeWidth={1.5}
                      style={{ color: "var(--chart-2)" }}
                    />
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "1rem",
                      padding: "1rem 0",
                      height: "100%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          width: "4rem",
                          height: "4rem",
                          border:
                            "1px dashed color-mix(in srgb, var(--chart-1) 50%, transparent)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "2rem",
                            height: "2rem",
                            border:
                              "1px solid color-mix(in srgb, var(--chart-2) 30%, transparent)",
                          }}
                        />
                      </div>

                      <p
                        style={{
                          fontFamily: "monospace",
                          fontSize: "12px",
                          color: "var(--muted-foreground)",
                          margin: 0,
                        }}
                      >
                        Execute a simulacao para visualizar os resultados
                      </p>
                    </div>
                  </div>
                </DashboardPanel>
              )} */}

              <div className={styles.grid2Cols}>
                {/* {simulationRun ? (
                  <DashboardPanel
                    type="data"
                    panelTitle="Current Grain Geometry"
                    icon={
                      <Layers
                        className={styles.panelIcon}
                        strokeWidth={1.5}
                        style={{ color: "var(--chart-4)" }}
                      />
                    }
                    dataItems={[
                      {
                        label: "Core Type",
                        value: project?.geometry?.coreType || "N/A",
                      },
                      {
                        label: "Segments",
                        value: project?.geometry?.segments || 0,
                      },
                      {
                        label: "Outer Diameter",
                        value: `${project?.outerDiameter || 0} mm`,
                      },
                      {
                        label: "Inner Diameter",
                        value: `${project?.geometry?.innerDiameter || 0} mm`,
                      },
                      {
                        label: "Length",
                        value: `${project?.geometry?.length || 0} mm`,
                      },
                      {
                        label: "Propellant Mass",
                        value: `${project?.geometry?.propellantMass || 0} kg`,
                      },
                    ]}
                  />
                ) : (
                  <DashboardPanel
                    type="text"
                    panelTitle="Current Grain Geometry"
                    icon={
                      <Layers
                        className={styles.panelIcon}
                        strokeWidth={1.5}
                        style={{ color: "var(--chart-4)" }}
                      />
                    }
                    textItems={[
                      {
                        text: "Execute a simulacao para visualizar os dados da geometria atual do grão.",
                      },
                    ]}
                  />
                )} */}

                <DashboardPanel
                  type="text"
                  panelTitle="Recent Warnings & Alerts"
                  icon={
                    <AlertTriangle
                      className={styles.panelIcon}
                      strokeWidth={1.5}
                      style={{ color: "var(--warning)" }}
                    />
                  }
                  textItems={
                    alerts.map((alert) => ({
                      text: alert.message,
                      variant: getPanelVariant(alert.type),
                      icon: alert.type === 'error' ? <AlertTriangle size={16} /> :
                            alert.type === 'warning' ? <AlertTriangle size={16} /> :
                            alert.type === 'info' ? <Layers size={16} /> :
                            alert.type === 'note' ? <Settings size={16} /> : undefined,
                      time: alert.time
                    }))
                  }
                />
              </div>
            </div>
          </div>
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
                Nenhum projeto aberto no momento!
              </h1>

              <p className={styles.noItensSubtitle}>
                Abra um projeto existente ou crie um novo para acessar o
                dashboard. Aperte{" "}
                <strong className={styles.keyboard_shortcut}>
                  {" "}
                  Ctrl + N{" "}
                </strong>{" "}
                para criar um novo projeto. Ou{" "}
                <strong className={styles.keyboard_shortcut}>
                  {" "}
                  Ctrl + O{" "}
                </strong>{" "}
                para abrir um projeto existente.
              </p>
            </div>
          </div>
        </section>
      )}
    </section>
  );
}
