import { ReactNode } from "react";
import styles from "./dash-panel.module.css";

export interface ChartDataPoint {
  x: number;
  y: number;
}

export interface DashboardPanelLegendItem {
  label: string;
  color: string;
  data?: ChartDataPoint[];
}

export interface DashboardDataItem {
  label: string;
  value: string | number;
}

export interface DashboardTextItem {
  text: string;
  time?: string;
  icon?: ReactNode;
  variant?: "Warning" | "Info" | "Success" | "Critical";
}

interface DashboardPanelProps {
  type: "graphic" | "data" | "text" | "custom";
  panelTitle: string;
  icon?: ReactNode;
  rightText?: string;

  headerActions?: ReactNode;

  legends?: DashboardPanelLegendItem[];
  xRange?: [number, number];
  yRange?: [number, number];
  xAxisUnit?: string;
  yAxisUnit?: string;
  secondaryYRange?: [number, number];
  secondaryYAxisUnit?: string;

  dataItems?: DashboardDataItem[];
  textItems?: DashboardTextItem[];
  children?: ReactNode;
}

export default function DashboardPanel({
  type,
  panelTitle,
  icon,
  rightText,
  headerActions,
  legends,
  xRange = [0, 1],
  yRange = [0, 1],
  xAxisUnit = "",
  yAxisUnit = "",
  secondaryYRange,
  secondaryYAxisUnit = "",
  dataItems,
  textItems,
  children,
}: DashboardPanelProps) {
  // --- LÓGICA DO GRÁFICO DINÂMICO ---
  const SVG_WIDTH = 600;
  const SVG_HEIGHT = 200;
  const [xMin, xMax] = xRange;

  // Calcula o caminho SVG dinamicamente baseado na escala que a linha pedir
  const generateSvgPath = (
    points: ChartDataPoint[] | undefined,
    scaleYMin: number,
    scaleYMax: number,
  ) => {
    if (!points || points.length === 0) return "";
    return points
      .map((point, index) => {
        const x = ((point.x - xMin) / (xMax - xMin)) * SVG_WIDTH;
        const rangeY = scaleYMax - scaleYMin || 1;
        const y = SVG_HEIGHT - ((point.y - scaleYMin) / rangeY) * SVG_HEIGHT;
        return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ");
  };

  const generateAreaPath = (
    points: ChartDataPoint[] | undefined,
    scaleYMin: number,
    scaleYMax: number,
  ) => {
    const linePath = generateSvgPath(points, scaleYMin, scaleYMax);
    if (!linePath || !points || points.length === 0) return "";
    const firstX = (((points[0].x - xMin) / (xMax - xMin)) * SVG_WIDTH).toFixed(
      1,
    );
    const lastX = (
      ((points[points.length - 1].x - xMin) / (xMax - xMin)) *
      SVG_WIDTH
    ).toFixed(1);
    return `${linePath} L ${lastX} ${SVG_HEIGHT} L ${firstX} ${SVG_HEIGHT} Z`;
  };

  // Eixo Y Principal (Esquerda - Empuxo)
  const yAxisLabels = [];
  for (let i = 3; i >= 0; i--) {
    const val = yRange[0] + (i * (yRange[1] - yRange[0])) / 3;
    yAxisLabels.push(`${val.toFixed(0)}${yAxisUnit}`);
  }

  // Eixo Y Secundário (Direita - Pressão)
  const secondaryYAxisLabels = [];
  if (secondaryYRange) {
    for (let i = 3; i >= 0; i--) {
      const val =
        secondaryYRange[0] +
        (i * (secondaryYRange[1] - secondaryYRange[0])) / 3;
      secondaryYAxisLabels.push(`${val.toFixed(1)}${secondaryYAxisUnit}`);
    }
  }

  // Eixo X (Base - Tempo)
  const xAxisLabels = [];
  for (let i = 0; i <= 4; i++) {
    const val = xMin + (i * (xMax - xMin)) / 4;
    xAxisLabels.push(`${val.toFixed(1)}${xAxisUnit}`);
  }

  return (
    <div className={styles.panel}>
      {/* HEADER */}
      <div className={styles.panelHeader}>
        <div className={styles.panelTitleWrapper}>
          {icon}
          <span className={styles.panelTitle}>{panelTitle}</span>
        </div>

        {headerActions && (
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            {headerActions}
          </div>
        )}

        {!headerActions && (legends || rightText) && (
          <div className={styles.chartLegend}>
            {rightText && (
              <div className={styles.legendItem}>
                <span className={styles.legendLabel}>{rightText}</span>
              </div>
            )}
            {type === "graphic" &&
              legends?.map((legend) => (
                <div key={legend.label} className={styles.legendItem}>
                  <div
                    className={styles.legendColor}
                    style={{ backgroundColor: legend.color }}
                  />
                  <span className={styles.legendLabel}>{legend.label}</span>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* BODY */}
      <div className={styles.panelBody}>
        {/* CASO 1: GRÁFICO */}
        {type === "graphic" && (
          <div className={styles.chartContainer}>
            <div className={styles.chartGrid} />
            <svg
              className={styles.chartSvg}
              viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
              preserveAspectRatio="none"
            >
              {legends?.map((legend, index) => {
                // Mágica do Eixo Duplo: A 2ª linha (index 1) usa o eixo secundário se ele existir
                const isSecondary = index === 1 && secondaryYRange;
                const currentYMin = isSecondary
                  ? secondaryYRange[0]
                  : yRange[0];
                const currentYMax = isSecondary
                  ? secondaryYRange[1]
                  : yRange[1];

                const pathD = generateSvgPath(
                  legend.data,
                  currentYMin,
                  currentYMax,
                );
                const areaD = generateAreaPath(
                  legend.data,
                  currentYMin,
                  currentYMax,
                );
                if (!pathD) return null;

                return (
                  <g key={legend.label}>
                    <path
                      d={areaD}
                      fill={`url(#gradient-${index})`}
                      opacity="0.2"
                    />
                    <path
                      d={pathD}
                      fill="none"
                      stroke={legend.color}
                      strokeWidth="2"
                      style={{
                        filter: "drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))",
                      }}
                    />
                    <defs>
                      <linearGradient
                        id={`gradient-${index}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor={legend.color} />
                        <stop offset="100%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                  </g>
                );
              })}
            </svg>

            {/* Eixo Esquerdo (Ex: Empuxo) */}
            <div className={styles.chartAxisY}>
              {yAxisLabels.map((label, idx) => (
                <span key={idx} className={styles.axisLabel}>
                  {label}
                </span>
              ))}
            </div>

            {/* Eixo Direito (Ex: Pressão) - Renderizado apenas se o secondaryYRange for passado */}
            {secondaryYRange && (
              <div
                className={styles.chartAxisY}
                style={{ left: "auto", right: 0, alignItems: "flex-end" }}
              >
                {secondaryYAxisLabels.map((label, idx) => (
                  <span key={idx} className={styles.axisLabel}>
                    {label}
                  </span>
                ))}
              </div>
            )}

            {/* Eixo Base (Tempo) */}
            <div className={styles.chartAxisX}>
              {xAxisLabels.map((label, idx) => (
                <span key={idx} className={styles.axisLabel}>
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* GEOMETRIA E DADOS */}
        {type === "data" && dataItems && (
          <div className={styles.grid2Cols}>
            {dataItems.map((item, idx) => (
              <div key={idx} className={styles.geometryItem}>
                <span className={styles.geoLabel}>{item.label}</span>
                <span className={styles.geoValue}>{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* ALERTAS E LOGS */}
        {type === "text" && textItems && (
          <div className={styles.alertContainer}>
            {textItems.length > 0 ? (
              textItems.map((item, idx) => {
                const variantClass = item.variant
                  ? styles[
                      `type${item.variant.charAt(0).toUpperCase() + item.variant.slice(1)}`
                    ]
                  : "";

                return (
                  <div
                    key={idx}
                    className={`${styles.alertItem} ${variantClass}`.trim()}
                  >
                    {item.icon && (
                      <div className={styles.alertIconWrapper}>{item.icon}</div>
                    )}
                    <div className={styles.alertContent}>
                      <p className={styles.alertMessage}>{item.text}</p>
                      {item.time && (
                        <span className={styles.alertTime}>{item.time}</span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={styles.alertItem}>
                <div className={styles.alertContent}>
                  <span
                    className={styles.alertMessage}
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    Nenhum alerta registrado.
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
