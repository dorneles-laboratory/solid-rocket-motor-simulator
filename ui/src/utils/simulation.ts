import { ProjectData } from "../views/dashboard/DashboardView";
import { Propellant } from "../views/propellants/PropellantsView";

export type SimulationStatus = "SUCCESS" | "CATO" | "ERROR" | "TIMEOUT";

export interface SimulationResult {
  status: SimulationStatus;
  message: string;
  timeData: number[];
  thrustData: { x: number; y: number }[];
  pressureData: { x: number; y: number }[];
  pointsCount: number;
  metrics: {
    totalImpulse: number;
    avgThrust: number;
    maxThrust: number;
    isp: number;
    class: string;
    maxPressureBar: number;
    initialKn: number;
  };
}

export function runMotorSimulation(
  project: ProjectData,
  propellant: Propellant,
): SimulationResult | null {
  if (!project || !propellant) return null;

  try {
    // 1. Conversão Blindada
    let rCore = Number(project.grainInnerDiameter) / 2 / 1000;
    const rOuter = Number(project.grainOuterDiameter) / 2 / 1000;
    let Lseg = Number(project.grainSegmentsLength) / 1000;
    const segments =
      Number(project.grainSegments) > 0 ? Number(project.grainSegments) : 1;
    const At =
      Math.PI * Math.pow(Number(project.nozzleThroatDiameter) / 2 / 1000, 2);

    // Propelente
    const a = Number(propellant.burnRateA) || 0.00005;
    const n = Number(propellant.burnRateN) || 0.32;
    const rho = Number(propellant.density) || 1841;
    const cStar = 900;
    const gamma = 1.13;
    const pa = 101325;

    // Validação Inicial
    if (rCore >= rOuter) {
      return generateErrorResult(
        "O diâmetro do núcleo deve ser menor que o diâmetro externo.",
      );
    }

    // 2. Parâmetros da Câmara
    const rChamber = Number(project.motorChamberDiameter) / 2 / 1000;
    const LChamber = Number(project.motorChamberLength) / 1000;
    const V_chamber = Math.PI * Math.pow(rChamber, 2) * LChamber;

    const V_grain_initial =
      Math.PI * (Math.pow(rOuter, 2) - Math.pow(rCore, 2)) * Lseg * segments;
    const m_p = V_grain_initial * rho;

    let Vc = V_chamber - V_grain_initial;
    if (Vc < 0.00001) Vc = 0.00001;

    const Gamma = Math.sqrt(
      gamma * Math.pow(2 / (gamma + 1), (gamma + 1) / (gamma - 1)),
    );
    const RTc = Math.pow(cStar * Gamma, 2);
    const expansionTerm = Math.pow(2 / (gamma + 1), (gamma + 1) / (gamma - 1));

    // 3. Integração
    const dt = 0.001;
    let t = 0;
    let step = 0;
    let Pc = pa * 1.5;

    const thrustData: { x: number; y: number }[] = [];
    const pressureData: { x: number; y: number }[] = [];

    let totalImpulse = 0;
    let maxThrust = 0;
    let maxPressureBar = 0;

    let isBurning = rCore < rOuter && Lseg > 0;

    const coreAreaInit = 2 * Math.PI * rCore * Lseg;
    const endsAreaInit =
      2 * Math.PI * (Math.pow(rOuter, 2) - Math.pow(rCore, 2));
    const AbInit = (coreAreaInit + endsAreaInit) * segments;
    const initialKn = AbInit / At;

    let simulationStatus: SimulationStatus = "SUCCESS";
    let statusMessage = "Simulação concluída com sucesso.";

    // 4. Loop Transitório
    const MAX_TIME = 30; // 30 Segundos máximos
    const CATO_PRESSURE_BAR = 200; // Limite absurdo indicando falha catastrófica matemática

    while ((isBurning || Pc > pa * 1.05) && t < MAX_TIME) {
      let m_in = 0;
      let burnRate = 0;

      if (isBurning) {
        const coreArea = 2 * Math.PI * rCore * Lseg;
        const endsArea =
          2 * Math.PI * (Math.pow(rOuter, 2) - Math.pow(rCore, 2));
        const Ab = (coreArea + endsArea) * segments;

        burnRate = a * Math.pow(Pc, n);
        m_in = rho * Ab * burnRate;
      }

      let m_out = 0;
      if (Pc > pa) {
        m_out = (Pc * At) / cStar;
      }

      const dPc = (RTc / Vc) * (m_in - m_out) * dt;
      Pc += dPc;

      if (Pc < pa) Pc = pa;

      const currentPressureBar = Pc / 100000;

      // CHECAGEM DE FALHA CATASTRÓFICA (CATO)
      if (currentPressureBar > CATO_PRESSURE_BAR) {
        simulationStatus = "CATO";
        statusMessage = `Falha Catastrófica (CATO): A pressão excedeu ${CATO_PRESSURE_BAR} Bar em t=${t.toFixed(2)}s. Motor explodiu.`;
        maxPressureBar = currentPressureBar;
        break;
      }

      let Cf = 0;
      if (Pc > pa) {
        const pressureTerm = 1 - Math.pow(pa / Pc, (gamma - 1) / gamma);
        if (pressureTerm > 0) {
          Cf = Math.sqrt(
            ((2 * Math.pow(gamma, 2)) / (gamma - 1)) *
              expansionTerm *
              pressureTerm,
          );
        }
      }

      let thrust = Cf * Pc * At;
      if (isNaN(thrust) || !isFinite(thrust)) thrust = 0;

      if (isBurning) {
        rCore += burnRate * dt;
        Lseg -= 2 * burnRate * dt;
        Vc += (m_in / rho) * dt;

        isBurning = rCore < rOuter && Lseg > 0;
      }

      totalImpulse += thrust * dt;
      if (thrust > maxThrust) maxThrust = thrust;
      if (currentPressureBar > maxPressureBar)
        maxPressureBar = currentPressureBar;

      if (step % 10 === 0) {
        thrustData.push({
          x: Number(t.toFixed(3)),
          y: Number(thrust.toFixed(2)),
        });
        pressureData.push({
          x: Number(t.toFixed(3)),
          y: Number(currentPressureBar.toFixed(2)),
        });
      }

      t += dt;
      step++;
    }

    // CHECAGEM DE TIMEOUT
    if (t >= MAX_TIME && simulationStatus !== "CATO") {
      simulationStatus = "TIMEOUT";
      statusMessage = `Simulação abortada: O tempo excedeu o limite de segurança (${MAX_TIME}s).`;
    }

    // 5. Fechamento das Métricas
    const avgThrust = t > 0 ? totalImpulse / t : 0;
    const isp = m_p > 0 ? totalImpulse / (m_p * 9.80665) : 0;

    let motorClass = "O+";
    const limits = [
      2.5, 5, 10, 20, 40, 80, 160, 320, 640, 1280, 2560, 5120, 10240, 20480,
    ];
    const letters = [
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
    ];
    for (let i = 0; i < limits.length; i++) {
      if (totalImpulse <= limits[i]) {
        motorClass = letters[i];
        break;
      }
    }

    return {
      status: simulationStatus,
      message: statusMessage,
      timeData: thrustData.map((d) => d.x),
      thrustData,
      pressureData,
      pointsCount: thrustData.length,
      metrics: {
        totalImpulse,
        avgThrust,
        maxThrust,
        isp,
        class: motorClass,
        maxPressureBar,
        initialKn,
      },
    };
  } catch (error) {
    console.error("Simulation error:", error);
    return generateErrorResult("Erro interno no cálculo termodinâmico.");
  }
}

// Função auxiliar para retornar erros limpos
function generateErrorResult(message: string): SimulationResult {
  return {
    status: "ERROR",
    message,
    timeData: [],
    thrustData: [],
    pressureData: [],
    pointsCount: 0,
    metrics: {
      totalImpulse: 0,
      avgThrust: 0,
      maxThrust: 0,
      isp: 0,
      class: "---",
      maxPressureBar: 0,
      initialKn: 0,
    },
  };
}
