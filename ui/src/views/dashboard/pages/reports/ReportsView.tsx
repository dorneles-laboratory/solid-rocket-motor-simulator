import { useEffect, useState } from "react"
import styles from "./ReportsView.module.css"
import { 
  FileText, 
  Download, 
  FileSpreadsheet,
  Box,
  Rocket,
  Check,
  ChevronDown
} from "lucide-react"
import ExportPDFButton from "./components/generate-pdf-button/generate-pdf-button"
import ExportButton from "./components/export-button/export-button"
import { FooterProps } from "../../../../components/layout/footer/footer"

interface ReportsViewProps {
  setFooter: (data: FooterProps) => void;
}

export default function ReportsView({ setFooter }: ReportsViewProps) {
  const [openSections, setOpenSections] = useState({
    document: true,
    export: true,
  })
  
  const [documentOptions, setDocumentOptions] = useState({
    performanceGraphs: true,
    geometrySpecs: true,
    massBreakdown: true,
    propellantData: false,
    structuralAnalysis: false,
    thermalAnalysis: false,
  })

  useEffect(() => {
    setFooter({
      description: "Gere relatórios detalhados sobre o desempenho do seu motor sólido de foguete, incluindo gráficos de impulso específico, tempo de queima e muito mais.",
      rightText: "Em breve uma nova funcionalidade."
    });
  }, [setFooter]);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const toggleOption = (option: keyof typeof documentOptions) => {
    setDocumentOptions((prev) => ({ ...prev, [option]: !prev[option] }))
  }

  const selectedCount = Object.values(documentOptions).filter(Boolean).length

  const documentOptionsList = [
    { key: "performanceGraphs", label: "Performance Graphs", description: "Thrust curve, pressure, mass flow" },
    { key: "geometrySpecs", label: "Geometry Specifications", description: "Grain dimensions and cross-sections" },
    { key: "massBreakdown", label: "Mass Breakdown", description: "Propellant, case, nozzle masses" },
    { key: "propellantData", label: "Propellant Data", description: "Chemical composition, burn rate" },
    { key: "structuralAnalysis", label: "Structural Analysis", description: "Safety factors, stress analysis" },
    { key: "thermalAnalysis", label: "Thermal Analysis", description: "Temperature profiles, insulation" },
  ]

  return (
    <section className={styles.reports_view}>
      {/* Main Scrollable Content */}
      <div className={styles.scrollArea}>
        <div className={styles.contentPadding}>
          
          {/* Generate Motor Document Section */}
          <div className={styles.collapsibleCard}>
            <button 
              type="button"
              className={styles.triggerButton}
              onClick={() => toggleSection("document")}
            >
              <div className={styles.triggerLeft}>
                <FileText className={styles.headerIcon} strokeWidth={1.5} />
                <span className={styles.triggerTitle}>
                  Generate Motor Document
                </span>
              </div>
              <div className={styles.triggerRight}>
                <span className={styles.triggerSubtitle}>
                  {selectedCount} selected
                </span>
                <ChevronDown 
                  className={`${styles.chevron} ${openSections.document ? styles.chevronOpen : ""}`} 
                  strokeWidth={1.5} 
                />
              </div>
            </button>
            
            <div className={`${styles.collapsibleWrapper} ${openSections.document ? styles.collapsibleWrapperOpen : ""}`}>
              <div className={styles.collapsibleInner}>
                <div className={styles.contentPaddingInner}>
                  <p className={styles.sectionDescription}>
                    Select the sections to include in your motor documentation PDF.
                  </p>
                  
                  <div className={styles.checkboxGrid}>
                    {documentOptionsList.map((option) => {
                      const isSelected = documentOptions[option.key as keyof typeof documentOptions]
                      
                      return (
                        <div 
                          key={option.key}
                          className={`${styles.optionCard} ${isSelected ? styles.optionCardSelected : styles.optionCardUnselected}`}
                          onClick={() => toggleOption(option.key as keyof typeof documentOptions)}
                        >
                          <input
                            id={option.key}
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleOption(option.key as keyof typeof documentOptions)}
                            className={styles.checkboxNative}
                            onClick={(e) => e.stopPropagation()} // Previne clique duplo ao clicar direto no input
                          />
                          <div className={styles.optionTextWrapper}>
                            <label 
                              htmlFor={option.key} 
                              className={styles.optionLabel}
                              onClick={(e) => e.preventDefault()} // O wrapper já gerencia o clique
                            >
                              {option.label}
                            </label>
                            <span className={styles.optionDesc}>
                              {option.description}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Export Section */}
          <div className={styles.collapsibleCard}>
            <button 
              type="button"
              className={styles.triggerButton}
              onClick={() => toggleSection("export")}
            >
              <div className={styles.triggerLeft}>
                <Download className={styles.headerIcon} strokeWidth={1.5} />
                <span className={styles.triggerTitle}>
                  Data Export
                </span>
              </div>
              <div className={styles.triggerRight}>
                <ChevronDown 
                  className={`${styles.chevron} ${openSections.export ? styles.chevronOpen : ""}`} 
                  strokeWidth={1.5} 
                />
              </div>
            </button>

            <div className={`${styles.collapsibleWrapper} ${openSections.export ? styles.collapsibleWrapperOpen : ""}`}>
              <div className={styles.collapsibleInner}>
                <div className={styles.contentPaddingInner}>
                  <p className={styles.sectionDescription}>
                    Export motor data in various formats for use in other applications.
                  </p>
                  
                  <div className={styles.exportGrid}>
                    <ExportButton
                      icon={<FileSpreadsheet className={styles.icon} strokeWidth={1.5} />}
                      label="Thrust Curve"
                      format=".CSV"
                    />
                    <ExportButton
                      icon={<Box className={styles.icon} strokeWidth={1.5} />}
                      label="Geometry"
                      format=".STEP / .DXF"
                    />
                    <ExportButton
                      icon={<Rocket className={styles.icon} strokeWidth={1.5} />}
                      label="OpenRocket"
                      format=".ENG"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Generate PDF Button */}
          <ExportPDFButton selectedCount={selectedCount} />

          {/* Info Note */}
          <div className={styles.infoNote}>
            <Check className={styles.infoIcon} strokeWidth={1.5} />
            <p className={styles.infoText}>
              All exports comply with NAR/TRA documentation standards. PDF reports include a cover page 
              with project information and a summary of key performance metrics.
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
