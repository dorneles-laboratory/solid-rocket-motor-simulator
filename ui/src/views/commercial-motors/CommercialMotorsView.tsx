import { useEffect } from 'react';
import ComingSoon from '../../components/cooming-soon/coming-soon';
import styles from './CommercialMotorsView.module.css';
import { FooterProps } from '../../components/layout/footer/footer';

interface CommercialMotorsViewProps {
  setFooter: (data: FooterProps) => void;
}

export default function CommercialMotorsView({ setFooter }: CommercialMotorsViewProps) {
  useEffect(() => {
    setFooter({
      description: "Motores comerciais para comparação e validação",
      rightText: "Em breve uma nova funcionalidade."
    });
  }, [setFooter])

  return (
    <section className={styles.commercial_motors_view}>
      <ComingSoon />
    </section>
  )
}