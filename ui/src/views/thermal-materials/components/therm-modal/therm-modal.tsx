import styles from "./therm-modal.module.css";
import { Button } from "../../../../ui/button/button";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { showToast } from "../../../../ui/toast/toast-container";
import { ThermalMaterial } from "../../ThermalMaterialsView";

interface ThermalMaterialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (material: ThermalMaterial, isEdit: boolean) => void;
  materialToEdit?: ThermalMaterial | null;
}

const initialFormData = {
  name: "",
  thermalConductivity: 0,
  specificHeat: 0,
  density: 0,
  maxServiceTemperature: 0,
  applications: "",
};

export default function ThermalMaterialsModal({
  isOpen,
  onClose,
  onSuccess,
  materialToEdit,
}: ThermalMaterialsModalProps) {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (materialToEdit && isOpen) {
      setFormData(materialToEdit);
    } else {
      setFormData(initialFormData);
    }
  }, [materialToEdit, isOpen]);

  const handleSaveThermalMaterial = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEdit = !!materialToEdit;
    const url = isEdit
      ? `http://localhost:8080/api/thermal-materials/${materialToEdit.id}`
      : "http://localhost:8080/api/thermal-materials";
    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast({
          type: "success",
          title: isEdit ? "Updated" : "Created",
          message: `Thermal material ${isEdit ? "updated" : "created"} successfully.`,
        });
        const savedThermalMaterial = await response.json();
        onSuccess(savedThermalMaterial, isEdit);
        setFormData(initialFormData);
        onClose();
      } else if (response.status === 409) {
        const errorMsg = await response.text();
        showToast({
          type: "error",
          title: "Creation Failed",
          message: errorMsg,
        });
      }
    } catch (error) {
      showToast({
        type: "error",
        title: "Save Failed",
        message: "Failed to save thermal material.",
      });
    }
  };

  const closeModal = () => {
    setFormData(initialFormData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>{materialToEdit ? "Editar" : "Novo"} Material Térmico</h2>
          <button onClick={closeModal} className={styles.closeModalBtn}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSaveThermalMaterial} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label>Nome</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Conductividade Térmica (W/m·K)</label>
              <input
                type="number"
                step="0.001"
                required
                value={formData.thermalConductivity || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    thermalConductivity: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label>Calor Específico (J/g·K)</label>
              <input
                type="number"
                step="0.001"
                required
                value={formData.specificHeat || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specificHeat: parseFloat(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Densidade (g/cm³)</label>
              <input
                type="number"
                step="0.001"
                required
                value={formData.density || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    density: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label>Max Service Temperature (°C)</label>
              <input
                type="number"
                step="0.001"
                required
                value={formData.maxServiceTemperature || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxServiceTemperature: parseFloat(e.target.value),
                  })
                }
              />
            </div>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Aplicações</label>
              <input
                type="string"
                value={formData.applications || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    applications: e.target.value,
                  })
                }
              />
            </div>
          </div>
        
          <div className={styles.modalFooter}>
            <Button type="button" variant="ghost" onClick={closeModal}>
              Cancelar
            </Button>
            <Button type="submit">
              {materialToEdit ? "Atualizar" : "Salvar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
