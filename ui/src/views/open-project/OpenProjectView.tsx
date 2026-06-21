import { FooterProps } from "../../components/layout/footer/footer";
import styles from "./OpenProjectView.module.css";
import OpenProjectCard, {
  ImpulseClass,
  ProjectStatus,
} from "./components/o-proj-card/o-proj-card";
import { useEffect, useState } from "react";
import { ArrowUpDown, Plus } from "lucide-react";
import { showToast } from "../../ui/toast/toast-container";
import rocket from "../../assets/rocket-base.png";
import { Button } from "../../ui/button/button";
import { getBaseUrl } from "../../api/api";

export interface Project {
  id: string;
  name: string;
  author: string;
  missionObjective: string;
  maxDiameter: number;
  maxLength: number;
  propellantId: string;
  targetImpulse: number;
  targetBurnTime: number;
  maxThrust: number;
  impulseClass: ImpulseClass;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

interface OpenProjectViewProps {
  onNavigate: (view: string) => void;
  setFooter: (data: FooterProps) => void;
}

export default function OpenProjectView({
  onNavigate,
  setFooter,
}: OpenProjectViewProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [sortBy, setSortBy] = useState<"date" | "name">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    setFooter({
      index: projects.length || 0,
      description:
        projects.length === 1 ? "Projeto encontrado" : "Projetos encontrados",
    });
  }, [projects, setFooter]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const baseUrl = await getBaseUrl();
      const response = await fetch(`${baseUrl}/api/projects`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Erro ao buscar projetos:", error);
      showToast({
        type: "error",
        title: "Fetch Failed",
        message: "Failed to fetch projects.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sortedProjects = [...projects].sort((a, b) => {
    let comparison = 0;

    if (sortBy === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === "date") {
      comparison =
        new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  const handleRemoveProjectFromState = (idToRemove: string) => {
    setProjects((prevProjects) =>
      prevProjects.filter((p) => p.id !== idToRemove),
    );
  };

  return (
    <section className={styles.open_project_view}>
      {/* TOOLBAR (Busca & Ordenação) */}
      <div className={styles.toolbar}>
        {/* ORDENAÇÃO */}
        {sortedProjects.length == 0 && (
          <div className={styles.button_container}>
            <Button size="lg" onClick={() => onNavigate("new-project")}>
              <Plus className={styles.addButtonIcon} strokeWidth={2} />
              Criar Projeto
            </Button>
          </div>
        )}

        <div className={styles.sortContainer}>
          <button
            className={styles.sortButton}
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            title={
              sortOrder === "asc" ? "Ordem Crescente" : "Ordem Decrescente"
            }
          >
            <ArrowUpDown
              className={styles.sortIcon}
              strokeWidth={1.5}
              style={{
                transform: sortOrder === "desc" ? "rotate(180deg)" : "none",
                transition: "0.2s",
              }}
            />
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "date" | "name")}
            className={styles.select}
          >
            <option value="date">By Date</option>
            <option value="name">By Name</option>
          </select>
        </div>
      </div>

      {/* PROJECT GRID */}
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
      ) : sortedProjects.length > 0 ? (
        <div className={styles.projectGrid}>
          {sortedProjects.map((project) => (
            <OpenProjectCard
              key={project.id}
              project={project}
              onDelete={handleRemoveProjectFromState}
              onNavigate={(projectId) =>
                onNavigate(`/dashboard?projectId=${projectId}`)
              }
            />
          ))}
        </div>
      ) : (
        <section className={styles.noItensGrid}>
          <div>
            <img
              src={rocket}
              alt="Solid rocket motor"
              className={styles.rocket_image}
            />

            <div className={styles.noItensMessage}>
              <h1 className={styles.noItensTitle}>
                Nenhum projeto encontrado!
              </h1>

              <p className={styles.noItensSubtitle}>
                Crie um novo projeto para começar a desenvolver seu motor
                sólido. Aperte{" "}
                <strong className={styles.keyboard_shortcut}> Ctrl + N </strong>{" "}
                para criar um novo projeto.
              </p>
            </div>
          </div>
        </section>
      )}
    </section>
  );
}
