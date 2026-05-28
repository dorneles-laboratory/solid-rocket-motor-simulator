import styles from "./footer.module.css"

type FooterLegendItem = {
  label: string
  color: string
}

type FooterProps = {
  index: string | number
  description: string
  legends?: FooterLegendItem[]
  rightText?: string
}

export default function Footer({
  index,
  description,
  legends,
  rightText,
}: FooterProps) {
  return (
    <footer className={styles.footer}>
      <span className={styles.footerText}>
        {index} {description}
      </span>

      {(legends || rightText) && (
        <div className={styles.footerRight}>
          {rightText && (
            <span className={styles.rightText}>
              {rightText}
            </span>
          )}

          {legends && (
            <div className={styles.footerLegend}>
              {legends.map((legend) => (
                <div
                  key={legend.label}
                  className={styles.legendItem}
                >
                  <div
                    className={styles.legendDot}
                    style={{
                      background: legend.color,
                    }}
                  />

                  <span className={styles.legendText}>
                    {legend.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </footer>
  )
}