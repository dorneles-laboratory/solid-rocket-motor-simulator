"use client"

import { useState } from "react"
import { Cloud, Thermometer, Mountain, Flame, Save } from "lucide-react"
import styles from "./BoundaryConditionsView.module.css"

export default function BoundaryConditionsView() {
  const [ambientPressure, setAmbientPressure] = useState("1.0")
  const [ambientTemperature, setAmbientTemperature] = useState("25")
  const [launchElevation, setLaunchElevation] = useState("0")
  const [grainTemperature, setGrainTemperature] = useState("20")

  const handleSave = () => {
    console.log({
      ambientPressure,
      ambientTemperature,
      launchElevation,
      grainTemperature,
    })
  }

  return (
    <section className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerTitleWrapper}>
          <Cloud className={styles.headerIcon} strokeWidth={1.5} />
          <h1 className={styles.headerTitle}>
            Condições de Contorno
          </h1>
        </div>
      </header>

      {/* Content */}
      <div className={styles.contentArea}>
        <div className={styles.mainGrid}>
          {/* Atmospheric Conditions Section */}
          <div className={styles.sectionContainer}>
            <div className={styles.sectionHeader}>
              <div className={`${styles.sectionIconBox} ${styles.iconSky}`}>
                <Cloud size={16} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className={styles.sectionTitle}>Condições Atmosféricas</h2>
                <p className={styles.sectionSubtitle}>Parâmetros ambientais do local de lançamento</p>
              </div>
            </div>

            <div className={styles.cardGrid}>
              <div className={styles.fieldWrapper}>
                <label htmlFor="ambient-pressure" className={styles.label}>
                  <Mountain className={styles.labelIcon} strokeWidth={1.5} />
                  Pressão Ambiente
                </label>
                <div className={styles.inputContainer}>
                  <input
                    id="ambient-pressure"
                    type="number"
                    step="0.01"
                    value={ambientPressure}
                    onChange={(e) => setAmbientPressure(e.target.value)}
                    className={styles.input}
                    style={{ paddingRight: '3rem' }} // Compensa a unidade maior
                  />
                  <span className={styles.inputUnit}>atm</span>
                </div>
                <p className={styles.fieldHelper}>Padrão: 1.0 atm ao nível do mar</p>
              </div>

              <div className={styles.fieldWrapper}>
                <label htmlFor="ambient-temp" className={styles.label}>
                  <Thermometer className={styles.labelIcon} strokeWidth={1.5} />
                  Temperatura Ambiente
                </label>
                <div className={styles.inputContainer}>
                  <input
                    id="ambient-temp"
                    type="number"
                    step="0.1"
                    value={ambientTemperature}
                    onChange={(e) => setAmbientTemperature(e.target.value)}
                    className={styles.input}
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <span className={styles.inputUnit}>°C</span>
                </div>
                <p className={styles.fieldHelper}>Faixa típica: -20°C a 45°C</p>
              </div>

              <div className={styles.fieldWrapper}>
                <label htmlFor="elevation" className={styles.label}>
                  <Mountain className={styles.labelIcon} strokeWidth={1.5} />
                  Elevação do Local
                </label>
                <div className={styles.inputContainer}>
                  <input
                    id="elevation"
                    type="number"
                    step="1"
                    value={launchElevation}
                    onChange={(e) => setLaunchElevation(e.target.value)}
                    className={styles.input}
                    style={{ paddingRight: '2rem' }}
                  />
                  <span className={styles.inputUnit}>m</span>
                </div>
                <p className={styles.fieldHelper}>Altitude acima do nível do mar</p>
              </div>
            </div>
          </div>

          {/* Initial Motor State Section */}
          <div className={styles.sectionContainer}>
            <div className={styles.sectionHeader}>
              <div className={`${styles.sectionIconBox} ${styles.iconOrange}`}>
                <Flame size={16} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className={styles.sectionTitle}>Estado Inicial do Motor</h2>
                <p className={styles.sectionSubtitle}>Condições do propelente antes da ignição</p>
              </div>
            </div>

            <div className={styles.cardGrid}>
              <div className={styles.fieldWrapper}>
                <label htmlFor="grain-temp" className={styles.label}>
                  <Thermometer className={styles.labelIcon} strokeWidth={1.5} />
                  Temperatura Inicial do Grão
                </label>
                <div className={styles.inputContainer}>
                  <input
                    id="grain-temp"
                    type="number"
                    step="0.1"
                    value={grainTemperature}
                    onChange={(e) => setGrainTemperature(e.target.value)}
                    className={styles.input}
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <span className={styles.inputUnit}>°C</span>
                </div>
                <p className={styles.fieldHelper}>Afeta a taxa de queima do propelente</p>
              </div>

              <div className={styles.alertBox}>
                <div className={styles.alertContent}>
                  <div className={styles.alertIconWrapper}>
                    <span className={styles.alertMark}>!</span>
                  </div>
                  <div>
                    <p className={styles.alertTitle}>Nota sobre Temperatura</p>
                    <p className={styles.alertText}>
                      A temperatura do grão propelente afeta significativamente a taxa de queima. 
                      Propelentes mais quentes queimam mais rápido, resultando em maior pressão de câmara e empuxo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <span className={styles.footerNote}>
          Alterações serão aplicadas na próxima simulação
        </span>
        <button
          type="button"
          onClick={handleSave}
          className={styles.saveButton}
        >
          <Save size={12} strokeWidth={2} />
          Salvar Condições
        </button>
      </footer>
    </section>
  )
}










// import { useEffect } from 'react';
// import ComingSoon from '../../../../components/cooming-soon/coming-soon';
// import { FooterProps } from '../../../../components/layout/footer/footer';
// import styles from './BoundaryConditionsView.module.css';

// interface BoundaryConditionsViewProps {
//   setFooter: (data: FooterProps) => void;
// }

// export default function BoundaryConditionsView({ setFooter }: BoundaryConditionsViewProps) {
//   useEffect(() => {
//     setFooter({
//       description: "Configuração de condições de contorno para simulações",
//       rightText: "Em breve uma nova funcionalidade."
//     });
//   }, [setFooter]);

//   return (
//     <section className={styles.boundary_conditions_view}>
//       <ComingSoon />
//     </section>
//   )
// }