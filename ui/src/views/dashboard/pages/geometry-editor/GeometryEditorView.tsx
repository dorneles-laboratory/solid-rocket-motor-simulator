"use client"

import { useEffect, useState } from "react"
import { Layers, ChevronDown } from "lucide-react"
import styles from "./GeometryEditorView.module.css"
import { FooterProps } from "../../../../components/layout/footer/footer"

const coreTypes = [
  { value: "bates", label: "BATES", description: "Cylindrical with central core" },
  { value: "finocyl", label: "Finocyl", description: "Fin-cylinder hybrid" },
  { value: "star", label: "Star", description: "Multi-point star core" },
  { value: "moon", label: "Moon Burner", description: "Offset circular core" },
  { value: "c-slot", label: "C-Slot", description: "C-shaped slot pattern" },
]

interface GeometryEditorViewProps {
  setFooter: (data: FooterProps) => void;
}

export default function GeometryEditorView({ setFooter }: GeometryEditorViewProps) {
  const [coreType, setCoreType] = useState("bates")
  const [outerDiameter, setOuterDiameter] = useState("75.0")
  const [innerDiameter, setInnerDiameter] = useState("20.0")
  const [grainLength, setGrainLength] = useState("50.0")
  const [segments, setSegments] = useState("4")
  const [starPoints, setStarPoints] = useState("5")
  const [openSections, setOpenSections] = useState({
    core: true,
    dimensions: true,
    advanced: false,
  })

  useEffect(() => {
    setFooter({
      description: "Edite a geometria do seu motor sólido de foguete com uma interface visual intuitiva.",
      rightText: "Em breve uma nova funcionalidade."
    });
  }, [setFooter]);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  // Calculate derived values
  const outerRadius = parseFloat(outerDiameter) / 2 || 37.5
  const innerRadius = parseFloat(innerDiameter) / 2 || 10

  return (
    <section className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerTitleWrapper}>
          <Layers className={styles.headerIcon} strokeWidth={1.5} />
          <h1 className={styles.headerTitle}>
            Editor de Geometria
          </h1>
        </div>
        <button type="button" className={styles.applyButton}>
          Apply Changes
        </button>
      </header>

      {/* Two Column Layout */}
      <div className={styles.mainLayout}>
        {/* Left Column - Controls */}
        <div className={styles.leftCol}>
          <div className={styles.scrollArea}>
            <div className={styles.controlsPadding}>
              
              {/* Core Type Section */}
              <div>
                <button 
                  type="button"
                  onClick={() => toggleSection("core")}
                  className={styles.collapsibleTrigger}
                >
                  <span className={styles.collapsibleTitle}>Core Type</span>
                  <ChevronDown 
                    className={`${styles.chevron} ${openSections.core ? styles.chevronOpen : ""}`} 
                    strokeWidth={1.5} 
                  />
                </button>
                <div className={`${styles.collapsibleContent} ${openSections.core ? styles.contentOpen : styles.contentClosed}`}>
                  <div className={styles.formGroup}>
                    {/* Native Select substitution */}
                    <select 
                      value={coreType} 
                      onChange={(e) => setCoreType(e.target.value)}
                      className={styles.select}
                    >
                      {coreTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    
                    <p className={styles.helperText}>
                      {coreTypes.find(t => t.value === coreType)?.description}
                    </p>

                    {coreType === "star" && (
                      <div className={styles.fieldWrapper}>
                        <label className={styles.label}>Star Points</label>
                        <div className={styles.inputContainer}>
                          <input
                            type="number"
                            value={starPoints}
                            onChange={(e) => setStarPoints(e.target.value)}
                            className={styles.input}
                            style={{ paddingRight: '2rem' }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Dimensions Section */}
              <div>
                <button 
                  type="button"
                  onClick={() => toggleSection("dimensions")}
                  className={styles.collapsibleTrigger}
                >
                  <span className={styles.collapsibleTitle}>Dimensions</span>
                  <ChevronDown 
                    className={`${styles.chevron} ${openSections.dimensions ? styles.chevronOpen : ""}`} 
                    strokeWidth={1.5} 
                  />
                </button>
                <div className={`${styles.collapsibleContent} ${openSections.dimensions ? styles.contentOpen : styles.contentClosed}`}>
                  <div className={styles.formGroup}>
                    
                    <div className={styles.fieldWrapper}>
                      <label className={styles.label}>Outer Diameter</label>
                      <div className={styles.inputContainer}>
                        <input
                          type="number"
                          value={outerDiameter}
                          onChange={(e) => setOuterDiameter(e.target.value)}
                          className={styles.input}
                        />
                        <span className={styles.inputUnit}>mm</span>
                      </div>
                    </div>

                    <div className={styles.fieldWrapper}>
                      <label className={styles.label}>Inner Port Diameter</label>
                      <div className={styles.inputContainer}>
                        <input
                          type="number"
                          value={innerDiameter}
                          onChange={(e) => setInnerDiameter(e.target.value)}
                          className={styles.input}
                        />
                        <span className={styles.inputUnit}>mm</span>
                      </div>
                    </div>

                    <div className={styles.fieldWrapper}>
                      <label className={styles.label}>Segment Length</label>
                      <div className={styles.inputContainer}>
                        <input
                          type="number"
                          value={grainLength}
                          onChange={(e) => setGrainLength(e.target.value)}
                          className={styles.input}
                        />
                        <span className={styles.inputUnit}>mm</span>
                      </div>
                    </div>

                    <div className={styles.fieldWrapper}>
                      <label className={styles.label}>Number of Segments</label>
                      <input
                        type="number"
                        value={segments}
                        onChange={(e) => setSegments(e.target.value)}
                        className={styles.input}
                        style={{ paddingRight: '0.5rem' }} /* Removes right padding since no unit */
                      />
                    </div>

                  </div>
                </div>
              </div>

              {/* Advanced Section */}
              <div>
                <button 
                  type="button"
                  onClick={() => toggleSection("advanced")}
                  className={styles.collapsibleTrigger}
                >
                  <span className={styles.collapsibleTitle}>Advanced</span>
                  <ChevronDown 
                    className={`${styles.chevron} ${openSections.advanced ? styles.chevronOpen : ""}`} 
                    strokeWidth={1.5} 
                  />
                </button>
                <div className={`${styles.collapsibleContent} ${openSections.advanced ? styles.contentOpen : styles.contentClosed}`}>
                  <div className={styles.formGroup}>
                    <div className={styles.advancedStats}>
                      <span>Web Thickness: <span className={styles.statValue}>{((parseFloat(outerDiameter) - parseFloat(innerDiameter)) / 2).toFixed(1)} mm</span></span>
                      <span>Port/Throat Ratio: <span className={styles.statValue}>2.8</span></span>
                      <span>L/D Ratio: <span className={styles.statValue}>{(parseFloat(grainLength) / parseFloat(outerDiameter)).toFixed(2)}</span></span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column - Visualization Canvas */}
        <div className={styles.rightCol}>
          {/* Canvas Header */}
          <div className={styles.canvasHeader}>
            <span className={styles.canvasTitle}>
              2D Cross-Section Preview
            </span>
            <span className={styles.canvasScale}>Scale: 1:1</span>
          </div>

          {/* Canvas Area */}
          <div className={styles.canvasArea}>
            {/* Grid Background */}
            <div className={styles.canvasGrid} />

            {/* Center Crosshairs */}
            <div className={styles.crosshairV} />
            <div className={styles.crosshairH} />

            {/* SVG Grain Cross-Section */}
            <svg className={styles.svgCanvas} viewBox="-100 -100 200 200">
              {/* Outer Circle (Grain) */}
              <circle
                cx="0"
                cy="0"
                r={outerRadius}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2"
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
                <>
                  <circle
                    cx="0"
                    cy="0"
                    r={innerRadius}
                    fill="#0a0a0f"
                    stroke="var(--primary)"
                    strokeWidth="1.5"
                  />
                </>
              )}

              {coreType === "star" && (
                <polygon
                  points={generateStarPoints(0, 0, parseInt(starPoints) || 5, innerRadius * 1.5, innerRadius * 0.6)}
                  fill="#0a0a0f"
                  stroke="var(--primary)"
                  strokeWidth="1.5"
                />
              )}

              {coreType === "finocyl" && (
                <>
                  <circle
                    cx="0"
                    cy="0"
                    r={innerRadius}
                    fill="#0a0a0f"
                    stroke="var(--primary)"
                    strokeWidth="1.5"
                  />
                  {[0, 60, 120, 180, 240, 300].map((angle) => (
                    <rect
                      key={angle}
                      x={-2}
                      y={-outerRadius * 0.75}
                      width={4}
                      height={outerRadius * 0.75 - innerRadius}
                      fill="#0a0a0f"
                      stroke="var(--primary)"
                      strokeWidth="1"
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
                  stroke="var(--primary)"
                  strokeWidth="1.5"
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
                  stroke="var(--primary)"
                  strokeWidth="1.5"
                />
              )}

              {/* Dimension Lines */}
              <line x1={-outerRadius - 15} y1={-outerRadius} x2={-outerRadius - 15} y2={outerRadius} stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
              <line x1={-outerRadius - 18} y1={-outerRadius} x2={-outerRadius - 12} y2={-outerRadius} stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
              <line x1={-outerRadius - 18} y1={outerRadius} x2={-outerRadius - 12} y2={outerRadius} stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
              <text x={-outerRadius - 20} y="4" fill="rgba(255,255,255,0.5)" fontSize="6" textAnchor="end" fontFamily="monospace">
                {outerDiameter}mm
              </text>
            </svg>

            {/* Corner Info */}
            <div className={styles.cornerInfo}>
              <span className={styles.cornerLabel}>Type: <span className={styles.cornerValuePrimary}>{coreTypes.find(t => t.value === coreType)?.label}</span></span>
              <span className={styles.cornerLabel}>OD: <span className={styles.cornerValue}>{outerDiameter} mm</span></span>
              <span className={styles.cornerLabel}>ID: <span className={styles.cornerValue}>{innerDiameter} mm</span></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function generateStarPoints(cx: number, cy: number, points: number, outerRadius: number, innerRadius: number): string {
  const angle = Math.PI / points
  const coords: string[] = []
  
  for (let i = 0; i < 2 * points; i++) {
    const r = i % 2 === 0 ? outerRadius : innerRadius
    const a = i * angle - Math.PI / 2
    coords.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`)
  }
  
  return coords.join(' ')
}