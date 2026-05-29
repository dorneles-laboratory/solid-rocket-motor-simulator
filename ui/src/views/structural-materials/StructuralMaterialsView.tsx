import { useEffect } from 'react';
import ComingSoon from '../../components/cooming-soon/coming-soon';
import { FooterProps } from '../../components/layout/footer/footer';
import styles from './StructuralMaterialsView.module.css';

interface StructuralMaterialsViewProps {
  setFooter: (data: FooterProps) => void;
}

export default function StructuralMaterialsView({ setFooter }: StructuralMaterialsViewProps) {
  useEffect(() => {
    setFooter({
      description: "Explore uma variedade de materiais estruturais para sua nave espacial, incluindo ligas de alumínio, aço inox e composites.",
      rightText: "Em breve uma nova funcionalidade."
    });
  }, [setFooter]);

  return (
    <section className={styles.structural_materials_view}>
      <ComingSoon />
    </section>
  );
}