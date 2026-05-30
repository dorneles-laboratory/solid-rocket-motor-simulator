import { useEffect, useState } from 'react';
import { FooterProps } from '../../components/layout/footer/footer';
import styles from './ThermalMaterialsView.module.css';
import { Button } from '../../ui/button/button';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { showToast } from '../../ui/toast/toast-container';
import { useShortcut } from '../../hooks/use-shortcut';
import ThermalHeader from './components/thermal-header/therm-header';
import ThermalMaterialsModal from './components/therm-modal/therm-modal';
import image from '../../assets/thermal-materials.png';
export interface ThermalMaterial {
  id: string;
  name: string;
  thermalConductivity: number;
  specificHeat: number;
  density: number;
  maxServiceTemperature: number;
  applications: string;
}

interface ThermalMaterialsViewProps {
  setFooter: (data: FooterProps) => void;
}

export default function ThermalMaterialsView({ setFooter }: ThermalMaterialsViewProps) {
  useEffect(() => {
    setFooter({
      description: "Descubra uma ampla seleção de materiais térmicos para sua nave espacial, incluindo isolantes térmicos e materiais de proteção contra calor.",
      rightText: "Em breve uma nova funcionalidade."
    });
  }, [setFooter]);

    const [thermalMaterials, setThermalMaterials] = useState<
    ThermalMaterial[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [editingThermalMaterial, setEditingThermalMaterial] =
    useState<ThermalMaterial | null>(null);

  useEffect(() => {
    setFooter({
      index: thermalMaterials.length || 0,
      description:
        thermalMaterials.length === 1
          ? "Material térmico encontrado"
          : "Materiais térmicos encontrados",
      rightText: "Unidades: SI (MPa, GPa, g/cm³)",
    });
  }, [thermalMaterials, setFooter]);

  useEffect(() => {
    fetchThermalMaterials();
  }, []);

  const fetchThermalMaterials = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/thermal-materials"
      );
      if (response.ok) {
        const data = await response.json();
        setThermalMaterials(data);
      }
    } catch (error) {
      showToast({
        type: "error",
        title: "Fetch Failed",
        message: "Failed to fetch thermal materials.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingThermalMaterial(null);
    setIsModalOpen(true);
  };

  useShortcut('t', handleAddNew, { ctrl: true });

  const handleEdit = (material: ThermalMaterial) => {
    setEditingThermalMaterial(material);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/thermal-materials/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        showToast({
          type: "success",
          title: "Deleted",
          message: "Thermal material deleted successfully.",
        });
        setThermalMaterials((prev) => prev.filter((m) => m.id !== id));
      } else {
        showToast({
          type: "error",
          title: "Deletion Failed",
          message: "Failed to delete thermal material.",
        });
      }
    } catch (error) {
      showToast({
        type: "error",
        title: "Deletion Failed",
        message: "Failed to delete thermal material.",
      });
    }
  };

  const handleModalSuccess = (
    savedThermalMaterial: ThermalMaterial,
    isEdit: boolean
  ) => {
    if (isEdit) {
      setThermalMaterials((prev) =>
        prev.map((m) =>
          m.id === savedThermalMaterial.id ? savedThermalMaterial : m
        )
      );
    } else {
      setThermalMaterials((prev) => [...prev, savedThermalMaterial]);
    }
  };

  return (
    <section className={styles.thermal_materials_view}>
      <div className={styles.button_container}>
        <Button size="lg" onClick={handleAddNew}>
          <Plus className={styles.addButtonIcon} strokeWidth={2} />
          Adicionar Material
        </Button>
      </div>

      <div className={styles.list}>
        {/* TABLE HEADER */}
        <ThermalHeader />

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
        ) : thermalMaterials.length > 0 ? (
          thermalMaterials.map((material) => (
            <div key={material.id} className={styles.tableRow}>
              {/* NAME */}
              <span className={styles.materialName}>
                <div className={styles.materialDot} />
                {material.name}
              </span>

              {/* THERMAL CONDUCTIVITY */}
              <span className={styles.numericColumn}>
                {material.thermalConductivity.toFixed(2)}
                <span className={styles.unit}>W/m·K</span>
              </span>

              {/* SPECIFIC HEAT */}
              <span className={styles.numericColumn}>
                {material.specificHeat.toFixed(0)}
                <span className={styles.unit}>J/g·K</span>
              </span>

              {/* DENSITY */}
              <span className={styles.numericColumn}>
                {material.density.toFixed(2)}
                <span className={styles.unit}>g/cm³</span>
              </span>

              {/* MAX SERVICE TEMPERATURE */}
              <span className={styles.numericColumn}>
                {material.maxServiceTemperature.toFixed(1)}
                <span className={styles.unit}>°C</span>
              </span>

              {/* APPLICATION */}
              <span className={styles.textColumn}>
                {material.applications}
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
                style={{ transform: "rotate(50deg) translate(-8%, -4%)" }}
              />

              <div className={styles.noItensMessage}>
                <h1 className={styles.noItensTitle}>
                  Nenhum material encontrado!
                </h1>

                <p className={styles.noItensSubtitle}>
                  Crie um novo material para começar a desenvolver seu motor sólido.
                  Aperte{" "}
                  <strong className={styles.keyboard_shortcut}>
                    {" "}
                    Ctrl + T{" "}
                  </strong>{" "}
                  para criar um novo material.
                </p>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* --- MODAL DE CADASTRO --- */}
      <ThermalMaterialsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        materialToEdit={editingThermalMaterial}
      />
    </section>
  );
}

