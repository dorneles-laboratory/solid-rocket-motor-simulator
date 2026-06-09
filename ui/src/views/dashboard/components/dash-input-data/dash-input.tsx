import styles from "./dash-input.module.css"
import type { MotorDimensions, FocusedSection } from "../dash-motor-geometry/dash-motor-geometry"
import DashboardPropertyGroup from "./dash-property-group"
import PropertyField from "./dash-property-field"
import DashboardInputHeader from "./dash-input-header/dash-input-header"
import type { Propellant } from "../../../propellants/PropellantsView"
import DashboardInputRunSimulation from "./dash-input-run-simulation/dash-input-run-simulation"
import { SimulationConfig } from "../../../../utils/simulation"

interface InputPanelProps {
  dimensions?: MotorDimensions
  propellant?: Propellant 
  isSimulating?: boolean
  simConfig: SimulationConfig;
  onSimConfigChange: (config: SimulationConfig) => void;
  onDimensionsChange?: (dimensions: MotorDimensions) => void
  onFocusChange?: (section: FocusedSection) => void
  onRunSimulation?: () => void
}

const defaultDimensions: MotorDimensions = {
  chamberDiameter: 0,
  chamberLength: 0,
  grainOuterDiameter: 0,
  grainCoreDiameter: 0,
  grainLength: 0,
  grainSegments: 0,
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
  simConfig,
  onSimConfigChange
}: InputPanelProps) {
    const handleDimensionChange = (key: keyof MotorDimensions, rawValue: string | number) => {
    if (!onDimensionsChange) return

    if (rawValue === "" || rawValue === undefined) {
      onDimensionsChange({ ...dimensions, [key]: 0 })
      return
    }

    const cleanString = String(rawValue).replace(/^0+(?=\d)/, '')

    onDimensionsChange({ ...dimensions, [key]: Number(cleanString) })
  }

  const handleFocus = (section: FocusedSection) => {
    if (onFocusChange) onFocusChange(section)
  }

  const displayValue = (val: number) => val === 0 ? "" : val

  return (
    <section className={styles.inputPanel}>
      <DashboardInputHeader />

      <div className={styles.scrollContent}>
        
        {/* Chamber / Casing */}
        <DashboardPropertyGroup title="Carcaça">
          <PropertyField
            id="chamber-diameter"
            label="Diametro Interno"
            unit="mm"
            value={displayValue(dimensions.chamberDiameter)}
            onChange={(v) => handleDimensionChange("chamberDiameter", v)}
            onFocus={() => handleFocus("chamber-diameter")}
            onBlur={() => handleFocus(null)}
          />
          <PropertyField
            id="chamber-length"
            label="Comprimento"
            unit="mm"
            value={displayValue(dimensions.chamberLength)}
            onChange={(v) => handleDimensionChange("chamberLength", v)}
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
            value={displayValue(dimensions.grainOuterDiameter)}
            onChange={(v) => handleDimensionChange("grainOuterDiameter", v)}
            onFocus={() => handleFocus("grain-outer")}
            onBlur={() => handleFocus(null)}
          />
          <PropertyField
            id="grain-core"
            label="Diametro Nucleo"
            unit="mm"
            value={displayValue(dimensions.grainCoreDiameter)}
            onChange={(v) => handleDimensionChange("grainCoreDiameter", v)}
            onFocus={() => handleFocus("grain-core")}
            onBlur={() => handleFocus(null)}
          />
          <PropertyField
            id="grain-length"
            label="Comprimento"
            unit="mm"
            value={displayValue(dimensions.grainLength)}
            onChange={(v) => handleDimensionChange("grainLength", v)}
            onFocus={() => handleFocus("grain-length")}
            onBlur={() => handleFocus(null)}
          />

          <PropertyField
            id="grain-segments"
            label="Qtd. Segmentos"
            unit="un"
            value={displayValue(dimensions.grainSegments)}
            onChange={(v) => handleDimensionChange("grainSegments", v)}
            onFocus={() => handleFocus("grain-segments")}
            onBlur={() => handleFocus(null)}
          />
        </DashboardPropertyGroup>

        {/* Nozzle */}
        <DashboardPropertyGroup title="Bocal">
          <PropertyField
            id="throat-diameter"
            label="Diametro Garganta"
            unit="mm"
            value={displayValue(dimensions.throatDiameter)}
            onChange={(v) => handleDimensionChange("throatDiameter", v)}
            onFocus={() => handleFocus("nozzle-throat")}
            onBlur={() => handleFocus(null)}
          />
          <PropertyField
            id="conv-angle"
            label="Angulo Conv."
            unit="deg"
            value={displayValue(dimensions.convergenceAngle)}
            onChange={(v) => handleDimensionChange("convergenceAngle", v)}
            onFocus={() => handleFocus("nozzle-convergence")}
            onBlur={() => handleFocus(null)}
          />
          <PropertyField
            id="div-angle"
            label="Angulo Div."
            unit="deg"
            value={displayValue(dimensions.divergenceAngle)}
            onChange={(v) => handleDimensionChange("divergenceAngle", v)}
            onFocus={() => handleFocus("nozzle-divergence")}
            onBlur={() => handleFocus(null)}
          />
        </DashboardPropertyGroup>

        {/* Propellant Properties (Static info) */}
        <DashboardPropertyGroup title="Propelente">
          <div className={styles.staticRow}>
            <span className={styles.staticLabel}>Nome</span>
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
        <div className={styles.simSettingsWrapper}>
          <div className={styles.simSettingItem}>
            <label>Motor</label>
            <select 
              className={styles.simSettingSelect}
              value={simConfig.method}
              onChange={(e) => onSimConfigChange({...simConfig, method: e.target.value as "EULER" | "RK4"})}
            >
              <option value="RK4">RK4</option>
              <option value="EULER">Euler</option>
            </select>
          </div>

          <div className={styles.simSettingItem}>
            <label>Passo (dt)</label>
            <select 
              className={styles.simSettingSelect}
              value={simConfig.timeStep}
              onChange={(e) => onSimConfigChange({...simConfig, timeStep: Number(e.target.value)})}
            >
              <option value={0.001}>1 ms</option>
              <option value={0.005}>5 ms</option>
              <option value={0.010}>10 ms</option>
            </select>
          </div>

          <div className={styles.simSettingItem}>
            <label>Resolução</label>
            <select 
              className={styles.simSettingSelect}
              value={simConfig.pointsCount}
              onChange={(e) => onSimConfigChange({...simConfig, pointsCount: Number(e.target.value)})}
            >
              <option value={100}>100 pts</option>
              <option value={500}>500 pts</option>
              <option value={1000}>1000 pts</option>
            </select>
          </div>
        </div>

        <DashboardInputRunSimulation 
          onRunSimulation={onRunSimulation} 
          isLoading={isSimulating} 
        />
      </footer>
    </section>
  )
}