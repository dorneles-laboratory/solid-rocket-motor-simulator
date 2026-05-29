import { useEffect } from 'react';
import ComingSoon from '../../components/cooming-soon/coming-soon';
import { FooterProps } from '../../components/layout/footer/footer';
import styles from './GeometryEditorView.module.css';

interface GeometryEditorViewProps {
  setFooter: (data: FooterProps) => void;
}

export default function GeometryEditorView({ setFooter }: GeometryEditorViewProps) {
  useEffect(() => {
    setFooter({
      description: "Edite a geometria do seu motor sólido de foguete com uma interface visual intuitiva.",
      rightText: "Em breve uma nova funcionalidade."
    });
  }, [setFooter]);

  return (
    <section className={styles.geometry_editor_view}>
      <ComingSoon />
    </section>
  )
}