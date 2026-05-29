import { useEffect } from 'react';
import ComingSoon from '../../components/cooming-soon/coming-soon';
import { FooterProps } from '../../components/layout/footer/footer';
import styles from './ThermalMaterialsView.module.css';

interface ThermalMaterialsViewProps {
  setFooter: (data: FooterProps) => void;
}

export default function ThermalMaterialsView({ setFooter }: ThermalMaterialsViewProps) {
  useEffect(() => {
    setFooter({
      description: "Descubra uma ampla seleção de materiais térmicos para sua nave espacial, incluindo isolantes térmicos e materiais de proteção contra calor.",
      rightText: "Em breve uma nova funcionalidade."
    });
  }, [setFooter]);

  return (
    <section className={styles.thermal_materials_view}>
      <ComingSoon />
    </section>
  )
}