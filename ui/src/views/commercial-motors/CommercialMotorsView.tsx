import { useEffect, useState } from "react";
import { Filter, GitCompare } from "lucide-react";
import styles from "./CommercialMotorsView.module.css";
import { FooterProps } from "../../components/layout/footer/footer";
import { showToast } from "../../ui/toast/toast-container";
import image from "../../assets/commercial-motors.png";
import CMotorsCard from "./components/cmotors-card/cmotors-card";
import { getBaseUrl } from "../../api/api";

export interface CommercialMotor {
  id: string;
  manufacturer: string;
  designation: string;
  impulseClass: string;
  totalImpulse: number;
  maxThrust: number;
  burnTime: number;
  propellantMass: number;
  diameter: number;
}

const impulseClasses = [
  "ALL",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
];

interface CommercialMotorsViewProps {
  setFooter: (data: FooterProps) => void;
}

export default function CommercialMotorsView({
  setFooter,
}: CommercialMotorsViewProps) {
  const [filterClass, setFilterClass] = useState("ALL");
  const [selectedMotors, setSelectedMotors] = useState<string[]>([]);
  const [commercialMotors, setCommercialMotors] = useState<CommercialMotor[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);

  const filteredMotors = commercialMotors.filter((motor) => {
    return filterClass === "ALL" || motor.impulseClass === filterClass;
  });

  useEffect(() => {
    setFooter({
      index: filteredMotors.length || 0,
      description:
        filteredMotors.length === 1
          ? "motor encontrado"
          : "motores encontrados",
      rightText: "Dados: ThrustCurve.org",
    });
  }, [filteredMotors.length, setFooter]);

  useEffect(() => {
    fetchCommercialMotors();
  }, []);

  const fetchCommercialMotors = async () => {
    try {
      const baseUrl = await getBaseUrl();
      const response = await fetch(`${baseUrl}/api/commercial-motors`);
      if (response.ok) {
        const data = await response.json();
        setCommercialMotors(data);
      }
    } catch (error) {
      console.error("Erro ao buscar motores comerciais:", error);
      showToast({
        type: "error",
        title: "Fetch Failed",
        message: "Failed to fetch commercial motors.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMotorSelection = (id: string) => {
    setSelectedMotors((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  return (
    <section className={styles.commercialMotorsView}>
      {/* Action Bar */}
      <div className={styles.actionBar}>
        {selectedMotors.length > 0 && (
          <button type="button" className={styles.compareHeaderBtn}>
            <GitCompare size={12} strokeWidth={2} />
            Comparar ({selectedMotors.length})
          </button>
        )}

        <div className={styles.filterWrapper}>
          <Filter
            className={styles.filterIcon}
            strokeWidth={1.5}
            style={{
              color:
                filterClass !== "ALL"
                  ? "var(--primary)"
                  : "var(--muted-foreground)",
            }}
          />
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className={styles.select}
          >
            {impulseClasses.map((cls) => (
              <option key={cls} value={cls}>
                {cls === "ALL" ? "Todas as Classes" : `Classe ${cls}`}
              </option>
            ))}
          </select>
        </div>
      </div>

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
      ) : filteredMotors.length > 0 ? (
        <div className={styles.grid}>
          {filteredMotors.map((motor) => (
            // CORREÇÃO: Passando as props corretamente e adicionando a key do React
            <CMotorsCard
              key={motor.id}
              motor={motor}
              isSelected={selectedMotors.includes(motor.id)}
              toggleMotorSelection={toggleMotorSelection}
            />
          ))}
        </div>
      ) : (
        <section className={styles.noItensGrid}>
          <div>
            <img
              src={image}
              alt="Solid rocket motor"
              className={styles.rocket_image}
              style={{ transform: "rotate(50deg) translate(-8%, -4%)" }}
            />

            <div className={styles.noItensMessage}>
              <h1 className={styles.noItensTitle}>
                Nenhum Motor Comercial encontrado!
              </h1>

              <p className={styles.noItensSubtitle}>
                Parece que não há motores comerciais disponíveis para a classe
                selecionada. Tente selecionar{" "}
                <span className={styles.keyboard_shortcut}>
                  Todas as Classes
                </span>{" "}
                ou outra classe específica para ver os motores correspondentes.
              </p>
            </div>
          </div>
        </section>
      )}
    </section>
  );
}
