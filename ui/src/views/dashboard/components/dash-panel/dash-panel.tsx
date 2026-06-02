import { ReactNode } from 'react';
import styles from './dash-panel.module.css';

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
  icon?: ReactNode; // Ícone específico para cada alerta
  variant?: 'Warning' | 'Info' | 'Success' | 'Critical'; // Combina com as classes do seu CSS (ex: .typeWarning)
}

interface DashboardPanelProps {
  type: 'graphic' | 'data' | 'text' | 'custom';
  panelTitle: string;
  icon?: ReactNode;
  rightText?: string;
  
  // Gráficos
  legends?: DashboardPanelLegendItem[];
  xRange?: [number, number];
  yRange?: [number, number];
  xAxisUnit?: string;
  yAxisUnit?: string;
  
  // Dados Numéricos / Geometria
  dataItems?: DashboardDataItem[];
  
  // Textos e Alertas
  textItems?: DashboardTextItem[];

  children?: ReactNode;
}

export default function DashboardPanel({
  type,
  panelTitle,
  icon,
  rightText,
  legends,
  xRange = [0, 1],
  yRange = [0, 1],
  xAxisUnit = '',
  yAxisUnit = '',
  dataItems,
  textItems,
  children
}: DashboardPanelProps) {

  // --- LÓGICA DO GRÁFICO DINÂMICO ---
  const SVG_WIDTH = 600;
  const SVG_HEIGHT = 200;
  const [xMin, xMax] = xRange;
  const [yMin, yMax] = yRange;

  const generateSvgPath = (points: ChartDataPoint[] | undefined) => {
    if (!points || points.length === 0) return '';
    return points.map((point, index) => {
      const x = ((point.x - xMin) / (xMax - xMin)) * SVG_WIDTH;
      const y = SVG_HEIGHT - ((point.y - yMin) / (yMax - yMin)) * SVG_HEIGHT;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');
  };

  const generateAreaPath = (points: ChartDataPoint[] | undefined) => {
    const linePath = generateSvgPath(points);
    if (!linePath || !points) return '';
    const firstX = (((points[0].x - xMin) / (xMax - xMin)) * SVG_WIDTH).toFixed(1);
    const lastX = (((points[points.length - 1].x - xMin) / (xMax - xMin)) * SVG_WIDTH).toFixed(1);
    return `${linePath} L ${lastX} ${SVG_HEIGHT} L ${firstX} ${SVG_HEIGHT} Z`;
  };

  const yAxisLabels = [];
  for (let i = 3; i >= 0; i--) {
    const val = yMin + (i * (yMax - yMin)) / 3;
    yAxisLabels.push(`${val.toFixed(0)}${yAxisUnit}`);
  }

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

        {(legends || rightText) && (
          <div className={styles.chartLegend}>
            {rightText && (
              <div className={styles.legendItem}>
                <span className={styles.legendLabel}>{rightText}</span>
              </div>
            )}
            {type === 'graphic' && legends?.map((legend) => (
              <div key={legend.label} className={styles.legendItem}>
                {/* Mantém a cor dinâmica injetada via style, mas usa a classe base do CSS */}
                <div className={styles.legendColor} style={{ backgroundColor: legend.color }} />
                <span className={styles.legendLabel}>{legend.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BODY */}
      <div className={styles.panelBody}>
        
        {/* CASO 1: GRÁFICO */}
        {type === 'graphic' && (
          <div className={styles.chartContainer}>
            <div className={styles.chartGrid} />
            <svg className={styles.chartSvg} viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} preserveAspectRatio="none">
              {legends?.map((legend, index) => {
                const pathD = generateSvgPath(legend.data);
                const areaD = generateAreaPath(legend.data);
                if (!pathD) return null;

                return (
                  <g key={legend.label}>
                    <path d={areaD} fill={`url(#gradient-${index})`} opacity="0.2" />
                    <path
                      d={pathD}
                      fill="none"
                      stroke={legend.color}
                      strokeWidth="2"
                      style={{ filter: "drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))" }}
                    />
                    <defs>
                      <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={legend.color} />
                        <stop offset="100%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                  </g>
                );
              })}
            </svg>
            <div className={styles.chartAxisY}>
              {yAxisLabels.map((label, idx) => <span key={idx} className={styles.axisLabel}>{label}</span>)}
            </div>
            <div className={styles.chartAxisX}>
              {xAxisLabels.map((label, idx) => <span key={idx} className={styles.axisLabel}>{label}</span>)}
            </div>
          </div>
        )}

        {/* GEOMETRIA E DADOS */}
        {type === 'data' && dataItems && (
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
        {type === 'text' && textItems && (
          <div className={styles.alertContainer}>
            {textItems.length > 0 ? (
              textItems.map((item, idx) => {
                const variantClass = item.variant 
                  ? styles[`type${item.variant.charAt(0).toUpperCase() + item.variant.slice(1)}`] 
                  : '';

                return (
                  <div 
                    key={idx} 
                    className={`${styles.alertItem} ${variantClass}`.trim()}
                  >
                    {item.icon && <div className={styles.alertIconWrapper}>{item.icon}</div>}
                    
                    <div className={styles.alertContent}>
                      <p className={styles.alertMessage}>{item.text}</p>
                      
                      {item.time && <span className={styles.alertTime}>{item.time}</span>}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={styles.alertItem}>
                <div className={styles.alertContent}>
                  <span className={styles.alertMessage} style={{ color: 'var(--muted-foreground)' }}>
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