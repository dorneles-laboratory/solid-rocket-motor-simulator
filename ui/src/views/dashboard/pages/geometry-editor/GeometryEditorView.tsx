import { useEffect, useMemo, useState } from "react";
import isEqual from "fast-deep-equal";
import styles from "./GeometryEditorView.module.css";
import iconDashboard from "../../../../assets/dashboard.png";
import { FooterProps } from "../../../../components/layout/footer/footer";
import { showToast } from "../../../../ui/toast/toast-container";
import { Settings } from "lucide-react";
import DashboardPanel from "../../components/dash-panel/dash-panel";
import MotorGeometry, {
  FocusedSection,
  MotorDimensions,
} from "../../components/dash-motor-geometry/dash-motor-geometry";
import GrainGeometry from "../../components/dash-grain-geometry/dash-grain-geometry";
import DashboardHeader, {
  SaveStatus,
} from "../../components/dash-header/dash-header";
import { ProjectStatus } from "../../../open-project/components/o-proj-card/o-proj-card";
import { Propellant } from "../../../propellants/PropellantsView";
import { SettingsData } from "../../../settings/SettingsView";
import DashboardInputPanel from "../../components/dash-input-data/dash-input";
import { getBaseUrl } from "../../../../api/api";

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
  grainCoreType?: string;
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

interface GeometryEditorViewProps {
  projectId?: string | null;
  setFooter: (data: FooterProps) => void;
}

export default function GeometryEditorView({
  projectId,
  setFooter,
}: GeometryEditorViewProps) {
  // --- ESTADOS ---
  const [project, setProject] = useState<ProjectData | null>(null);
  const [projectLoaded, setProjectLoaded] = useState<ProjectData | null>(null);
  const [propellant, setPropellant] = useState<Propellant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);
  const [focusedSection, setFocusedSection] = useState<FocusedSection>(null);
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const saveStatus: SaveStatus = useMemo(() => {
    if (!projectLoaded || !project) return "saved";
    if (isSaving) return "saving";

    const hasManualChanges = !isEqual(projectLoaded, project);

    return hasManualChanges ? "unsaved" : "saved";
  }, [projectLoaded, project, isSaving]);
  const [geometryViewType, setGeometryViewType] = useState<"motor" | "grain">(
    "motor",
  );

  // --- EFEITOS (LIFECYCLE) ---
  useEffect(() => {
    setFooter({
      description: projectId
        ? "Edite a geometria do seu motor sólido de foguete com uma interface visual intuitiva."
        : "Crie ou abra um projeto para acessar o editor de geometria.",
      rightText: "Modo de Edição Ativo",
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
      const response = await fetch(`${baseUrl}/api/projects/${activeId}/open`);

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
        throw new Error("Falha ao buscar dados do banco de dados");
      }
    } catch (error) {
      showToast({
        type: "error",
        title: "Erro de Comunicação",
        message: "Não foi possível carregar o projeto.",
      });
      console.error("Erro ao carregar projeto:", error);
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
        setPropellant(null);
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setPropellant(data);
      }
    } catch (error) {
      console.error("Erro ao buscar propelente:", error);
      showToast({
        type: "error",
        title: "Erro no Propelente",
        message: "Falha na comunicação.",
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
      }
    } catch (error) {
      setSettings(null);
      console.error("Erro ao carregar configurações:", error);
    }
  };

  const handleSaveChanges = async () => {
    if (saveStatus !== "unsaved" || !project) return;
    const activeId =
      projectId || sessionStorage.getItem("srm_active_project_id");

    const payload = {
      ...project,
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
      showToast({
        type: "error",
        title: "Erro no Salvamento",
        message: "Falha na comunicação.",
      });
      console.error("Erro ao salvar projeto:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDimensionsChange = (newDims: MotorDimensions) => {
    if (!project) return;

    const limitDiameter = project.maxDiameter || 0;
    const limitLength = project.maxLength ? project.maxLength : Infinity;
    const currentActiveAlerts: AlertMessage[] = [];

    if (limitDiameter > 0 && newDims.chamberDiameter > limitDiameter) {
      currentActiveAlerts.push({
        id: "diameter-limit",
        title: "Diâmetro Excedido",
        message: `Limite: ${limitDiameter}mm`,
        type: "warning",
        time: new Date().toLocaleTimeString(),
      });
    }
    if (limitLength > 0 && newDims.chamberLength > limitLength) {
      currentActiveAlerts.push({
        id: "length-limit",
        title: "Comprimento Excedido",
        message: `Limite: ${limitLength}mm`,
        type: "warning",
        time: new Date().toLocaleTimeString(),
      });
    }
    if (
      newDims.chamberDiameter > 0 &&
      newDims.grainOuterDiameter > newDims.chamberDiameter
    ) {
      currentActiveAlerts.push({
        id: "diameter-grain-limit",
        title: "Diâmetro do Grão Excedido",
        message: `Maior que a carcaça.`,
        type: "error",
        time: new Date().toLocaleTimeString(),
      });
    }

    currentActiveAlerts.forEach((newAlert) => {
      if (!alerts.some((existingAlert) => existingAlert.id === newAlert.id)) {
        showToast({
          type: newAlert.type === "error" ? "error" : "warning",
          title: newAlert.title || "",
          message: newAlert.message,
        });
      }
    });

    setAlerts(currentActiveAlerts);

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

  return (
    <section className={styles.geometryView}>
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
        <div className={styles.viewLayout}>
          {/* BARRA LATERAL (INPUT DATA) */}
          <DashboardInputPanel
            dimensions={
              project
                ? {
                    chamberDiameter: project.motorChamberDiameter || 0,
                    chamberLength: project.motorChamberLength || 0,
                    grainCoreType: project.grainCoreType || "bates",
                    grainStarPoints: project.grainStarPoints || 5,
                    grainOuterDiameter: project.grainOuterDiameter || 0,
                    grainCoreDiameter: project.grainInnerDiameter || 0,
                    grainLength: project.grainSegmentsLength || 0,
                    grainSegments: project.grainSegments || 0,
                    throatDiameter: project.nozzleThroatDiameter || 0,
                    convergenceAngle: project.nozzleConvergenceAngle || 0,
                    divergenceAngle: project.nozzleDivergenceAngle || 0,
                  }
                : undefined
            }
            onFocusChange={setFocusedSection}
            propellant={propellant || undefined}
            onDimensionsChange={handleDimensionsChange}
          />

          {/* PAINEL DA DIREITA (HEADER + GEOMETRIA) */}
          <div className={styles.rightContainer}>
            <DashboardHeader
              project_name={project.name}
              project_class={project?.impulseClass || "-"}
              saveStatus={saveStatus}
              onSave={handleSaveChanges}
            />

            {/* CONTEÚDO PRINCIPAL ABAIXO DO HEADER */}
            <div className={styles.editorContent}>
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
            </div>
          </div>
        </div>
      ) : (
        <section className={styles.noItemsGrid}>
          <div>
            <img
              src={iconDashboard}
              alt="Solid rocket motor"
              className={styles.rocketImage}
            />
            <div className={styles.noItemsMessage}>
              <h1 className={styles.noItemsTitle}>
                Nenhum projeto aberto no momento!
              </h1>
              <p className={styles.noItemsSubtitle}>
                Abra um projeto existente ou crie um novo. Aperte{" "}
                <strong className={styles.keyboardShortcut}>Ctrl + N</strong>{" "}
                para criar ou{" "}
                <strong className={styles.keyboardShortcut}>Ctrl + O</strong>{" "}
                para abrir.
              </p>
            </div>
          </div>
        </section>
      )}
    </section>
  );
}
