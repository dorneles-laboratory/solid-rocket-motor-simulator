import { useEffect, useMemo, useState } from "react";
import isEqual from "fast-deep-equal";
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
import MotorGeometry, {
  FocusedSection,
  MotorDimensions,
} from "./components/dash-motor-geometry/dash-motor-geometry";
import DashboardHeader, {
  SaveStatus,
} from "./components/dash-header/dash-header";
import MetricCard from "./components/dash-metric-card/dash-metric-card";
import ClassBadge from "./components/dash-class-badge/dash-class-badge";
import { ProjectStatus } from "../open-project/components/o-proj-card/o-proj-card";
import { Propellant } from "../propellants/PropellantsView";
import {
  runMotorSimulation,
  SimulationResult,
  SimulationConfig,
} from "../../utils/simulation";
import { SettingsData } from "../settings/SettingsView";
import GrainGeometry from "./components/dash-grain-geometry/dash-grain-geometry";
import { getBaseUrl } from "../../api/api";

export interface ProjectData {
  id: string;
  name: string;
  author?: string;
  missionObjective?: string;
  maxDiameter: number;
  maxLength?: number;
  propellantId: string;
  targetImpulse?: number;
  impulseClass?: string;
  targetBurnTime?: number;
  maxThrust?: number;
  status: ProjectStatus;
  lastOpenedAt: string;

  motorChamberDiameter: number;
  motorChamberLength: number;
  grainCoreType: string;
  grainStarPoints?: number;
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

interface DashboardViewProps {
  projectId: string | null;
  setFooter: (data: FooterProps) => void;
}

// Movidada para fora do componente para evitar recriação desnecessária a cada render
const getPanelVariant = (
  type: string,
): "Warning" | "Info" | "Success" | "Critical" | undefined => {
  switch (type) {
    case "error":
      return "Critical";
    case "warning":
      return "Warning";
    case "success":
      return "Success";
    case "info":
    case "note":
      return "Info";
    default:
      return undefined;
  }
};

export default function DashboardView({
  projectId,
  setFooter,
}: DashboardViewProps) {
  // --- ESTADOS ---
  const [project, setProject] = useState<ProjectData | null>(null);
  const [projectLoaded, setProjectLoaded] = useState<ProjectData | null>(null);
  const [propellant, setPropellant] = useState<Propellant | null>(null);
  const [simulationData, setSimulationData] = useState<SimulationResult | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [simulationRun, setSimulationRun] = useState(false);
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);
  const [focusedSection, setFocusedSection] = useState<FocusedSection>(null);
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [geometryViewType, setGeometryViewType] = useState<"motor" | "grain">(
    "motor",
  );

  const [simConfig, setSimConfig] = useState<SimulationConfig>({
    timeStep: 0.001,
    method: "RK4",
    pointsCount: 500,
  });

