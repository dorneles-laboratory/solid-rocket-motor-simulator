import { useEffect } from 'react';
import ComingSoon from '../../components/cooming-soon/coming-soon';
import { FooterProps } from '../../components/layout/footer/footer';
import styles from './BoundaryConditionsView.module.css';

interface BoundaryConditionsViewProps {
  setFooter: (data: FooterProps) => void;
}

export default function BoundaryConditionsView({ setFooter }: BoundaryConditionsViewProps) {
  useEffect(() => {
    setFooter({
      description: "Configuração de condições de contorno para simulações",
      rightText: "Em breve uma nova funcionalidade."
    });
  }, [setFooter]);

  return (
    <section className={styles.boundary_conditions_view}>
      <ComingSoon />
    </section>
  )
}