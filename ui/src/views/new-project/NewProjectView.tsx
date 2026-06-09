import styles from "./NewProjectView.module.css";
import { FooterProps } from "../../components/layout/footer/footer";
import NewProjectHeader from "./components/header/n-proj-header";
import { Button } from "../../ui/button/button";
import { Input } from "../../ui/input/input";
import Label from "../../ui/label/label";
import Textarea from "../../ui/text-area/text-area";
import { showToast } from "../../ui/toast/toast-container";
import {
  Clock,
  Target,
  Zap,
  ChevronDown,
  ChevronUp,
  Ruler,
  FlaskConical,
  Gauge,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ImpulseClass, ProjectStatus } from "../open-project/components/o-proj-card/o-proj-card";

const getImpulseClass = (impulseValue: string): ImpulseClass => {
  const i = parseFloat(impulseValue);

  if (isNaN(i) || i <= 0) return "-";
  if (i <= 2.5) return "A";
  if (i <= 5.0) return "B";
  if (i <= 10.0) return "C";
  if (i <= 20.0) return "D";
  if (i <= 40.0) return "E";
  if (i <= 80.0) return "F";
  if (i <= 160.0) return "G";
  if (i <= 320.0) return "H";
  if (i <= 640.0) return "I";
  if (i <= 1280.0) return "J";
  if (i <= 2560.0) return "K";
  if (i <= 5120.0) return "L";
  if (i <= 10240.0) return "M";
  if (i <= 20480.0) return "N";

  return "O";
};

interface Propellant {
  id: string;
  name: string;
  density: number;
  burnRateA: number;
  burnRateN: number;
  theoreticalIsp: number;
  type: string;
}

const initialFormData: ProjectData = {
  name: "",
  author: "",
  missionObjective: "",
  maxDiameter: "",
  maxLength: "",
  propellantId: "",
  targetImpulse: "",
  targetBurnTime: "",
  maxThrust: "",
  status: "draft",
};

export interface ProjectData {
  name: string;
  author?: string;
  missionObjective?: string;
  maxDiameter: string;
  maxLength?: string;
  propellantId: string;
  targetImpulse?: string;
  targetBurnTime?: string;
  maxThrust?: string;
  status: ProjectStatus;
}

interface NewProjectViewProps {
  onNavigate: (view: string) => void;
  setFooter: (data: FooterProps) => void;
}

