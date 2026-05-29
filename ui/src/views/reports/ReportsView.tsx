import { useEffect } from 'react';
import ComingSoon from '../../components/cooming-soon/coming-soon';
import { FooterProps } from '../../components/layout/footer/footer';
import styles from './ReportsView.module.css';

interface ReportsViewProps {
  setFooter: (data: FooterProps) => void;
}

export default function ReportsView({ setFooter }: ReportsViewProps) {
  useEffect(() => {
    setFooter({
      description: "Gere relatórios detalhados sobre o desempenho do seu motor sólido de foguete, incluindo gráficos de impulso específico, tempo de queima e muito mais.",
      rightText: "Em breve uma nova funcionalidade."
    });
  }, [setFooter]);
  
  return (
    <section className={styles.reports_view}>
      <ComingSoon />
    </section>
  );
}