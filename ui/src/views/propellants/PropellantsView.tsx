import styles from "./PropellantsView.module.css"
import { Button } from "../../ui/button/button"
import { Pencil, Plus, Trash2 } from 'lucide-react';
import Footer from "../../components/layout/footer/footer";
import { useEffect, useState } from "react";
import PropellantsHeader from "./components/propellants-header/prop-header";
import PropellantsModal from "./components/propellants-modal/prop-modal";

interface Propellant {
  id: string
  name: string
  density: number
  burnRateA: number
  burnRateN: number
  theoreticalIsp: number
  type: string
}

export default function PropellantsView() {
  const [propellants, setPropellants] = useState<Propellant[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [editingPropellant, setEditingPropellant] = useState<Propellant | null>(null);

  useEffect(() => {
    fetchPropellants();
  }, []);

  const fetchPropellants = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/propellants');
      if (response.ok) {
        const data = await response.json();
        setPropellants(data);
      }
    } catch (error) {
      console.error("Erro ao buscar propelentes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingPropellant(null);
    setIsModalOpen(true);
  };

  const handleEdit = (propellant: Propellant) => {
    setEditingPropellant(propellant);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/propellants/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setPropellants((prev) => prev.filter((p) => p.id !== id));
      } else {
        console.error("Erro ao deletar propelente:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao deletar propelente:", error);
    }
  };

  const handleModalSuccess = (savedPropellant: Propellant, isEdit: boolean) => {
    if (isEdit) {
      setPropellants((prev) => 
        prev.map((p) => p.id === savedPropellant.id ? savedPropellant : p)
      );
    } else {
      setPropellants((prev) => [...prev, savedPropellant]);
    }
  };

  return (
    <main className={styles.propellants_view}>
      <div className={styles.button_container}>
        <Button size="lg" onClick={handleAddNew}>
          <Plus
            className={styles.addButtonIcon}
            strokeWidth={2}
          />
          Adicionar Propelente
        </Button>
      </div>

      <div className={styles.propellants_list}>
        {/* TABLE HEADER */}
        <PropellantsHeader />

        {/* TABLE ROWS */}
        {isLoading ? (
          <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--muted-foreground)' }}>
            Carregando dados do servidor...
          </div>
        ) : (
          propellants.map((prop) => (
            <div key={prop.id} className={styles.tableRow}>
              {/* NAME */}
              <span className={styles.propellantName}>
                <div
                  className={styles.propellantDot}
                  style={{
                    backgroundColor: prop.type === "Composite" ? "#f97316" : "#22c55e",
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
                <Button variant="ghost" size="sm" className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => handleDelete(prop.id)}>
                  <Trash2 className={styles.deleteIcon} strokeWidth={1.5} />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Footer
        index={propellants.length}
        description="propelentes cadastrados"
        legends={[
          {
            label: "Composite",
            color: "#f97316",
          },
          {
            label: "Sugar",
            color: "#22c55e",
          },
        ]}
      />

      {/* --- MODAL DE CADASTRO --- */}
      <PropellantsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleModalSuccess}
        propellantToEdit={editingPropellant}
      />
    </main>
  )
}