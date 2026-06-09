import { ProjectData } from "../views/dashboard/DashboardView"; 
import { Propellant } from "../views/propellants/PropellantsView"; 

export type SimulationStatus = "SUCCESS" | "CATO" | "ERROR" | "TIMEOUT";
export type IntegrationMethod = "EULER" | "RK4";

export interface SimulationConfig {
  timeStep: number;         // Passo de integração em segundos (ex: 0.001 para 1ms)
  method: IntegrationMethod; // Método matemático ("EULER" ou "RK4")
  pointsCount: number;      // Quantidade de pontos no gráfico (ex: 100, 500, 1000)
}

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

// Função auxiliar para subamostragem (downsampling) dos arrays de dados
function downsample<T>(data: T[], targetCount: number): T[] {
  if (data.length <= targetCount || targetCount <= 0) return data;
  
  const step = (data.length - 1) / (targetCount - 1);
  const result: T[] = [];
  
  for (let i = 0; i < targetCount; i++) {
    result.push(data[Math.round(i * step)]);
  }
  
  return result;
}

export function runMotorSimulation(
  project: ProjectData,
  propellant: Propellant,
  config: SimulationConfig = { timeStep: 0.001, method: "EULER", pointsCount: 500 }
): SimulationResult | null {
  if (!project || !propellant) return null;

  try {
    // 1. Conversão Blindada
    let rCore = (Number(project.grainInnerDiameter) / 2) / 1000;
    const rOuter = (Number(project.grainOuterDiameter) / 2) / 1000;
    let Lseg = Number(project.grainSegmentsLength) / 1000;
    const segments = Number(project.grainSegments) > 0 ? Number(project.grainSegments) : 1;
    const At = Math.PI * Math.pow((Number(project.nozzleThroatDiameter) / 2) / 1000, 2);
    
    // Propelente
    const a = Number(propellant.burnRateA) || 0.00005; 
    const n = Number(propellant.burnRateN) || 0.32;  
    const rho = (Number(propellant.density) || 1841); 
    const cStar = 900; 
    const gamma = 1.13; 
    const pa = 101325; 

    if (rCore >= rOuter) {
      return generateErrorResult("O diâmetro do núcleo deve ser menor que o diâmetro externo.");
    }

    // 2. Parâmetros da Câmara
    const rChamber = (Number(project.motorChamberDiameter) / 2) / 1000;
    const LChamber = Number(project.motorChamberLength) / 1000;
    const V_chamber = Math.PI * Math.pow(rChamber, 2) * LChamber;
    
    const V_grain_initial = Math.PI * (Math.pow(rOuter, 2) - Math.pow(rCore, 2)) * Lseg * segments;
    const m_p = V_grain_initial * rho;

    let Vc = V_chamber - V_grain_initial;
    if (Vc < 0.00001) Vc = 0.00001; 

    const Gamma = Math.sqrt(gamma * Math.pow(2 / (gamma + 1), (gamma + 1) / (gamma - 1)));
    const RTc = Math.pow(cStar * Gamma, 2);
    const expansionTerm = Math.pow(2 / (gamma + 1), (gamma + 1) / (gamma - 1));

    // 3. Configurações de Integração
    const dt = config.timeStep; 
    let t = 0;
    let Pc = pa * 1.5; 
    
    // Arrays temporários de alta resolução
    const rawThrustData: { x: number; y: number }[] = [];
    const rawPressureData: { x: number; y: number }[] = [];
    
    let totalImpulse = 0;
    let maxThrust = 0;
    let maxPressureBar = 0;
    
    let isBurning = rCore < rOuter && Lseg > 0;
    
    const coreAreaInit = 2 * Math.PI * rCore * Lseg;
    const endsAreaInit = 2 * Math.PI * (Math.pow(rOuter, 2) - Math.pow(rCore, 2));
    const AbInit = (coreAreaInit + endsAreaInit) * segments;
    const initialKn = AbInit / At;

    let simulationStatus: SimulationStatus = "SUCCESS";
    let statusMessage = "Simulação concluída com sucesso.";

    const MAX_TIME = 30; 
    const CATO_PRESSURE_BAR = 200; 

    // Função interna para calcular dPc/dt (Taxa de variação da pressão)
    const calculateDPcDt = (currentPc: number, currentVc: number, currentAb: number) => {
      const burnRate = a * Math.pow(currentPc, n);
      const m_in_rate = rho * currentAb * burnRate;
      const m_out_rate = currentPc > pa ? (currentPc * At) / cStar : 0;
      return (RTc / currentVc) * (m_in_rate - m_out_rate);
    };

    // 4. Loop Transitório
    while ((isBurning || Pc > pa * 1.05) && t < MAX_TIME) {
      let Ab = 0;
      let burnRate = 0;
      let m_in = 0;

      if (isBurning) {
        const coreArea = 2 * Math.PI * rCore * Lseg;
        const endsArea = 2 * Math.PI * (Math.pow(rOuter, 2) - Math.pow(rCore, 2));
        Ab = (coreArea + endsArea) * segments;
        burnRate = a * Math.pow(Pc, n);
        m_in = rho * Ab * burnRate; 
      }

      // Aplicação do Método de Integração
      if (config.method === "RK4") {
        const k1 = calculateDPcDt(Pc, Vc, Ab);
        const k2 = calculateDPcDt(Pc + 0.5 * dt * k1, Vc, Ab);
        const k3 = calculateDPcDt(Pc + 0.5 * dt * k2, Vc, Ab);
        const k4 = calculateDPcDt(Pc + dt * k3, Vc, Ab);
        
        Pc += (dt / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
      } else {
        // Método de Euler Padrão
        const dPc = calculateDPcDt(Pc, Vc, Ab) * dt;
        Pc += dPc;
      }
      
      if (Pc < pa) Pc = pa; 
      
      const currentPressureBar = Pc / 100000;
      
      // CHECAGEM DE FALHA CATASTRÓFICA (CATO)
      if (currentPressureBar > CATO_PRESSURE_BAR) {
        simulationStatus = "CATO";
        statusMessage = `Falha Catastrófica (CATO): A pressão excedeu ${CATO_PRESSURE_BAR} Bar em t=${t.toFixed(2)}s.`;
        maxPressureBar = currentPressureBar;
        break; 
      }

      let Cf = 0;
      if (Pc > pa) {
        const pressureTerm = 1 - Math.pow(pa / Pc, (gamma - 1) / gamma);
        if (pressureTerm > 0) {
          Cf = Math.sqrt((2 * Math.pow(gamma, 2) / (gamma - 1)) * expansionTerm * pressureTerm);
        }
      }
      
      let thrust = Cf * Pc * At;
      if (isNaN(thrust) || !isFinite(thrust)) thrust = 0;

      if (isBurning) {
        // Regressão geométrica simples (Euler)
        rCore += burnRate * dt;
        Lseg -= 2 * burnRate * dt;
        Vc += (m_in / rho) * dt; 
        
        isBurning = rCore < rOuter && Lseg > 0;
      }

      totalImpulse += thrust * dt;
      if (thrust > maxThrust) maxThrust = thrust;
      if (currentPressureBar > maxPressureBar) maxPressureBar = currentPressureBar;

      // Salvamos todos os dados para subamostragem posterior
      rawThrustData.push({ x: Number(t.toFixed(4)), y: Number(thrust.toFixed(2)) });
      rawPressureData.push({ x: Number(t.toFixed(4)), y: Number(currentPressureBar.toFixed(2)) });

      t += dt;
    }

    if (t >= MAX_TIME && simulationStatus !== "CATO") {
       simulationStatus = "TIMEOUT";
       statusMessage = `Simulação abortada: O tempo excedeu o limite de segurança (${MAX_TIME}s).`;
    }

    // 5. Downsampling (Redução de Pontos para os Gráficos)
    const finalThrustData = downsample(rawThrustData, config.pointsCount);
    const finalPressureData = downsample(rawPressureData, config.pointsCount);

    // 6. Fechamento das Métricas
    const avgThrust = t > 0 ? totalImpulse / t : 0;
    const isp = m_p > 0 ? totalImpulse / (m_p * 9.80665) : 0;

    let motorClass = "O+";
    const limits = [2.5, 5, 10, 20, 40, 80, 160, 320, 640, 1280, 2560, 5120, 10240, 20480];
    const letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N"];
    for (let i = 0; i < limits.length; i++) {
      if (totalImpulse <= limits[i]) { 
        motorClass = letters[i]; 
        break; 
      }
    }

    return {
      status: simulationStatus,
      message: statusMessage,
      timeData: finalThrustData.map(d => d.x),
      thrustData: finalThrustData,
      pressureData: finalPressureData,
      pointsCount: finalThrustData.length,
      metrics: {
        totalImpulse,
        avgThrust,
        maxThrust,
        isp,
        class: motorClass,
        maxPressureBar,
        initialKn
      }
    };

  } catch (error) {
    return generateErrorResult("Erro interno no cálculo termodinâmico.");
  }
}

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
      initialKn: 0
    }
  };
}