export default function NewProjectView({
  onNavigate,
  setFooter,
}: NewProjectViewProps) {
  // Controle de UI
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [propellants, setPropellants] = useState<Propellant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState<ProjectData>(initialFormData);

  useEffect(() => {
    setFooter({
      description: "Se pode ser imaginado, pode ser criado",
      rightText:
        "Crie um novo projeto de motor-foguete sólido para começar a simular!",
    });
  }, [setFooter]);

  useEffect(() => {
    setFormData(initialFormData);
  }, []);

  useEffect(() => {
    fetchPropellants();
  }, []);

  useEffect(() => {
    if (propellants.length > 0) {
      setFormData({ ...formData, propellantId: propellants[0].id });
    }
  }, [propellants]);

  const fetchPropellants = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/propellants");
      if (response.ok) {
        const data = await response.json();
        setPropellants(data);
      }
    } catch (error) {
      console.error("Erro ao buscar propelentes:", error);
      showToast({
        type: "error",
        title: "Fetch Failed",
        message: "Failed to fetch propellants.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        impulseClass: getImpulseClass(formData.targetImpulse ?? ""),
      };

      const response = await fetch("http://localhost:8080/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        showToast({
          type: "success",
          title: "Project Created",
          message: "Your project was created successfully!",
        });

        setFormData(initialFormData);

        const createdProject = await response.json();
        onNavigate(`/dashboard?projectId=${createdProject.id}`);
      } else if (response.status === 409) {
        const errorMsg = await response.text();
        showToast({
          type: "error",
          title: "Creation Failed",
          message: errorMsg,
        });
      }
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
      showToast({
        type: "error",
        title: "Creation Failed",
        message: "Failed to create project.",
      });
    }
  };

  const impulseClass = getImpulseClass(formData.targetImpulse ?? "");

  return (
    <div className={styles.newProjectView}>
      <div className={styles.mainContent}>
        {/* Form Card */}
        <div className={styles.card}>
          <NewProjectHeader />

          <form className={styles.content} onSubmit={handleCreateProject}>
            {/* PROJECT INFO */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionLine} />
                Project Information
                <span className={styles.sectionLine} />
              </h2>

              <div className={styles.requirementsGrid}>
                {/* PROJECT NAME */}
                <div className={styles.field}>
                  <Label htmlFor="project-name" className={styles.label}>
                    Project Name *
                  </Label>
                  <Input
                    id="project-name"
                    placeholder="e.g., Motor SRM-TAU"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={styles.input}
                  />
                </div>

                {/* AUTHOR */}
                <div className={styles.field}>
                  <Label htmlFor="author" className={styles.labelWithIcon}>
                    <User className={styles.smallIcon} strokeWidth={1.5} />
                    Author
                  </Label>
                  <Input
                    id="author"
                    placeholder="e.g., John Doe"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    className={styles.input}
                  />
                </div>
              </div>

              {/* OBJECTIVE */}
              <div className={styles.field}>
                <Label htmlFor="mission-objective" className={styles.label}>
                  Mission Objective
                </Label>
                <Textarea
                  id="mission-objective"
                  placeholder="Describe the mission goals and requirements..."
                  value={formData.missionObjective}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      missionObjective: e.target.value,
                    })
                  }
                  className={styles.textarea}
                />
              </div>
            </section>

            {/* DESIGN CONSTRAINTS */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionLine} />
                Design Constraints
                <span className={styles.sectionLine} />
              </h2>

              <div className={styles.requirementsGrid}>
                {/* MAX DIAMETER */}
                <div className={styles.field}>
                  <Label
                    htmlFor="max-diameter"
                    className={styles.labelWithIcon}
                  >
                    <Ruler className={styles.smallIcon} strokeWidth={1.5} />
                    Max Outer Diameter *
                  </Label>
                  <div className={styles.inputWrapper}>
                    <Input
                      id="max-diameter"
                      type="number"
                      placeholder="e.g., 75"
                      value={formData.maxDiameter}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maxDiameter: e.target.value,
                        })
                      }
                      className={styles.inputWithUnitSmall}
                    />
                    <span className={styles.inputUnit}>mm</span>
                  </div>
                </div>

                {/* PROPELLANT */}
                <div className={styles.field}>
                  <Label htmlFor="propellant" className={styles.labelWithIcon}>
                    <FlaskConical
                      className={styles.smallIcon}
                      strokeWidth={1.5}
                    />
                    Default Propellant *
                  </Label>
                  <select
                    id="propellant"
                    value={formData.propellantId}
                    onChange={(e) =>
                      setFormData({ ...formData, propellantId: e.target.value })
                    }
                    className={`${styles.input} ${styles.select}`}
                    disabled={isLoading || propellants.length === 0}
                  >
                    {isLoading ? (
                      <option value="">Carregando...</option>
                    ) : propellants.length === 0 ? (
                      <option value="">Nenhum propelente cadastrado</option>
                    ) : (
                      propellants.map((prop) => (
                        <option key={prop.id} value={prop.id}>
                          {prop.name} ({prop.type})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* MAX LENGTH */}
                <div className={styles.field}>
                  <Label htmlFor="max-length" className={styles.label}>
                    <Ruler className={styles.smallIcon} strokeWidth={1.5} />
                    Max Length (Optional)
                  </Label>
                  <div className={styles.inputWrapper}>
                    <Input
                      id="max-length"
                      type="number"
                      placeholder="e.g., 500"
                      value={formData.maxLength}
                      onChange={(e) =>
                        setFormData({ ...formData, maxLength: e.target.value })
                      }
                      className={styles.inputWithUnitSmall}
                    />
                    <span className={styles.inputUnit}>mm</span>
                  </div>
                </div>
              </div>
            </section>

            {/* EXPANDABLE: TARGET GOALS */}
            <section className={styles.section}>
              <button
                type="button"
                className={styles.expandButton}
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <span className={styles.sectionLine} />
                <span className={styles.expandText}>
                  Target Goals & Requirements
                  {showAdvanced ? (
                    <ChevronUp className={styles.smallIcon} strokeWidth={2} />
                  ) : (
                    <ChevronDown className={styles.smallIcon} strokeWidth={2} />
                  )}
                </span>
                <span className={styles.sectionLine} />
              </button>

              {showAdvanced && (
                <div className={styles.requirementsGrid}>
                  {/* TARGET IMPULSE */}
                  <div className={styles.field}>
                    <div className={styles.labelHeaderRow}>
                      <Label
                        htmlFor="target-impulse"
                        className={styles.labelWithIcon}
                      >
                        <Target
                          className={styles.smallIcon}
                          strokeWidth={1.5}
                        />
                        Total Impulse
                      </Label>
                      {/* MOTOR CLASS BADGE */}
                      <span className={styles.classBadge}>
                        Class <strong>{impulseClass}</strong>
                      </span>
                    </div>

                    <div className={styles.inputWrapper}>
                      <Input
                        id="target-impulse"
                        type="number"
                        placeholder="0.00"
                        value={formData.targetImpulse}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            targetImpulse: e.target.value,
                          })
                        }
                        className={styles.inputWithUnit}
                      />
                      <span className={styles.inputUnit}>N·s</span>
                    </div>
                  </div>

                  {/* BURN TIME */}
                  <div className={styles.field}>
                    <Label
                      htmlFor="target-burn-time"
                      className={styles.labelWithIcon}
                    >
                      <Clock className={styles.smallIcon} strokeWidth={1.5} />
                      Burn Time
                    </Label>
                    <div className={styles.inputWrapper}>
                      <Input
                        id="target-burn-time"
                        type="number"
                        placeholder="0.00"
                        value={formData.targetBurnTime}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            targetBurnTime: e.target.value,
                          })
                        }
                        className={styles.inputWithUnitSmall}
                      />
                      <span className={styles.inputUnit}>s</span>
                    </div>
                  </div>

                  {/* MAX THRUST LIMIT */}
                  <div className={styles.field}>
                    <Label
                      htmlFor="max-thrust"
                      className={styles.labelWithIcon}
                    >
                      <Gauge className={styles.smallIcon} strokeWidth={1.5} />
                      Max Thrust (Limit)
                    </Label>
                    <div className={styles.inputWrapper}>
                      <Input
                        id="max-thrust"
                        type="number"
                        placeholder="0.00"
                        value={formData.maxThrust}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            maxThrust: e.target.value,
                          })
                        }
                        className={styles.inputWithUnitSmall}
                      />
                      <span className={styles.inputUnit}>N</span>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* BUTTON */}
            <Button
              type="submit"
              disabled={
                !formData.name ||
                !formData.maxDiameter ||
                !formData.propellantId
              }
              className={styles.createButton}
            >
              <Zap className={styles.buttonIcon} strokeWidth={1.5} />
              Create Project
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
