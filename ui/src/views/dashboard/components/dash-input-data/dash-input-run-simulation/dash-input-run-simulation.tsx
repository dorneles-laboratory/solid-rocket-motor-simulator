import styles from "./dash-run-simulation.module.css"
import { Rocket, Loader2 } from "lucide-react"

interface DashboardInputRunSimulationProps {
  onRunSimulation?: () => void;
  isLoading?: boolean;
}

export default function DashboardInputRunSimulation({ 
  onRunSimulation, 
  isLoading = false 
}: DashboardInputRunSimulationProps) {
  return (
    <button
      type="button"
      onClick={onRunSimulation}
      disabled={isLoading}
      className={`${styles.runButton} ${isLoading ? styles.disabled : ""}`.trim()}
    >
      {isLoading ? (
        <Loader2 size={16} className={styles.spinner} />
      ) : (
        <Rocket size={16} />
      )}
      {isLoading ? "Calculando..." : "Executar Simulação"}
    </button>
  );
}