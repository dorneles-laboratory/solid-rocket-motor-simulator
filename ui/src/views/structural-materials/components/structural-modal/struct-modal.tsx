import styles from "./struct-modal.module.css";
import { Button } from "../../../../ui/button/button";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { showToast } from "../../../../ui/toast/toast-container";
import { StructuralMaterial } from "../../StructuralMaterialsView";

interface StructuralMaterialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (material: StructuralMaterial, isEdit: boolean) => void;
  materialToEdit?: StructuralMaterial | null;
}

const initialFormData = {
  name: "",
  density: 0,
  yieldStrength: 0,
  ultimateTensileStrength: 0,
  elasticModulus: 0,
};

export default function StructuralMaterialsModal({
  isOpen,
  onClose,
  onSuccess,
  materialToEdit,
}: StructuralMaterialsModalProps) {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (materialToEdit && isOpen) {
      setFormData(materialToEdit);
    } else {
      setFormData(initialFormData);
    }
  }, [materialToEdit, isOpen]);

  const handleSaveStructuralMaterial = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEdit = !!materialToEdit;
    const url = isEdit
      ? `http://localhost:8080/api/structural-materials/${materialToEdit.id}`
      : "http://localhost:8080/api/structural-materials";
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
          message: `Structural material ${isEdit ? "updated" : "created"} successfully.`,
        });
        const savedStructuralMaterial = await response.json();
        onSuccess(savedStructuralMaterial, isEdit);
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
        message: "Failed to save structural material.",
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
          <h2>{materialToEdit ? "Editar" : "Novo"} Material Estrutural</h2>
          <button onClick={closeModal} className={styles.closeModalBtn}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSaveStructuralMaterial} className={styles.modalForm}>
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
              <label>Yield Strength (MPa)</label>
              <input
                type="number"
                step="1"
                required
                value={formData.yieldStrength || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    yieldStrength: parseFloat(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Ultimate Tensile Strength (MPa)</label>
              <input
                type="number"
                step="1"
                required
                value={formData.ultimateTensileStrength || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ultimateTensileStrength: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label>Elastic Modulus (GPa)</label>
              <input
                type="number"
                step="0.001"
                required
                value={formData.elasticModulus || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    elasticModulus: parseFloat(e.target.value),
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