  const saveStatus: SaveStatus = useMemo(() => {
    if (!projectLoaded || !project) return "saved";
    if (isSaving) return "saving";

    const hasManualChanges = !isEqual(projectLoaded, project);

    const simClass = simulationData?.metrics?.class;
    const hasSimulationChanges = simClass
      ? simClass !== projectLoaded.impulseClass
      : false;

    return hasManualChanges || hasSimulationChanges ? "unsaved" : "saved";
  }, [projectLoaded, project, isSaving, simulationData]);

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
    fetchSettings();
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [projectId]);

  useEffect(() => {
    if (project?.propellantId) {
      fetchPropellants(project.propellantId);
    }
  }, [project?.propellantId]);

  useEffect(() => {
    if (!settings?.autoSave || saveStatus !== "unsaved") return;

    const delayTimer = setTimeout(() => {
      handleSaveChanges();
    }, 1000);

    return () => clearTimeout(delayTimer);
  }, [saveStatus, settings?.autoSave]);

  useEffect(() => {
    if (project && saveStatus === "unsaved") {
      const draftKey = `srm_draft_${project.id}`;
      sessionStorage.setItem(draftKey, JSON.stringify(project));
    }
  }, [project, saveStatus]);

  // --- FUNÇÕES DE DADOS (FETCH) ---
  const fetchProjects = async () => {
    // Busca o ID das props ou da sessão
    let activeId = projectId;
    if (!activeId) {
      activeId = sessionStorage.getItem("srm_active_project_id");
    }

    if (!activeId) {
      setIsLoading(false);
      return;
    }

    sessionStorage.setItem("srm_active_project_id", activeId);

    try {
      setIsLoading(true);
      const baseUrl = await getBaseUrl();
      const response = await fetch(`${baseUrl}/api/projects/${activeId}/open`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const dbData = await response.json();
        setProjectLoaded(dbData);

        const draftKey = `srm_draft_${activeId}`;
        const draftString = sessionStorage.getItem(draftKey);

        if (draftString) {
          const draftData = JSON.parse(draftString);
          setProject(draftData);
        } else {
          setProject(dbData);
        }
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
      const baseUrl = await getBaseUrl();
      const response = await fetch(
        `${baseUrl}/api/propellants/${propellantId}`,
      );

      if (response.status === 404) {
        console.warn(
          `Aviso: Propelente ${propellantId} não existe mais no banco de dados.`,
        );
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

  const fetchSettings = async () => {
    try {
      const baseUrl = await getBaseUrl();
      const response = await fetch(`${baseUrl}/api/settings`);

      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      } else {
        throw new Error("Falha ao buscar dados do sistema");
      }
    } catch (error) {
      console.error(error);
      showToast({
        type: "error",
        title: "Erro no Sistema",
        message: "Falha na comunicação ao carregar as configurações.",
      });
      setSettings(null);
    }
  };

  // --- FUNÇÕES DE AÇÃO (BUTTONS, INTERAÇÕES) ---
  const handleRunSimulation = () => {
    if (!project || !propellant) {
      showToast({
        type: "error",
        title: "Erro",
        message: "Projeto ou Propelente ausente.",
      });
      return;
    }

    setSimulationRun(true);

    setTimeout(() => {
      try {
        const results = runMotorSimulation(project, propellant, simConfig);

        if (results) {
          setSimulationData(results);

          // Reage ao status da simulação
          if (results.status === "SUCCESS") {
            showToast({
              type: "success",
              title: "Sucesso",
              message: results.message,
            });
          } else if (results.status === "CATO") {
            showToast({
              type: "error",
              title: "FALHA CATASTRÓFICA",
              message: results.message,
            });
          } else if (results.status === "TIMEOUT") {
            showToast({
              type: "warning",
              title: "Tempo Excedido",
              message: results.message,
            });
          } else {
            showToast({
              type: "error",
              title: "Erro",
              message: results.message,
            });
            return;
          }

          // ==========================================
          // GERAÇÃO DE ALERTAS BALÍSTICOS
          // ==========================================
          const simAlerts: AlertMessage[] = [];
          const timeNow = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          const {
            maxPressureBar,
            initialKn,
            isp,
            class: motorClass,
          } = results.metrics;

          // Regra 1: Pressão da Câmara (MEOP)
          if (maxPressureBar > 80) {
            simAlerts.push({
              id: "sim-press-critical",
              type: "error",
              message: `Pressão máxima crítica (${maxPressureBar.toFixed(1)} Bar). Risco iminente de falha estrutural da carcaça (CATO).`,
              time: timeNow,
            });
          } else if (maxPressureBar > 60) {
            simAlerts.push({
              id: "sim-press-warning",
              type: "warning",
              message: `Pressão máxima elevada (${maxPressureBar.toFixed(1)} Bar). Certifique-se do fator de segurança do tubo.`,
              time: timeNow,
            });
          } else if (maxPressureBar < 15) {
            simAlerts.push({
              id: "sim-press-low",
              type: "warning",
              message: `Pressão sub-ótima (${maxPressureBar.toFixed(1)} Bar). O motor pode sofrer com chuffing e queima instável.`,
              time: timeNow,
            });
          }

          // Regra 2: Relação Kn (Area de Queima / Garganta)
          if (initialKn > 320) {
            simAlerts.push({
              id: "sim-kn-high",
              type: "warning",
              message: `Kn inicial agressivo (${initialKn.toFixed(0)}). A rampa de pressurização causará um alto pico de estresse inicial.`,
              time: timeNow,
            });
          } else if (initialKn < 180) {
            simAlerts.push({
              id: "sim-kn-low",
              type: "note",
              message: `Kn inicial brando (${initialKn.toFixed(0)}). A ignição pode ser lenta e exigir um iniciador térmico mais potente.`,
              time: timeNow,
            });
          }

          // Regra 3: Eficiência Geral (Info)
          simAlerts.push({
            id: "sim-efficiency",
            type: "info",
            message: `Performance calculada: Motor Classe ${motorClass} validado com ISP real estimado de ${isp.toFixed(1)} s.`,
            time: timeNow,
          });

          // Atualiza os alertas preservando apenas os que NÃO vieram da simulação anterior (ex: alertas de dimensão)
          setAlerts((prev) => {
            const preservedAlerts = prev.filter(
              (alert) => !alert.id.startsWith("sim-"),
            );
            return [...preservedAlerts, ...simAlerts];
          });
        }
      } catch (error) {
        showToast({
          type: "error",
          title: "Falha Matemática",
          message: "Os parâmetros atuais geraram um erro no cálculo iterativo.",
        });
        console.error("Error during simulation:", error);
      } finally {
        setSimulationRun(false);
      }
    }, 100);
  };

  const handleSaveChanges = async () => {
    if (saveStatus !== "unsaved" || !project) return;
    const activeId =
      projectId || sessionStorage.getItem("srm_active_project_id");

    const payload = {
      ...project,
      impulseClass: simulationData?.metrics?.class || project.impulseClass,
    };

    setIsSaving(true);
    try {
      const baseUrl = await getBaseUrl();
      await fetch(`${baseUrl}/api/projects/${activeId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });

      setProject(structuredClone(payload));
      setProjectLoaded(structuredClone(payload));
      sessionStorage.removeItem(`srm_draft_${activeId}`);
    } catch (error) {
      console.error(error);
      showToast({
        type: "error",
        title: "Erro no Salvamento",
        message: "Falha na comunicação ao salvar.",
      });
    } finally {
      setIsSaving(false);
    }
  };
  const status = simulationData?.status?.toLowerCase() || "idle";

  const handleDimensionsChange = (newDims: MotorDimensions) => {
    if (!project) return;

    const limitDiameter = project.maxDiameter || 0;
    const limitLength = project.maxLength ? project.maxLength : Infinity;

    // Array temporário que vai guardar apenas os erros atuais
    const currentActiveAlerts: AlertMessage[] = [];

    // Regra: Diâmetro
    if (limitDiameter > 0 && newDims.chamberDiameter > limitDiameter) {
      currentActiveAlerts.push({
        id: "diameter-limit",
        title: "Diâmetro Excedido",
        message: `Diâmetro da carcaça (${newDims.chamberDiameter}mm) maior que o permitido (${limitDiameter}mm).`,
        type: "warning",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    }

    // Regra: Comprimento
    if (limitLength > 0 && newDims.chamberLength > limitLength) {
      currentActiveAlerts.push({
        id: "length-limit",
        title: "Comprimento Excedido",
        message: `Comprimento da carcaça (${newDims.chamberLength}mm) maior que o permitido (${limitLength}mm).`,
        type: "warning",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    }

    // Regra: Diâmetro do grão não pode ser maior que o da carcaça
    if (
      newDims.chamberDiameter > 0 &&
      newDims.grainOuterDiameter > newDims.chamberDiameter
    ) {
      currentActiveAlerts.push({
        id: "diameter-grain-limit",
        title: "Diâmetro do Grão Excedido",
        message: `Diâmetro do grão (${newDims.grainOuterDiameter}mm) maior que o diâmetro interno da carcaça (${newDims.chamberDiameter}mm).`,
        type: "error",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    }

    // Compara os erros novos com os que já estavam na tela
    currentActiveAlerts.forEach((newAlert) => {
      const alreadyNotified = alerts.some(
        (existingAlert) => existingAlert.id === newAlert.id,
      );

      if (!alreadyNotified) {
        showToast({
          type: newAlert.type === "error" ? "error" : "warning",
          title: newAlert.title || "",
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
      grainSegments: newDims.grainSegments,
      nozzleThroatDiameter: newDims.throatDiameter,
      nozzleConvergenceAngle: newDims.convergenceAngle,
      nozzleDivergenceAngle: newDims.divergenceAngle,
    });
  };

  // ==========================================
  // AUTO-SCALING PARA OS GRÁFICOS
  // ==========================================
  let dynamicMaxTime = 2.0;
  let dynamicMaxThrust = 1500;
  let dynamicMaxPressure = 80;

  if (simulationData) {
    // Escala X (Tempo): Pega o último instante de tempo, adiciona 20% de margem e arredonda em casas de 0.5s
    const lastPoint =
      simulationData.thrustData[simulationData.thrustData.length - 1];
    const actualMaxTime = lastPoint ? lastPoint.x : 2.0;
    dynamicMaxTime = Math.ceil(actualMaxTime * 1.2 * 2) / 2;
    if (dynamicMaxTime < 1.0) dynamicMaxTime = 1.0; // Garante que o gráfico mostre no mínimo 1 segundo

    // Escala Y1 (Empuxo): Adiciona 20% de teto e arredonda bonitinho
    const thrustLimit = simulationData.metrics.maxThrust;
    dynamicMaxThrust = Math.ceil((thrustLimit * 1.2) / 100) * 100;
    // Se for um motor gigante (> 2000N), arredonda de 500 em 500 para não encher de zeros no painel
    if (thrustLimit > 2000)
      dynamicMaxThrust = Math.ceil((thrustLimit * 1.2) / 500) * 500;
    if (dynamicMaxThrust < 100) dynamicMaxThrust = 100;

    // Escala Y2 (Pressão): Adiciona 20% de teto e arredonda nas dezenas
    const pressLimit = simulationData.metrics.maxPressureBar;
    dynamicMaxPressure = Math.ceil((pressLimit * 1.2) / 10) * 10;
    if (dynamicMaxPressure < 20) dynamicMaxPressure = 20;
  }

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
              project
                ? {
                    chamberDiameter: project.motorChamberDiameter,
                    chamberLength: project.motorChamberLength,
                    grainCoreType: project.grainCoreType,
                    grainStarPoints: project.grainStarPoints,
                    grainOuterDiameter: project.grainOuterDiameter,
                    grainCoreDiameter: project.grainInnerDiameter,
                    grainLength: project.grainSegmentsLength,
                    grainSegments: project.grainSegments,
                    throatDiameter: project.nozzleThroatDiameter,
                    convergenceAngle: project.nozzleConvergenceAngle,
                    divergenceAngle: project.nozzleDivergenceAngle,
                  }
                : undefined
            }
            onFocusChange={setFocusedSection}
            propellant={propellant || undefined}
            onDimensionsChange={handleDimensionsChange}
            showSimulationFooter={true}
            isSimulating={simulationRun}
            onRunSimulation={handleRunSimulation}
            simConfig={simConfig}
            onSimConfigChange={setSimConfig}
          />

          <div className={styles.divider}>
            <DashboardHeader
              project_name={project.name}
              project_class={project?.impulseClass || "-"}
              saveStatus={saveStatus}
              onSave={handleSaveChanges}
            />

            <div className={styles.dashboardContent}>
              {/* Painel com o Esquema do Motor */}
              <DashboardPanel
                type="custom"
                panelTitle={
                  geometryViewType === "motor"
                    ? "MOTOR LONGITUDINAL VIEW"
                    : "GRAIN CROSS-SECTION & 3D"
                }
                icon={
                  <Settings
                    className={styles.panelIcon}
                    strokeWidth={1.5}
                    style={{ color: "var(--chart-1)" }}
                  />
                }
                headerActions={
                  <>
                    <button
                      onClick={() => setGeometryViewType("motor")}
                      style={{
                        padding: "4px 12px",
                        fontSize: "10px",
                        cursor: "pointer",
                        backgroundColor:
                          geometryViewType === "motor"
                            ? "var(--primary)"
                            : "var(--card)",
                        color:
                          geometryViewType === "motor"
                            ? "var(--background)"
                            : "var(--foreground)",
                        border: "1px solid var(--border)",
                        borderRadius: "4px",
                      }}
                    >
                      MOTOR VIEW
                    </button>
                    <button
                      onClick={() => setGeometryViewType("grain")}
                      style={{
                        padding: "4px 12px",
                        fontSize: "10px",
                        cursor: "pointer",
                        backgroundColor:
                          geometryViewType === "grain"
                            ? "var(--primary)"
                            : "var(--card)",
                        color:
                          geometryViewType === "grain"
                            ? "var(--background)"
                            : "var(--foreground)",
                        border: "1px solid var(--border)",
                        borderRadius: "4px",
                      }}
                    >
                      GRAIN VIEW
                    </button>
                  </>
                }
              >
                {geometryViewType === "motor" ? (
                  <MotorGeometry
                    dimensions={{
                      chamberDiameter: project.motorChamberDiameter || 0,
                      chamberLength: project.motorChamberLength || 0,
                      grainOuterDiameter: project.grainOuterDiameter || 0,
                      grainCoreDiameter: project.grainInnerDiameter || 0,
                      grainLength: project.grainSegmentsLength || 0,
                      grainSegments: project.grainSegments || 0,
                      throatDiameter: project.nozzleThroatDiameter || 0,
                      convergenceAngle: project.nozzleConvergenceAngle || 0,
                      divergenceAngle: project.nozzleDivergenceAngle || 0,
                      grainCoreType: project.grainCoreType || "bates",
                      grainStarPoints: project.grainStarPoints || 5,
                    }}
                    focusedSection={focusedSection}
                  />
                ) : (
                  <GrainGeometry
                    dimensions={{
                      grainOuterDiameter: project.grainOuterDiameter || 0,
                      grainCoreDiameter: project.grainInnerDiameter || 0,
                      grainLength: project.grainSegmentsLength || 0,
                      grainSegments: project.grainSegments || 0,
                      grainCoreType: project.grainCoreType || "bates",
                      grainStarPoints: project.grainStarPoints || 5,
                    }}
                    focusedSection={focusedSection}
                  />
                )}
              </DashboardPanel>

              <div className={styles.resultsStatus}>
                <span className={styles.statusTitle}>
                  Resultados da Simulação
                </span>

                {!simulationRun && (
                  <div className={styles.statusWrapper}>
                    <div
                      className={`${styles.pulseIndicator} ${styles[status]}`}
                    />
                    <span className={`${styles.statusText} ${styles[status]}`}>
                      {simulationData?.status || "---"}
                    </span>
                  </div>
                )}
              </div>

              {/* Metrics Grid */}
              <div className={styles.metricsGrid}>
                <MetricCard
                  title="Impulso Total"
                  value={
                    simulationData
                      ? simulationData.metrics.totalImpulse.toFixed(1)
                      : "---"
                  }
                  unit="N·s"
                  icon={<Flame size={16} />}
                />
                <MetricCard
                  title="Empuxo Médio"
                  value={
                    simulationData
                      ? simulationData.metrics.avgThrust.toFixed(1)
                      : "---"
                  }
                  unit="N"
                  icon={<Gauge size={16} />}
                />
                <MetricCard
                  title="Empuxo Máx."
                  value={
                    simulationData
                      ? simulationData.metrics.maxThrust.toFixed(1)
                      : "---"
                  }
                  unit="N"
                  icon={<Zap size={16} />}
                />
                <MetricCard
                  title="ISP"
                  value={
                    simulationData
                      ? simulationData.metrics.isp.toFixed(1)
                      : "---"
                  }
                  unit="s"
                  icon={<Timer size={16} />}
                />
                <ClassBadge
                  value={simulationData ? simulationData.metrics.class : "---"}
                  simulationData={simulationData ? true : false}
                />
              </div>

              {simulationData ? (
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
                  xRange={[0, dynamicMaxTime]}
                  xAxisUnit="s"
                  yRange={[0, dynamicMaxThrust]}
                  yAxisUnit="N"
                  secondaryYRange={[0, dynamicMaxPressure]}
                  secondaryYAxisUnit="B"
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
              )}

              <div className={styles.grid2Cols}>
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
                      value: project?.grainCoreType || "N/A",
                    },
                    {
                      label: "Segments",
                      value: `${project?.grainSegments || 0} un`,
                    },
                    {
                      label: "Outer Diameter",
                      value: `${project?.grainOuterDiameter || 0} mm`,
                    },
                    {
                      label: "Inner Diameter",
                      value: `${project?.grainInnerDiameter || 0} mm`,
                    },
                    {
                      label: "Length",
                      value: `${project?.grainSegments * project?.grainSegmentsLength || 249} mm`,
                    },
                    // {
                    //   label: "Propellant Mass",
                    //   value: `${project?.grainPropellantMass || 0} kg`,
                    // },
                  ]}
                />

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
                  textItems={alerts.map((alert) => ({
                    text: alert.message,
                    variant: getPanelVariant(alert.type),
                    icon:
                      alert.type === "error" ? (
                        <AlertTriangle size={16} />
                      ) : alert.type === "warning" ? (
                        <AlertTriangle size={16} />
                      ) : alert.type === "info" ? (
                        <Layers size={16} />
                      ) : alert.type === "note" ? (
                        <Settings size={16} />
                      ) : undefined,
                    time: alert.time,
                  }))}
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
                <strong className={styles.keyboard_shortcut}> Ctrl + N </strong>{" "}
                para criar um novo projeto. Ou{" "}
                <strong className={styles.keyboard_shortcut}> Ctrl + O </strong>{" "}
                para abrir um projeto existente.
              </p>
            </div>
          </div>
        </section>
      )}
    </section>
  );
}
