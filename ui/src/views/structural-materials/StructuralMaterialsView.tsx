import { useEffect, useState } from "react";
import { FooterProps } from "../../components/layout/footer/footer";
import styles from "./StructuralMaterialsView.module.css";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "../../ui/button/button";
import StructuralHeader from "./components/structural-header/struct-header";
import image from "../../assets/structural-materials.png";
import { showToast } from "../../ui/toast/toast-container";
import StructuralMaterialsModal from "./components/structural-modal/struct-modal";
import { useShortcut } from "../../hooks/use-shortcut";

export interface StructuralMaterial {
  id: string;
  name: string;
  yieldStrength: number;
  ultimateTensileStrength: number;
  density: number;
  elasticModulus: number;
}

interface StructuralMaterialsViewProps {
  setFooter: (data: FooterProps) => void;
}

export default function StructuralMaterialsView({
  setFooter,
}: StructuralMaterialsViewProps) {
  const [structuralMaterials, setStructuralMaterials] = useState<
    StructuralMaterial[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [editingStructuralMaterial, setEditingStructuralMaterial] =
    useState<StructuralMaterial | null>(null);

  useEffect(() => {
    setFooter({
      index: structuralMaterials.length || 0,
      description:
        structuralMaterials.length === 1
          ? "Material estrutural encontrado"
          : "Materiais estruturais encontrados",
      rightText: "Unidades: SI (MPa, GPa, g/cm³)",
    });
  }, [structuralMaterials, setFooter]);

  useEffect(() => {
    fetchStructuralMaterials();
  }, []);

  const fetchStructuralMaterials = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/structural-materials",
      );
      if (response.ok) {
        const data = await response.json();
        setStructuralMaterials(data);
      }
    } catch (error) {
      showToast({
        type: "error",
        title: "Fetch Failed",
        message: "Failed to fetch structural materials.",
      });
      console.error("Error fetching structural materials:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingStructuralMaterial(null);
    setIsModalOpen(true);
  };

  useShortcut("m", handleAddNew, { ctrl: true });

  const handleEdit = (material: StructuralMaterial) => {
    setEditingStructuralMaterial(material);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/structural-materials/${id}`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        showToast({
          type: "success",
          title: "Deleted",
          message: "Structural material deleted successfully.",
        });
        setStructuralMaterials((prev) => prev.filter((m) => m.id !== id));
      } else {
        showToast({
          type: "error",
          title: "Deletion Failed",
          message: "Failed to delete structural material.",
        });
      }
    } catch (error) {
      showToast({
        type: "error",
        title: "Deletion Failed",
        message: "Failed to delete structural material.",
      });
      console.error("Error deleting structural material:", error);
    }
  };

  const handleModalSuccess = (
    savedStructuralMaterial: StructuralMaterial,
    isEdit: boolean,
  ) => {
    if (isEdit) {
      setStructuralMaterials((prev) =>
        prev.map((m) =>
          m.id === savedStructuralMaterial.id ? savedStructuralMaterial : m,
        ),
      );
    } else {
      setStructuralMaterials((prev) => [...prev, savedStructuralMaterial]);
    }
  };

  return (
    <section className={styles.structural_materials_view}>
      <div className={styles.button_container}>
        <Button size="lg" onClick={handleAddNew}>
          <Plus className={styles.addButtonIcon} strokeWidth={2} />
          Adicionar Material
        </Button>
      </div>

      <div className={styles.list}>
        {/* TABLE HEADER */}
        <StructuralHeader />

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
        ) : structuralMaterials.length > 0 ? (
          structuralMaterials.map((material) => (
            <div key={material.id} className={styles.tableRow}>
              {/* NAME */}
              <span className={styles.materialName}>
                <div className={styles.materialDot} />
                {material.name}
              </span>

              {/* YIELD STRENGTH */}
              <span className={styles.numericColumn}>
                {material.yieldStrength.toFixed(0)}
                <span className={styles.unit}>MPa</span>
              </span>

              {/* ULTIMATE TENSILE */}
              <span className={styles.numericColumn}>
                {material.ultimateTensileStrength.toFixed(0)}
                <span className={styles.unit}>MPa</span>
              </span>

              {/* DENSITY */}
              <span className={styles.numericColumn}>
                {material.density.toFixed(2)}
                <span className={styles.unit}>g/cm³</span>
              </span>

              {/* ELASTIC MODULUS */}
              <span className={styles.numericColumn}>
                {material.elasticModulus.toFixed(1)}
                <span className={styles.unit}>GPa</span>
              </span>

              {/* ACTIONS */}
              <div className={styles.actions}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={styles.actionButton}
                  onClick={() => handleEdit(material)}
                >
                  <Pencil className={styles.actionIcon} strokeWidth={1.5} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                  onClick={() => handleDelete(material.id)}
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
                alt="Solid rocket motor materials"
                className={styles.rocket_image}
              />

              <div className={styles.noItensMessage}>
                <h1 className={styles.noItensTitle}>
                  Nenhum material encontrado!
                </h1>

                <p className={styles.noItensSubtitle}>
                  Crie um novo material para começar a desenvolver seu motor
                  sólido. Aperte{" "}
                  <strong className={styles.keyboard_shortcut}>
                    {" "}
                    Ctrl + M{" "}
                  </strong>{" "}
                  para criar um novo material.
                </p>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* --- MODAL DE CADASTRO --- */}
      <StructuralMaterialsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        materialToEdit={editingStructuralMaterial}
      />
    </section>
  );
}
