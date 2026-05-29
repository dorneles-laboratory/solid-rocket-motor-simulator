import { useEffect } from "react";
import ComingSoon from "../../components/cooming-soon/coming-soon"
import { FooterProps } from "../../components/layout/footer/footer";
import styles from "./SettingsView.module.css"

interface SettingsViewProps {
  setFooter: (data: FooterProps) => void;
}

export default function Settings({ setFooter }: SettingsViewProps) {
  useEffect(() => {
    setFooter({
      description: "Configure suas preferências e ajustes para otimizar sua experiência no aplicativo.",
      rightText: "Em breve uma nova funcionalidade."
    });
  }, [setFooter]);

  return (
    <section className={styles.settings_view}>
      <ComingSoon />
    </section>
  )
}