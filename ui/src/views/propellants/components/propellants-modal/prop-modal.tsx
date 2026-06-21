import styles from "./prop-modal.module.css";
import { Button } from "../../../../ui/button/button";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { showToast } from "../../../../ui/toast/toast-container";
import { Propellant } from "../../PropellantsView";
import { getBaseUrl } from "../../../../api/api";

interface PropellantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (propellant: Propellant, isEdit: boolean) => void;
  propellantToEdit?: Propellant | null;
}

const initialFormData = {
  name: "",
  density: 0,
  burnRateA: 0,
  burnRateN: 0,
  theoreticalIsp: 0,
  type: "Sugar",
};

export default function PropellantsModal({
  isOpen,
  onClose,
  onSuccess,
  propellantToEdit,
}: PropellantsModalProps) {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (propellantToEdit && isOpen) {
      setFormData(propellantToEdit);
    } else {
      setFormData(initialFormData);
    }
  }, [propellantToEdit, isOpen]);

  const handleSavePropellant = async (e: React.FormEvent) => {
    e.preventDefault();

    const baseUrl = await getBaseUrl();
    const isEdit = !!propellantToEdit;
    const url = isEdit
      ? `${baseUrl}/api/propellants/${propellantToEdit.id}`
      : `${baseUrl}/api/propellants`;
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
          message: `Propellant ${isEdit ? "updated" : "created"} successfully.`,
        });
        const savedPropellant = await response.json();
        onSuccess(savedPropellant, isEdit);
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
        message: "Failed to save propellant.",
      });
      console.error("Error saving propellant:", error);
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
          <h2>{propellantToEdit ? "Editar" : "Novo"} Propelente</h2>
          <button onClick={closeModal} className={styles.closeModalBtn}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSavePropellant} className={styles.modalForm}>
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
              <label>Isp Teórico (s)</label>
              <input
                type="number"
                step="1"
                required
                value={formData.theoreticalIsp || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    theoreticalIsp: parseFloat(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Coef. Queima 'a'</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.burnRateA || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    burnRateA: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label>Expoente 'n'</label>
              <input
                type="number"
                step="0.001"
                required
                value={formData.burnRateN || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    burnRateN: parseFloat(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Tipo</label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            >
              <option value="Sugar">Sugar</option>
              <option value="Composite">Composite</option>
            </select>
          </div>

          <div className={styles.modalFooter}>
            <Button type="button" variant="ghost" onClick={closeModal}>
              Cancelar
            </Button>
            <Button type="submit">
              {propellantToEdit ? "Atualizar" : "Salvar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
