import styles from "./PropellantsView.module.css";
import { Button } from "../../ui/button/button";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { FooterProps } from "../../components/layout/footer/footer";
import { useEffect, useState } from "react";
import PropellantsHeader from "./components/propellants-header/prop-header";
import PropellantsModal from "./components/propellants-modal/prop-modal";
import { showToast } from "../../ui/toast/toast-container";
import image from "../../assets/propellant.png";
import { useShortcut } from "../../hooks/use-shortcut";
import { getBaseUrl } from "../../api/api";

export interface Propellant {
  id: string;
  name: string;
  density: number;
  burnRateA: number;
  burnRateN: number;
  theoreticalIsp: number;
  type: string;
}

interface PropellantsViewProps {
  setFooter: (data: FooterProps) => void;
}

export default function PropellantsView({ setFooter }: PropellantsViewProps) {
  const [propellants, setPropellants] = useState<Propellant[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [editingPropellant, setEditingPropellant] = useState<Propellant | null>(
    null,
  );

  useEffect(() => {
    setFooter({
      index: propellants.length || 0,
      description:
        propellants.length === 1
          ? "Propelente encontrado"
          : "Propelentes encontrados",
      legends: [
        {
          label: "Composite",
          color: "#f97316",
        },
        {
          label: "Sugar",
          color: "#22c55e",
        },
      ],
    });
  }, [propellants, setFooter]);

  useEffect(() => {
    fetchPropellants();
  }, []);

  const fetchPropellants = async () => {
    try {
      const baseUrl = await getBaseUrl();
      const response = await fetch(`${baseUrl}/api/propellants`);
      if (response.ok) {
        const data = await response.json();
        setPropellants(data);
      }
    } catch (error) {
      showToast({
        type: "error",
        title: "Fetch Failed",
        message: "Failed to fetch propellants.",
      });
      console.error("Error fetching propellants:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingPropellant(null);
    setIsModalOpen(true);
  };

  useShortcut("q", handleAddNew, { ctrl: true });

  const handleEdit = (propellant: Propellant) => {
    setEditingPropellant(propellant);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const baseUrl = await getBaseUrl();
      const response = await fetch(`${baseUrl}/api/propellants/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        showToast({
          type: "success",
          title: "Deleted",
          message: "Propellant deleted successfully.",
        });
        setPropellants((prev) => prev.filter((p) => p.id !== id));
      } else {
        showToast({
          type: "error",
          title: "Deletion Failed",
          message: "Failed to delete propellant.",
        });
      }
    } catch (error) {
      showToast({
        type: "error",
        title: "Deletion Failed",
        message: "Failed to delete propellant.",
      });
      console.error("Error deleting propellant:", error);
    }
  };

  const handleModalSuccess = (savedPropellant: Propellant, isEdit: boolean) => {
    if (isEdit) {
      setPropellants((prev) =>
        prev.map((p) => (p.id === savedPropellant.id ? savedPropellant : p)),
      );
    } else {
      setPropellants((prev) => [...prev, savedPropellant]);
    }
  };

  return (
    <section className={styles.propellants_view}>
      <div className={styles.button_container}>
        <Button size="lg" onClick={handleAddNew}>
          <Plus className={styles.addButtonIcon} strokeWidth={2} />
          Adicionar Propelente
        </Button>
      </div>

      <div className={styles.propellants_list}>
        {/* TABLE HEADER */}
        <PropellantsHeader />

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
        ) : propellants.length > 0 ? (
          propellants.map((prop) => (
            <div key={prop.id} className={styles.tableRow}>
              {/* NAME */}
              <span className={styles.propellantName}>
                <div
                  className={styles.propellantDot}
                  style={{
                    backgroundColor:
                      prop.type === "Composite" ? "#f97316" : "#22c55e",
                  }}
                />
                {prop.name}
              </span>

              {/* DENSITY */}
              <span className={styles.numericColumn}>
                {prop.density.toFixed(3)}
                <span className={styles.unit}>g/cm³</span>
              </span>

              {/* BURN RATE A */}
              <span className={styles.numericColumn}>
                {prop.burnRateA.toFixed(2)}
              </span>

              {/* BURN RATE N */}
              <span className={styles.numericColumn}>
                {prop.burnRateN.toFixed(3)}
              </span>

              {/* ISP */}
              <span className={styles.numericColumn}>
                {prop.theoreticalIsp.toFixed(0)}
                <span className={styles.unit}>s</span>
              </span>

              {/* TYPE */}
              <span className={styles.typeWrapper}>
                <span
                  className={
                    prop.type === "Composite"
                      ? `${styles.typeBadge} ${styles.composite}`
                      : `${styles.typeBadge} ${styles.sugar}`
                  }
                >
                  {prop.type}
                </span>
              </span>

              {/* ACTIONS */}
              <div className={styles.actions}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={styles.actionButton}
                  onClick={() => handleEdit(prop)}
                >
                  <Pencil className={styles.actionIcon} strokeWidth={1.5} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                  onClick={() => handleDelete(prop.id)}
                >
                  <Trash2 className={styles.deleteIcon} strokeWidth={1.5} />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <section className={styles.noItensGrid}>
            <div>
              <img
                src={image}
                alt="Solid rocket motor"
                className={styles.rocket_image}
              />

              <div className={styles.noItensMessage}>
                <h1 className={styles.noItensTitle}>
                  Nenhum propelente encontrado!
                </h1>

                <p className={styles.noItensSubtitle}>
                  Crie um novo propelente para começar a desenvolver seu motor
                  sólido. Aperte{" "}
                  <strong className={styles.keyboard_shortcut}>
                    {" "}
                    Ctrl + Q{" "}
                  </strong>{" "}
                  para criar um novo propelente.
                </p>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* --- MODAL DE CADASTRO --- */}
      <PropellantsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        propellantToEdit={editingPropellant}
      />
    </section>
  );
}
