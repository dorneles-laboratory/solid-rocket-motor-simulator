import styles from "./dash-input.module.css"
import type { MotorDimensions, FocusedSection } from "../dash-motor-geometry/dash-motor-geometry"
import DashboardPropertyGroup from "./dash-property-group"
import PropertyField from "./dash-property-field"
import DashboardInputHeader from "./dash-input-header/dash-input-header"
import type { Propellant } from "../../../propellants/PropellantsView"
import DashboardInputRunSimulation from "./dash-input-run-simulation/dash-input-run-simulation"

interface InputPanelProps {
  dimensions?: MotorDimensions
  propellant?: Propellant 
  isSimulating?: boolean
  onDimensionsChange?: (dimensions: MotorDimensions) => void
  onFocusChange?: (section: FocusedSection) => void
  onRunSimulation?: () => void
}

// Fallback de segurança para as dimensões
const defaultDimensions: MotorDimensions = {
  chamberDiameter: 0,
  chamberLength: 0,
  grainOuterDiameter: 0,
  grainCoreDiameter: 0,
  grainLength: 0,
  throatDiameter: 0,
  convergenceAngle: 0,
  divergenceAngle: 0,
}

export default function DashboardInputPanel({
  dimensions = defaultDimensions,
  propellant,
  isSimulating = false,
  onDimensionsChange,
  onFocusChange,
  onRunSimulation,
}: InputPanelProps) {
  // Função centralizada para atualizar qualquer dimensão de forma limpa
  const updateDimension = (key: keyof MotorDimensions, value: number) => {
    if (onDimensionsChange) {
      onDimensionsChange({ ...dimensions, [key]: value })
    }
  }

  // Função centralizada para lidar com o foco
  const handleFocus = (section: FocusedSection) => {
    if (onFocusChange) onFocusChange(section)
  }

  return (
    <section className={styles.inputPanel}>
      <DashboardInputHeader />

      {/* Property Grid */}
      <div className={styles.scrollContent}>
        
        {/* Chamber / Casing */}
        <DashboardPropertyGroup title="Carcaça">
          <PropertyField
            id="chamber-diameter"
            label="Diametro Interno"
            unit="mm"
            value={dimensions.chamberDiameter}
            onChange={(v) => updateDimension("chamberDiameter", v)}
            onFocus={() => handleFocus("chamber-diameter")}
            onBlur={() => handleFocus(null)}
          />
          <PropertyField
            id="chamber-length"
            label="Comprimento"
            unit="mm"
            value={dimensions.chamberLength}
            onChange={(v) => updateDimension("chamberLength", v)}
            onFocus={() => handleFocus("chamber-length")}
            onBlur={() => handleFocus(null)}
          />
        </DashboardPropertyGroup>

        {/* Propellant Grain */}
        <DashboardPropertyGroup title="Grao Propelente">
          <PropertyField
            id="grain-outer"
            label="Diametro Externo"
            unit="mm"
            value={dimensions.grainOuterDiameter}
            onChange={(v) => updateDimension("grainOuterDiameter", v)}
            onFocus={() => handleFocus("grain-outer")}
            onBlur={() => handleFocus(null)}
          />
          <PropertyField
            id="grain-core"
            label="Diametro Nucleo"
            unit="mm"
            value={dimensions.grainCoreDiameter}
            onChange={(v) => updateDimension("grainCoreDiameter", v)}
            onFocus={() => handleFocus("grain-core")}
            onBlur={() => handleFocus(null)}
          />
          <PropertyField
            id="grain-length"
            label="Comprimento"
            unit="mm"
            value={dimensions.grainLength}
            onChange={(v) => updateDimension("grainLength", v)}
            onFocus={() => handleFocus("grain-length")}
            onBlur={() => handleFocus(null)}
          />
        </DashboardPropertyGroup>

        {/* Nozzle */}
        <DashboardPropertyGroup title="Bocal">
          <PropertyField
            id="throat-diameter"
            label="Diametro Garganta"
            unit="mm"
            value={dimensions.throatDiameter}
            onChange={(v) => updateDimension("throatDiameter", v)}
            onFocus={() => handleFocus("nozzle-throat")}
            onBlur={() => handleFocus(null)}
          />
          <PropertyField
            id="conv-angle"
            label="Angulo Conv."
            unit="deg"
            value={dimensions.convergenceAngle}
            onChange={(v) => updateDimension("convergenceAngle", v)}
            onFocus={() => handleFocus("nozzle-convergence")}
            onBlur={() => handleFocus(null)}
          />
          <PropertyField
            id="div-angle"
            label="Angulo Div."
            unit="deg"
            value={dimensions.divergenceAngle}
            onChange={(v) => updateDimension("divergenceAngle", v)}
            onFocus={() => handleFocus("nozzle-divergence")}
            onBlur={() => handleFocus(null)}
          />
        </DashboardPropertyGroup>

        {/* Propellant Properties (Static info) */}
        <DashboardPropertyGroup title="Propelente">
          <div className={styles.staticRow}>
            <span className={styles.staticLabel}>Nome</span>
            {/* Uso do fallback caso propellant seja undefined */}
            <span className={styles.staticValue}>{propellant?.name || "N/A"}</span>
          </div>

          <div className={styles.staticRow}>
            <span className={styles.staticLabel}>Tipo</span>
            <span className={styles.staticValue}>{propellant?.type || "N/A"}</span>
          </div>

          <div className={styles.staticRow}>
            <span className={styles.staticLabel}>Densidade</span>
            <div className={styles.staticValueWrapper}>
              <span className={styles.staticValue}>{propellant?.density || 0}</span>
              <span className={styles.staticUnit}>g/cm³</span>
            </div>
          </div>

          <div className={styles.staticRow}>
            <span className={styles.staticLabel}>Coeficiente a</span>
            <div className={styles.staticValueWrapper}>
              <span className={styles.staticValue}>{propellant?.burnRateA || 0}</span>
            </div>
          </div>

          <div className={styles.staticRow}>
            <span className={styles.staticLabel}>Expoente n</span>
            <div className={styles.staticValueWrapper}>
              <span className={styles.staticValue}>{propellant?.burnRateN || 0}</span>
            </div>
          </div>

          <div className={styles.staticRow}>
            <span className={styles.staticLabel}>ISP Teórico</span>
            <div className={styles.staticValueWrapper}>
              <span className={styles.staticValue}>{propellant?.theoreticalIsp || 0}</span>
              <span className={styles.staticUnit}>s</span>
            </div>
          </div>
        </DashboardPropertyGroup>
      </div>

      <footer className={styles.footer}>
        <DashboardInputRunSimulation 
          onRunSimulation={onRunSimulation} 
          isLoading={isSimulating} 
        />
      </footer>
    </section>
  )
}