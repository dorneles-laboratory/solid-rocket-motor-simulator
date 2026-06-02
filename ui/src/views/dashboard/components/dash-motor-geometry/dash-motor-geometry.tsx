import { useState } from 'react'
import styles from './dash-motor-geometry.module.css'
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import Motor3D from './dash-motor-3d';

export interface MotorDimensions {
  chamberDiameter: number
  chamberLength: number
  grainOuterDiameter: number
  grainCoreDiameter: number
  grainLength: number
  throatDiameter: number
  convergenceAngle: number
  divergenceAngle: number
}

export type FocusedSection = 
  | "chamber-diameter" 
  | "chamber-length" 
  | "grain-outer" 
  | "grain-core" 
  | "grain-length" 
  | "nozzle-throat" 
  | "nozzle-convergence" 
  | "nozzle-divergence" 
  | null

interface MotorGeometryProps {
  dimensions?: MotorDimensions
  focusedSection: FocusedSection
  className?: string
}

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

export default function MotorGeometry({
  dimensions = defaultDimensions,
  focusedSection,
  className = "",
}: MotorGeometryProps) {
  // Scale factors for visualization
  const scale = 0.8
  const baseWidth = 500
  const baseHeight = 200

  const [viewMode, setViewMode] = useState<'2D' | '3D'>('2D');
  
  // Calculate visual dimensions (normalized to fit viewport)
  const chamberVisualLength = Math.min(300, Math.max(150, dimensions.chamberLength * scale));
  const chamberVisualDiameter = Math.min(120, Math.max(60, dimensions.chamberDiameter * scale));
  const grainVisualLength = Math.min(chamberVisualLength - 20, Math.max(100, dimensions.grainLength * scale));
  const grainOuterVisualDiameter = Math.min(chamberVisualDiameter - 10, Math.max(50, dimensions.grainOuterDiameter * scale));
  const grainCoreVisualDiameter = Math.min(grainOuterVisualDiameter - 20, Math.max(15, dimensions.grainCoreDiameter * scale * 0.8));
  const throatVisualDiameter = Math.min(40, Math.max(10, dimensions.throatDiameter * scale * 0.6));
  const nozzleLength = 60;
  const nozzleExitDiameter = throatVisualDiameter * 2.5;

  // Positions
  const startX = 160
  const centerY = baseHeight / 2
  const chamberEndX = startX + chamberVisualLength
  const nozzleEndX = chamberEndX + nozzleLength

  // Colors - engineering style
  const highlightStroke = "var(--primary)"
  const defaultStroke = "var(--foreground)"

  return (
    <div className={`${styles.container} ${className}`.trim()} style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
      {/* TOGGLE 2D / 3D */}
      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10, display: 'flex', gap: '0.5rem' }}>
        <button 
          onClick={() => setViewMode('2D')}
          style={{ padding: '4px 12px', fontSize: '10px', cursor: 'pointer', backgroundColor: viewMode === '2D' ? 'var(--primary)' : 'var(--card)', color: viewMode === '2D' ? 'var(--background)' : 'var(--foreground)', border: '1px solid var(--border)', borderRadius: '4px' }}
        >
          2D PLAN
        </button>
        <button 
          onClick={() => setViewMode('3D')}
          style={{ padding: '4px 12px', fontSize: '10px', cursor: 'pointer', backgroundColor: viewMode === '3D' ? 'var(--primary)' : 'var(--card)', color: viewMode === '3D' ? 'var(--background)' : 'var(--foreground)', border: '1px solid var(--border)', borderRadius: '4px' }}
        >
          3D ORBIT
        </button>
      </div>
      
      {viewMode === '2D' ? (
        <>
          {/* Engineering Graph Paper Background - Light Blue Grid */}
          <div className={styles.bgWrapper}>
            <svg className={styles.bgSvg}>
              <defs>
                {/* Small grid - 5mm equivalent */}
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
                {/* Large grid - 25mm equivalent */}
                <pattern
                  id="grid-large-engineering"
                  width="50"
                  height="50"
                  patternUnits="userSpaceOnUse"
                >
                  <rect width="50" height="50" fill="url(#grid-small-engineering)" />
                  <path
                    d="M 50 0 L 0 0 0 50"
                    className={styles.gridLargePath}
                  />
                </pattern>
              </defs>
              <rect
                width="100%"
                height="100%"
                fill="url(#grid-large-engineering)"
                className={styles.gridRect}
              />
            </svg>
          </div>

          {/* Technical Geometry */}
          <svg
            viewBox={`0 0 ${baseWidth + 60} ${baseHeight}`}
            className={styles.mainSvg}
            style={{ minHeight: 180 }}
          >
            <defs>
              {/* Glow filter for highlights */}
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Hatch pattern for propellant */}
              <pattern
                id="propellant-hatch"
                patternUnits="userSpaceOnUse"
                width="6"
                height="6"
              >
                <path
                  d="M 0 6 L 6 0"
                  stroke="var(--muted-foreground)"
                  strokeWidth="0.5"
                  opacity="0.5"
                />
              </pattern>
            </defs>

            {/* CHAMBER CASING - Outer walls */}
            <g
              className={`${styles.sectionGroup} ${focusedSection === "chamber-diameter" || focusedSection === "chamber-length" ? styles.sectionUnfiltered : ""}`.trim()}
              filter={focusedSection === "chamber-diameter" || focusedSection === "chamber-length" ? "url(#glow)" : undefined}
            >
              {/* Top wall */}
              <line
                x1={startX}
                y1={centerY - chamberVisualDiameter / 2}
                x2={chamberEndX}
                y2={centerY - chamberVisualDiameter / 2}
                stroke={focusedSection === "chamber-length" ? highlightStroke : defaultStroke}
                strokeWidth={focusedSection === "chamber-length" ? 2.5 : 1.5}
              />
              {/* Bottom wall */}
              <line
                x1={startX}
                y1={centerY + chamberVisualDiameter / 2}
                x2={chamberEndX}
                y2={centerY + chamberVisualDiameter / 2}
                stroke={focusedSection === "chamber-length" ? highlightStroke : defaultStroke}
                strokeWidth={focusedSection === "chamber-length" ? 2.5 : 1.5}
              />
              {/* Head end cap */}
              <line
                x1={startX}
                y1={centerY - chamberVisualDiameter / 2}
                x2={startX}
                y2={centerY + chamberVisualDiameter / 2}
                stroke={focusedSection === "chamber-diameter" ? highlightStroke : defaultStroke}
                strokeWidth={focusedSection === "chamber-diameter" ? 2.5 : 1.5}
              />

              {/* Chamber dimension line */}
              <g opacity={0.7}>
                <line
                  x1={startX}
                  y1={centerY - chamberVisualDiameter / 2 - 18}
                  x2={chamberEndX}
                  y2={centerY - chamberVisualDiameter / 2 - 18}
                  stroke={focusedSection === "chamber-length" ? highlightStroke : "var(--muted-foreground)"}
                  strokeWidth="0.75"
                />
                {/* Dimension arrows */}
                <polygon
                  points={`${startX},${centerY - chamberVisualDiameter / 2 - 18} ${startX + 6},${centerY - chamberVisualDiameter / 2 - 15} ${startX + 6},${centerY - chamberVisualDiameter / 2 - 21}`}
                  fill={focusedSection === "chamber-length" ? highlightStroke : "var(--muted-foreground)"}
                />
                <polygon
                  points={`${chamberEndX},${centerY - chamberVisualDiameter / 2 - 18} ${chamberEndX - 6},${centerY - chamberVisualDiameter / 2 - 15} ${chamberEndX - 6},${centerY - chamberVisualDiameter / 2 - 21}`}
                  fill={focusedSection === "chamber-length" ? highlightStroke : "var(--muted-foreground)"}
                />
                <text
                  x={(startX + chamberEndX) / 2}
                  y={centerY - chamberVisualDiameter / 2 - 24}
                  textAnchor="middle"
                  className={`${styles.dimensionText} ${styles.text9}`}
                >
                  {dimensions.chamberLength.toFixed(0)} mm
                </text>
              </g>

              {/* Chamber diameter line */}
              <g opacity={0.7}>
                <line
                  x1={startX - 18}
                  y1={centerY - chamberVisualDiameter / 2}
                  x2={startX - 18}
                  y2={centerY + chamberVisualDiameter / 2}
                  stroke={focusedSection === "chamber-diameter" ? highlightStroke : "var(--muted-foreground)"}
                  strokeWidth="0.75"
                />
                {/* Dimension arrows */}
                <polygon
                  points={`${startX - 18},${centerY - chamberVisualDiameter / 2} ${startX - 15},${centerY - chamberVisualDiameter / 2 + 6} ${startX - 21},${centerY - chamberVisualDiameter / 2 + 6}`}
                  fill={focusedSection === "chamber-diameter" ? highlightStroke : "var(--muted-foreground)"}
                />
                <polygon
                  points={`${startX - 18},${centerY + chamberVisualDiameter / 2} ${startX - 15},${centerY + chamberVisualDiameter / 2 - 6} ${startX - 21},${centerY + chamberVisualDiameter / 2 - 6}`}
                  fill={focusedSection === "chamber-diameter" ? highlightStroke : "var(--muted-foreground)"}
                />
                <text
                  x={startX - 40}
                  y={centerY}
                  textAnchor="middle"
                  className={`${styles.dimensionText} ${styles.text9}`}
                >
                  {dimensions.chamberDiameter.toFixed(0)} mm
                </text>
              </g>
            </g>

            {/* PROPELLANT GRAIN */}
            <g
              className={`${styles.sectionGroup} ${focusedSection === "grain-length" || focusedSection === 'grain-outer' || focusedSection === "grain-core" ? styles.sectionUnfiltered : ""}`.trim()}
              filter={focusedSection === "grain-length" ||  focusedSection === 'grain-outer' || focusedSection === "grain-core" ? "url(#glow)" : undefined}
            >
              {/* Outer grain surface (with hatch fill) */}
              <rect
                x={startX + 10}
                y={centerY - grainOuterVisualDiameter / 2}
                width={grainVisualLength}
                height={grainOuterVisualDiameter}
                fill={"url(#propellant-hatch)"}
              />

              {/* Top wall */}
              <line
                x1={startX + 10}
                y1={centerY - grainOuterVisualDiameter / 2}
                x2={startX + grainVisualLength + 10}
                y2={centerY - grainOuterVisualDiameter / 2}
                stroke={focusedSection === "grain-length" ? highlightStroke : defaultStroke}
                strokeWidth={focusedSection === "grain-length" ? 2.5 : 1.5}
              />
              {/* Bottom wall */}
              <line
                x1={startX + 10}
                y1={centerY + grainOuterVisualDiameter / 2}
                x2={startX + grainVisualLength + 10}
                y2={centerY + grainOuterVisualDiameter / 2}
                stroke={focusedSection === "grain-length" ? highlightStroke : defaultStroke}
                strokeWidth={focusedSection === "grain-length" ? 2.5 : 1.5}
              />
              {/* Top core wall */}
              <line
                x1={startX + 10}
                y1={centerY + grainCoreVisualDiameter / 2}
                x2={startX + grainVisualLength + 10}
                y2={centerY + grainCoreVisualDiameter / 2}
                stroke={focusedSection === "grain-length" ? highlightStroke : defaultStroke}
                strokeWidth={focusedSection === "grain-length" ? 2.5 : 1.5}
              />
              {/* Bottom core wall */}
              <line
                x1={startX + 10}
                y1={centerY - grainCoreVisualDiameter / 2}
                x2={startX + grainVisualLength + 10}
                y2={centerY - grainCoreVisualDiameter / 2}
                stroke={focusedSection === "grain-length" ? highlightStroke : defaultStroke}
                strokeWidth={focusedSection === "grain-length" ? 2.5 : 1.5}
              />
              
              {/* Head end cap */}
              <line
                x1={startX + 10}
                y1={centerY - grainOuterVisualDiameter / 2}
                x2={startX + 10}
                y2={centerY + grainOuterVisualDiameter / 2}
                stroke={focusedSection === "grain-outer" ? highlightStroke : defaultStroke}
                strokeWidth={focusedSection === "grain-outer" ? 2.5 : 1.5}
              />
              <line
                x1={startX + 10 + grainVisualLength}
                y1={centerY - grainOuterVisualDiameter / 2}
                x2={startX + 10 + grainVisualLength}
                y2={centerY + grainOuterVisualDiameter / 2}
                stroke={focusedSection === "grain-outer" ? highlightStroke : defaultStroke}
                strokeWidth={focusedSection === "grain-outer" ? 2.5 : 1.5}
              />

              {/* Core bore (hollow center) */}
              <rect
                x={startX + 10}
                y={centerY - grainCoreVisualDiameter / 2}
                width={grainVisualLength}
                height={grainCoreVisualDiameter}
                className={styles.coreBore}
              />
              {/* Top core wall */}
              <line
                x1={startX + 10}
                y1={centerY - grainCoreVisualDiameter / 2}
                x2={startX + 10}
                y2={centerY + grainCoreVisualDiameter / 2}
                stroke={focusedSection === "grain-core" ? highlightStroke : defaultStroke}
                strokeWidth={focusedSection === "grain-core" ? 2.5 : 1.5}
              />
              <line
                x1={startX + 10 + grainVisualLength}
                y1={centerY - grainCoreVisualDiameter / 2}
                x2={startX + 10 + grainVisualLength}
                y2={centerY + grainCoreVisualDiameter / 2}
                stroke={focusedSection === "grain-core" ? highlightStroke : defaultStroke}
                strokeWidth={focusedSection === "grain-core" ? 2.5 : 1.5}
              />

              {/* Grain dimension annotation */}
              <g opacity={0.7}>
                <line
                  x1={startX + 10 + grainVisualLength + 12}
                  y1={centerY - grainOuterVisualDiameter / 2}
                  x2={startX + 10 + grainVisualLength + 12}
                  y2={centerY + grainOuterVisualDiameter / 2}
                  stroke={focusedSection === "grain-outer" ? highlightStroke : "var(--muted-foreground)"}
                  strokeWidth="0.75"
                />
                <line
                  x1={startX + 10 + grainVisualLength + 12 + 4}
                  y1={centerY - grainOuterVisualDiameter / 2}
                  x2={startX + 10 + grainVisualLength + 12 - 4}
                  y2={centerY - grainOuterVisualDiameter / 2}
                  stroke={focusedSection === "grain-outer" ? highlightStroke : "var(--muted-foreground)"}
                  strokeWidth="0.75"
                />
                <line
                  x1={startX + 10 + grainVisualLength + 12 + 4}
                  y1={centerY + grainOuterVisualDiameter / 2}
                  x2={startX + 10 + grainVisualLength + 12 - 4}
                  y2={centerY + grainOuterVisualDiameter / 2}
                  stroke={focusedSection === "grain-outer" ? highlightStroke : "var(--muted-foreground)"}
                  strokeWidth="0.75"
                />
                <text
                  x={startX + grainVisualLength + 18}
                  y={centerY}
                  className={`${styles.dimensionText} ${styles.text8}`}
                  transform={`rotate(90, ${startX + 10 + grainVisualLength + 18}, ${centerY})`}
                >
                  D{(dimensions.grainOuterDiameter || 0).toFixed(0)} mm
                </text>

                {/* Grain length annotation */}
                <line
                  x1={startX + 10}
                  y1={centerY + grainOuterVisualDiameter / 2 + 20}
                  x2={startX + grainVisualLength + 10}
                  y2={centerY + grainOuterVisualDiameter / 2 + 20}
                  stroke={focusedSection === "grain-length" ? highlightStroke : "var(--muted-foreground)"}
                  strokeWidth="0.75"
                />
                <line
                  x1={startX + 10}
                  y1={centerY + grainOuterVisualDiameter / 2 + 16}
                  x2={startX + 10}
                  y2={centerY + grainOuterVisualDiameter / 2 + 24}
                  stroke={focusedSection === "grain-length" ? highlightStroke : "var(--muted-foreground)"}
                  strokeWidth="1"
                />
                <line
                  x1={startX + grainVisualLength + 10}
                  y1={centerY + grainOuterVisualDiameter / 2 + 16}
                  x2={startX + grainVisualLength + 10}
                  y2={centerY + grainOuterVisualDiameter / 2 + 24}
                  stroke={focusedSection === "grain-length" ? highlightStroke : "var(--muted-foreground)"}
                  strokeWidth="1"
                />
                <text
                  x={startX + 10 + (grainVisualLength / 2)}
                  y={centerY + grainOuterVisualDiameter / 2 + 34}
                  textAnchor="middle"
                  className={`${styles.dimensionText} ${styles.text8}`}
                  
                >
                  L{(dimensions.grainLength || 0).toFixed(0)} mm
                </text>
              </g>
            </g>

            {/* NOZZLE */}
            <g
              className={`${styles.sectionGroup} ${focusedSection === "nozzle-throat" || focusedSection === "nozzle-convergence" || focusedSection === "nozzle-divergence" ? styles.sectionUnfiltered : ""}`.trim()}
              filter={focusedSection === "nozzle-throat" || focusedSection === "nozzle-convergence" || focusedSection === "nozzle-divergence" ? "url(#glow)" : undefined}
            >
              {/* Convergent section - Top */}
              <line
                x1={chamberEndX}
                y1={centerY - chamberVisualDiameter / 2}
                x2={chamberEndX + nozzleLength * 0.4}
                y2={centerY - throatVisualDiameter / 2}
                stroke={focusedSection === "nozzle-convergence" ? highlightStroke : defaultStroke}
                strokeWidth={focusedSection === "nozzle-convergence" ? 2.5 : 1.5}
              />
              {/* Convergent section - Bottom */}
              <line
                x1={chamberEndX}
                y1={centerY + chamberVisualDiameter / 2}
                x2={chamberEndX + nozzleLength * 0.4}
                y2={centerY + throatVisualDiameter / 2}
                stroke={focusedSection === "nozzle-convergence" ? highlightStroke : defaultStroke}
                strokeWidth={focusedSection === "nozzle-convergence" ? 2.5 : 1.5}
              />

              {/* Throat (narrowest point) */}
              <line
                x1={chamberEndX + nozzleLength * 0.4}
                y1={centerY - throatVisualDiameter / 2}
                x2={chamberEndX + nozzleLength * 0.4}
                y2={centerY + throatVisualDiameter / 2}
                stroke={focusedSection === "nozzle-throat" ? highlightStroke : "var(--muted-foreground)"}
                strokeWidth={focusedSection === "nozzle-throat" ? 1.5 : 0.5}
                strokeDasharray="3,2"
              />

              {/* Divergent section - Top */}
              <line
                x1={chamberEndX + nozzleLength * 0.4}
                y1={centerY - throatVisualDiameter / 2}
                x2={nozzleEndX}
                y2={centerY - nozzleExitDiameter / 2}
                stroke={focusedSection === "nozzle-divergence" ? highlightStroke : defaultStroke}
                strokeWidth={focusedSection === "nozzle-divergence" ? 2.5 : 1.5}
              />
              {/* Divergent section - Bottom */}
              <line
                x1={chamberEndX + nozzleLength * 0.4}
                y1={centerY + throatVisualDiameter / 2}
                x2={nozzleEndX}
                y2={centerY + nozzleExitDiameter / 2}
                stroke={focusedSection === "nozzle-divergence" ? highlightStroke : defaultStroke}
                strokeWidth={focusedSection === "nozzle-divergence" ? 2.5 : 1.5}
              />

              {/* Throat dimension */}
              <g opacity={0.8}>
                <line
                  x1={chamberEndX + nozzleLength * 0.4 - 5}
                  y1={centerY - throatVisualDiameter / 2 - 8}
                  x2={chamberEndX + nozzleLength * 0.4 + 5}
                  y2={centerY - throatVisualDiameter / 2 - 8}
                  stroke={focusedSection === "nozzle-throat" || focusedSection === "nozzle-convergence" || focusedSection === "nozzle-divergence" ? highlightStroke : "var(--muted-foreground)"}
                  strokeWidth="0.75"
                />
                <text
                  x={chamberEndX + nozzleLength * 0.4}
                  y={centerY - throatVisualDiameter / 2 - 14}
                  textAnchor="middle"
                  className={`${styles.dimensionText} ${styles.text8}`}
                >
                  D{dimensions.throatDiameter.toFixed(1)}
                </text>
              </g>
            </g>

            {/* Center axis line */}
            <line
              x1={startX - 15}
              y1={centerY}
              x2={nozzleEndX + 15}
              y2={centerY}
              stroke="var(--muted-foreground)"
              strokeWidth="0.5"
              strokeDasharray="8,4"
              opacity={0.4}
            />

            {/* Scale indicator */}
            <g transform={`translate(${baseWidth - 50}, ${baseHeight - 18})`}>
              <line
                x1={0}
                y1={0}
                x2={50}
                y2={0}
                stroke="var(--chart-1)"
                strokeWidth="1"
              />
              <line x1={0} y1={-4} x2={0} y2={4} stroke="var(--chart-1)" strokeWidth="1" />
              <line x1={50} y1={-4} x2={50} y2={4} stroke="var(--chart-1)" strokeWidth="1" />

              <line 
                x1={50}
                x2={50}
                y1={0}
                y2={-50}
                stroke="var(--chart-2)"
                strokeWidth="1"
              />
              <line x1={54} y1={-50} x2={46} y2={-50} stroke="var(--chart-2)" strokeWidth="1" />
              <line x1={54} y1={0} x2={50} y2={0} stroke="var(--chart-2)" strokeWidth="1" />

              
              <text
                x={20}
                y={-8}
                textAnchor="middle"
                className={`${styles.dimensionText} ${styles.text8}`}
              >
                50 mm
              </text>
            </g>
          </svg>
      </>
      ) : (
        <div style={{ height: '240px', width: '100%', backgroundColor: 'var(--card)' }}>
          <Canvas camera={{ position: [0, 0, 350], fov: 50 }}>
            {/* Luzes para dar aspecto metálico/realista */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} intensity={1.5} />
            <Environment preset="city" /> 

            {/* O Motor gerado em 3D */}
            <Motor3D dimensions={dimensions} />
            
            {/* Sombras no chão */}
            <ContactShadows position={[0, -100, 0]} opacity={0.4} scale={400} blur={2} far={150} />

            {/* Controles para o usuário girar, aproximar e afastar o motor */}
            <OrbitControls enablePan={false} maxDistance={600} minDistance={100} />
          </Canvas>
        </div>
      )}

      {/* Section Labels */}
      <div className={styles.legendContainer}>
        {/* Casing Label */}
        <div className={styles.legendItem}>
          <div className={`${styles.legendBox} ${focusedSection === "chamber-diameter" || focusedSection === "chamber-length" ? styles.legendBoxActive : styles.legendBoxInactive}`} />
          <span className={`${styles.legendText} ${focusedSection === "chamber-diameter" || focusedSection === "chamber-length" ? styles.legendTextActive : styles.legendTextInactive}`}>
            Casing
          </span>
        </div>
        
        {/* Propelente Label */}
        <div className={styles.legendItem}>
          <div className={`${styles.legendBox} ${focusedSection === "grain-outer" || focusedSection === "grain-length" || focusedSection === "grain-core" ? styles.legendBoxActive : styles.legendBoxGrainInactive}`} />
          <span className={`${styles.legendText} ${focusedSection === "grain-outer" || focusedSection === "grain-length" || focusedSection === "grain-core" ? styles.legendTextActive : styles.legendTextInactive}`}>
            Propelente
          </span>
        </div>
        
        {/* Bocal Label */}
        <div className={styles.legendItem}>
          <div className={`${styles.legendBox} ${focusedSection === "nozzle-throat" || focusedSection === "nozzle-convergence" || focusedSection === "nozzle-divergence" ? styles.legendBoxActive : styles.legendBoxInactive}`} />
          <span className={`${styles.legendText} ${focusedSection === "nozzle-throat" || focusedSection === "nozzle-convergence" || focusedSection === "nozzle-divergence" ? styles.legendTextActive : styles.legendTextInactive}`}>
            Bocal
          </span>
        </div>
      </div>
    </div>
  )
}