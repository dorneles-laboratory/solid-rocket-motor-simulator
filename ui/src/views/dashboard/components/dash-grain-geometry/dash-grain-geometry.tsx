import { useState, useMemo } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import styles from "./dash-grain-geometry.module.css";
import type { FocusedSection } from "../dash-motor-geometry/dash-motor-geometry";

// O TypeScript reutiliza a tipagem do seu Dashboard
export interface GrainDimensions {
  grainCoreType?: string;
  grainStarPoints?: number;
  grainOuterDiameter: number;
  grainCoreDiameter: number;
  grainLength: number;
  grainSegments: number;
}

interface GrainGeometryProps {
  dimensions?: GrainDimensions;
  focusedSection: FocusedSection;
  className?: string;
}

// Valores de segurança caso não venha dados
const defaultDimensions: GrainDimensions = {
  grainCoreType: "bates",
  grainStarPoints: 5,
  grainOuterDiameter: 0,
  grainCoreDiameter: 0,
  grainLength: 0,
  grainSegments: 0,
};

const coreTypes = [
  {
    value: "bates",
    label: "BATES",
    description: "Cylindrical with central core",
  },
  { value: "finocyl", label: "Finocyl", description: "Fin-cylinder hybrid" },
  { value: "star", label: "Star", description: "Multi-point star core" },
  { value: "moon", label: "Moon Burner", description: "Offset circular core" },
  { value: "c-slot", label: "C-Slot", description: "C-shaped slot pattern" },
];

// --- FUNÇÕES DE DESENHO (MATEMÁTICA) ---
function generateStarPoints(
  cx: number,
  cy: number,
  points: number,
  outerRadius: number,
  innerRadius: number,
): string {
  const angle = Math.PI / points;
  const coords: string[] = [];

  for (let i = 0; i < 2 * points; i++) {
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const a = i * angle - Math.PI / 2;
    coords.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
  }

  return coords.join(" ");
}

function getStarPointsArray(
  cx: number,
  cy: number,
  points: number,
  outerRadius: number,
  innerRadius: number,
  reverse = false,
) {
  const angle = Math.PI / points;
  const coords = [];
  for (let i = 0; i < 2 * points; i++) {
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const a = i * angle - Math.PI / 2;
    coords.push(new THREE.Vector2(cx + r * Math.cos(a), cy + r * Math.sin(a)));
  }
  return reverse ? coords.reverse() : coords;
}

// --- SUB-COMPONENTE 3D DO GRÃO (Para o React-Three-Fiber) ---
function Grain3D({
  coreType,
  outerRadius,
  innerRadius,
  grainLength,
  starPoints = 5, // Valor padrão de pontas da estrela (seria bom vir do BD depois)
}: {
  coreType: string;
  outerRadius: number;
  innerRadius: number;
  grainLength: number;
  starPoints?: number;
}) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    // Borda externa do bloco
    s.absarc(0, 0, Math.max(0.1, outerRadius), 0, Math.PI * 2, false);

    const hole = new THREE.Path();

    try {
      if (coreType === "bates") {
        hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
      } else if (coreType === "star") {
        const pts = getStarPointsArray(
          0,
          0,
          starPoints,
          innerRadius * 1.5,
          innerRadius * 0.6,
          true,
        );
        hole.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) hole.lineTo(pts[i].x, pts[i].y);
        hole.closePath();
      } else if (coreType === "finocyl") {
        // Aproximação geométrica de um Finocyl
        const pts = getStarPointsArray(
          0,
          0,
          6,
          outerRadius * 0.75,
          innerRadius,
          true,
        );
        hole.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) hole.lineTo(pts[i].x, pts[i].y);
        hole.closePath();
      } else if (coreType === "moon") {
        hole.absarc(innerRadius * 0.8, 0, innerRadius, 0, Math.PI * 2, true);
      } else if (coreType === "c-slot") {
        const r = innerRadius;
        hole.moveTo(-0.5 * r, r);
        hole.lineTo(1.5 * r, r);
        hole.lineTo(1.5 * r, 0.3 * r);
        hole.absarc(0.5 * r, 0, 0.3 * r, Math.PI / 2, -Math.PI / 2, false);
        hole.lineTo(1.5 * r, -0.3 * r);
        hole.lineTo(1.5 * r, -r);
        hole.lineTo(-0.5 * r, -r);
        hole.closePath();
      }
      s.holes.push(hole);
    } catch (error) {
      // Fallback circular de segurança
      hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
      s.holes = [hole];
      console.error(
        "Erro ao gerar forma do núcleo do grão, usando fallback circular:",
        error,
      );
    }

    return s;
  }, [coreType, outerRadius, innerRadius, starPoints]);

  return (
    // Rotacionamos para deixar "de pé"
    <group rotation={[Math.PI / 6, -Math.PI / 6, 0]}>
      <mesh position={[0, 0, -grainLength / 2]}>
        <extrudeGeometry
          args={[
            shape,
            {
              depth: Math.max(1, grainLength), // Previne zero na modelagem matemática
              curveSegments: 64,
              bevelEnabled: false,
            },
          ]}
        />
        <meshStandardMaterial
          color="#f97316"
          roughness={0.7}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// --- COMPONENTE PRINCIPAL QUE SERÁ EXPORTADO ---
export default function GrainGeometry({
  dimensions = defaultDimensions,
  focusedSection,
  className = "",
}: GrainGeometryProps) {
  const [viewMode, setViewMode] = useState<"2D" | "3D">("2D");

  // Transformando os dados brutos da API em raios para desenhar
  const outerRadius = (dimensions.grainOuterDiameter || 0) / 2;
  const innerRadius = (dimensions.grainCoreDiameter || 0) / 2;
  const grainLength = dimensions.grainLength || 0;
  const coreType = dimensions.grainCoreType || "bates";
  const starPoints = dimensions.grainStarPoints || 5;

  // Cores CSS
  const highlightStroke = "var(--primary)";
  const defaultStroke = "var(--primary)";

  return (
    <div
      className={`${styles.container} ${className}`.trim()}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        flex: 1,
        minHeight: "300px",
      }}
    >
      {/* TOGGLE 2D / 3D */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 10,
          display: "flex",
          gap: "0.5rem",
        }}
      >
        <button
          onClick={() => setViewMode("2D")}
          style={{
            padding: "4px 12px",
            fontSize: "10px",
            cursor: "pointer",
            backgroundColor:
              viewMode === "2D" ? "var(--primary)" : "var(--card)",
            color:
              viewMode === "2D" ? "var(--background)" : "var(--foreground)",
            border: "1px solid var(--border)",
            borderRadius: "4px",
          }}
        >
          2D PLAN
        </button>
        <button
          onClick={() => setViewMode("3D")}
          style={{
            padding: "4px 12px",
            fontSize: "10px",
            cursor: "pointer",
            backgroundColor:
              viewMode === "3D" ? "var(--primary)" : "var(--card)",
            color:
              viewMode === "3D" ? "var(--background)" : "var(--foreground)",
            border: "1px solid var(--border)",
            borderRadius: "4px",
          }}
        >
          3D ORBIT
        </button>
      </div>

      {viewMode === "2D" ? (
        <>
          {/* Engineering Graph Paper Background */}
          <div
            className={styles.bgWrapper}
            style={{ position: "absolute", inset: 0 }}
          >
            <svg
              className={styles.bgSvg}
              style={{ width: "100%", height: "100%" }}
            >
              <defs>
                <pattern
                  id="grid-small-engineering"
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 10 0 L 0 0 0 10"
                    className={styles.gridSmallPath}
                  />
                </pattern>
                <pattern
                  id="grid-large-engineering"
                  width="50"
                  height="50"
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    width="50"
                    height="50"
                    fill="url(#grid-small-engineering)"
                  />
                  <path
                    d="M 50 0 L 0 0 0 50"
                    className={styles.gridLargePath}
                  />
                </pattern>

                {/* Efeito Glow para a seleção do painel */}
                <filter
                  id="glow-grain"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <rect
                width="100%"
                height="100%"
                fill="url(#grid-large-engineering)"
                className={styles.gridRect}
              />
            </svg>
          </div>

          {/* Crosshairs do Blueprint */}
          <div
            className={styles.crosshairV}
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              borderLeft: "1px dashed rgba(255,255,255,0.1)",
            }}
          />
          <div
            className={styles.crosshairH}
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              borderTop: "1px dashed rgba(255,255,255,0.1)",
            }}
          />

          {/* SVG Grain Cross-Section (Visão Frontal) */}
          <svg
            className={styles.svgCanvas}
            viewBox="-100 -100 200 200"
            style={{
              width: "100%",
              height: "100%",
              maxHeight: "400px",
              margin: "auto",
              display: "block",
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
            }}
          >
            <g
              className={`${styles.sectionGroup} ${focusedSection === "grain-outer" || focusedSection === "grain-core" ? styles.sectionUnfiltered : ""}`.trim()}
              filter={
                focusedSection === "grain-outer" ||
                focusedSection === "grain-core"
                  ? "url(#glow-grain)"
                  : undefined
              }
            >
              {/* Outer Circle (Grain) */}
              <circle
                cx="0"
                cy="0"
                r={outerRadius}
                fill="none"
                stroke={
                  focusedSection === "grain-outer"
                    ? highlightStroke
                    : defaultStroke
                }
                strokeWidth={focusedSection === "grain-outer" ? "3" : "2"}
                className={styles.svgOuterRing}
              />
              <circle
                cx="0"
                cy="0"
                r={outerRadius}
                fill="var(--primary)"
                fillOpacity="0.1"
              />

              {/* Inner Core based on type */}
              {coreType === "bates" && (
                <circle
                  cx="0"
                  cy="0"
                  r={innerRadius}
                  fill="#0a0a0f"
                  stroke={
                    focusedSection === "grain-core"
                      ? highlightStroke
                      : defaultStroke
                  }
                  strokeWidth={focusedSection === "grain-core" ? "2.5" : "1.5"}
                />
              )}

              {coreType === "star" && (
                <polygon
                  points={generateStarPoints(
                    0,
                    0,
                    starPoints,
                    innerRadius * 1.5,
                    innerRadius * 0.6,
                  )}
                  fill="#0a0a0f"
                  stroke={
                    focusedSection === "grain-core"
                      ? highlightStroke
                      : defaultStroke
                  }
                  strokeWidth={focusedSection === "grain-core" ? "2.5" : "1.5"}
                />
              )}

              {coreType === "finocyl" && (
                <>
                  <circle
                    cx="0"
                    cy="0"
                    r={innerRadius}
                    fill="#0a0a0f"
                    stroke={
                      focusedSection === "grain-core"
                        ? highlightStroke
                        : defaultStroke
                    }
                    strokeWidth={
                      focusedSection === "grain-core" ? "2.5" : "1.5"
                    }
                  />
                  {[0, 60, 120, 180, 240, 300].map((angle) => (
                    <rect
                      key={angle}
                      x={-2}
                      y={-outerRadius * 0.75}
                      width={4}
                      height={outerRadius * 0.75 - innerRadius}
                      fill="#0a0a0f"
                      stroke={
                        focusedSection === "grain-core"
                          ? highlightStroke
                          : defaultStroke
                      }
                      strokeWidth={focusedSection === "grain-core" ? "2" : "1"}
                      transform={`rotate(${angle})`}
                    />
                  ))}
                </>
              )}

              {coreType === "moon" && (
                <circle
                  cx={innerRadius * 0.8}
                  cy="0"
                  r={innerRadius}
                  fill="#0a0a0f"
                  stroke={
                    focusedSection === "grain-core"
                      ? highlightStroke
                      : defaultStroke
                  }
                  strokeWidth={focusedSection === "grain-core" ? "2.5" : "1.5"}
                />
              )}

              {coreType === "c-slot" && (
                <path
                  d={`M ${-innerRadius * 0.5} ${-innerRadius} 
                      L ${innerRadius * 1.5} ${-innerRadius} 
                      L ${innerRadius * 1.5} ${-innerRadius * 0.3}
                      L ${innerRadius * 0.5} ${-innerRadius * 0.3}
                      A ${innerRadius * 0.3} ${innerRadius * 0.3} 0 1 0 ${innerRadius * 0.5} ${innerRadius * 0.3}
                      L ${innerRadius * 1.5} ${innerRadius * 0.3}
                      L ${innerRadius * 1.5} ${innerRadius}
                      L ${-innerRadius * 0.5} ${innerRadius}
                      Z`}
                  fill="#0a0a0f"
                  stroke={
                    focusedSection === "grain-core"
                      ? highlightStroke
                      : defaultStroke
                  }
                  strokeWidth={focusedSection === "grain-core" ? "2.5" : "1.5"}
                />
              )}
            </g>

            {/* Dimension Annotations no SVG */}
            <line
              x1={-outerRadius - 15}
              y1={-outerRadius}
              x2={-outerRadius - 15}
              y2={outerRadius}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="0.5"
            />
            <line
              x1={-outerRadius - 18}
              y1={-outerRadius}
              x2={-outerRadius - 12}
              y2={-outerRadius}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="0.5"
            />
            <line
              x1={-outerRadius - 18}
              y1={outerRadius}
              x2={-outerRadius - 12}
              y2={outerRadius}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="0.5"
            />
            <text
              x={-outerRadius - 20}
              y="4"
              fill="rgba(255,255,255,0.5)"
              fontSize="6"
              textAnchor="end"
              fontFamily="monospace"
            >
              {(outerRadius * 2).toFixed(1)}mm
            </text>
          </svg>
        </>
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "var(--card)",
          }}
        >
          <Canvas camera={{ position: [0, 0, outerRadius * 3 + 100], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 20, 10]} intensity={1.5} />
            <Environment preset="city" />

            <Grain3D
              coreType={coreType}
              outerRadius={outerRadius}
              innerRadius={innerRadius}
              grainLength={grainLength}
              starPoints={starPoints}
            />

            <ContactShadows
              position={[0, -Math.max(outerRadius, grainLength / 2) - 10, 0]}
              opacity={0.4}
              scale={300}
              blur={2}
              far={100}
            />
            <OrbitControls makeDefault />
          </Canvas>
        </div>
      )}

      {/* Informações estáticas no canto inferior */}
      <div
        className={styles.cornerInfo}
        style={{
          position: "absolute",
          bottom: "1rem",
          left: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          pointerEvents: "none",
          zIndex: 5,
        }}
      >
        <span
          style={{
            fontSize: "10px",
            color: "var(--muted-foreground)",
            fontFamily: "monospace",
          }}
        >
          Type:{" "}
          <span style={{ color: "var(--primary)", fontWeight: "bold" }}>
            {coreTypes.find((t) => t.value === coreType)?.label || "BATES"}
          </span>
        </span>
        <span
          style={{
            fontSize: "10px",
            color: "var(--muted-foreground)",
            fontFamily: "monospace",
          }}
        >
          OD:{" "}
          <span style={{ color: "var(--foreground)" }}>
            {(outerRadius * 2).toFixed(1)} mm
          </span>
        </span>
        <span
          style={{
            fontSize: "10px",
            color: "var(--muted-foreground)",
            fontFamily: "monospace",
          }}
        >
          ID:{" "}
          <span style={{ color: "var(--foreground)" }}>
            {(innerRadius * 2).toFixed(1)} mm
          </span>
        </span>
      </div>
    </div>
  );
}
