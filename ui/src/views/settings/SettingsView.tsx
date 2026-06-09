import { useEffect, useState } from "react";
import { FooterProps } from "../../components/layout/footer/footer";
import styles from "./SettingsView.module.css";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "../../hooks/use-theme";
import { useTranslation } from "react-i18next";
import { LazyStore } from "@tauri-apps/plugin-store";
import { showToast } from "../../ui/toast/toast-container";

const isTauri = "__TAURI_INTERNALS__" in window || "__TAURI_IPC__" in window;
const store = new LazyStore(".user-settings.json");
interface SettingsViewProps {
  setFooter: (data: FooterProps) => void;
}

type UnitSystemMode = "metric" | "imperial" | "custom";

interface UnitPreferences {
  length: string;
  pressure: string;
  force: string;
  temperature: string;
}

const UNIT_OPTIONS = {
  length: ["m", "mm", "cm", "in", "ft"],
  pressure: ["Pa", "MPa", "kPa", "bar", "atm", "psi"],
  force: ["N", "kN", "kgf", "lbf"],
  temperature: ["K", "C", "F", "R"],
};

type Theme = "light" | "dark" | "system";

interface AppearanceSettings {
  theme: Theme;
  language: string;
}

export interface SettingsData {
  theme: Theme;
  unitSystem: UnitSystemMode;
  preferences: UnitPreferences;
  localization: {
    language: string;
  };
  autoSave: boolean;
}

export default function SettingsView({ setFooter }: SettingsViewProps) {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [, setSystemIsDark] = useState(false);

  const [settingsData, setSettingsData] = useState<SettingsData>({
    theme: theme,
    unitSystem: "metric",
    preferences: {
      length: "mm",
      pressure: "MPa",
      force: "N",
      temperature: "K",
    },
    localization: {
      language: i18n.language || "pt-BR",
    },
    autoSave: false,
  });

  useEffect(() => {
    const loadSavedSettings = async () => {
      try {
        let loadedTheme = theme;
        let loadedLanguage = i18n.language;

        if (isTauri) {
          const appearance = (await store.get(
            "appearance",
          )) as AppearanceSettings | null;
          if (appearance) {
            loadedTheme = appearance.theme || theme;
            loadedLanguage = appearance.language || i18n.language;
          }
        }

        const response = await fetch("http://localhost:8080/api/settings");
        let remoteData = null;
        if (response.ok) {
          remoteData = await response.json();
        }

        if (remoteData === null || remoteData === undefined) {
          showToast({
            type: "warning",
            title: "Load Failed",
            message: "No settings data received from server, using defaults.",
          });

          handleSave();
        }

        setSettingsData((prev) => ({
          theme: loadedTheme,
          localization: { language: loadedLanguage },
          unitSystem: remoteData?.unitSystem || prev.unitSystem,
          preferences: remoteData?.preferences || prev.preferences,
          autoSave:
            remoteData?.autoSave !== undefined
              ? remoteData.autoSave
              : prev.autoSave,
        }));
      } catch (error) {
        showToast({
          type: "error",
          title: "Load Failed",
          message: "An error occurred while loading saved settings.",
        });
        console.error("Error loading settings:", error);
      }
    };
    loadSavedSettings();
  }, []);

  useEffect(() => {
    setFooter({
      description: t("settings.footer.description"),
    });
  }, [setFooter, t, i18n.language]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setSettingsData({
      ...settingsData,
      localization: { ...settingsData.localization, language: newLang },
    });
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    setSettingsData({ ...settingsData, theme: newTheme });
  };

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemIsDark(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemIsDark(e.matches);
    };
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (settingsData.unitSystem === "metric") {
      setSettingsData({
        ...settingsData,
        preferences: {
          length: "mm",
          pressure: "MPa",
          force: "N",
          temperature: "K",
        },
      });
    } else if (settingsData.unitSystem === "imperial") {
      setSettingsData({
        ...settingsData,
        preferences: {
          length: "in",
          pressure: "psi",
          force: "lbf",
          temperature: "R",
        },
      });
    }
  }, [settingsData.unitSystem]);

  const handleCustomUnitChange = (
    key: keyof UnitPreferences,
    value: string,
  ) => {
    setSettingsData({
      ...settingsData,
      preferences: { ...settingsData.preferences, [key]: value },
    });
  };

  const handleSave = async () => {
    try {
      if (isTauri) {
        await store.set("appearance", {
          theme: settingsData.theme,
          language: settingsData.localization.language,
        });
        await store.save();
      } else {
        showToast({
          type: "warning",
          title: "Running in Web Mode",
          message:
            "Native Tauri saving is unavailable. Changes will not persist.",
        });
      }

      i18n.changeLanguage(settingsData.localization.language);

      const javaPayload = {
        unitSystem: settingsData.unitSystem,
        preferences: {
          length: settingsData.preferences.length,
          pressure: settingsData.preferences.pressure,
          force: settingsData.preferences.force,
          temperature: settingsData.preferences.temperature,
        },
        autoSave: settingsData.autoSave,
      };

      const response = await fetch("http://localhost:8080/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(javaPayload),
      });

      if (!response.ok) {
        showToast({
          type: "error",
          title: "Save Failed",
          message: "Failed to save settings.",
        });
        throw new Error("Falha ao salvar as configurações no servidor.");
      }

      showToast({
        type: "success",
        title: "Settings Saved",
        message: "Your settings have been saved successfully.",
      });
    } catch (error) {
      showToast({
        type: "error",
        title: "Save Failed",
        message: "An error occurred while saving settings.",
      });
      console.error("Error saving settings:", error);
    }
  };

  const isLightActive = mounted && settingsData.theme === "light";
  const isDarkActive = mounted && settingsData.theme === "dark";
  const isSystemActive = mounted && settingsData.theme === "system";

  return (
    <section className={styles.settings_view}>
      <div className={styles.contentPadding}>
        {/* Localização e Geral Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              {t("settings.localization.title")}
            </h2>
            <p className={styles.sectionSubtitle}>
              {t("settings.localization.subtitle")}
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Idioma (Language)</label>
              <select
                value={settingsData.localization.language}
                onChange={handleLanguageChange}
                className={`${styles.input} ${styles.select}`}
              >
                <option value="pt-BR">Português (BR)</option>
                <option value="en-US">English</option>
              </select>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Auto-Save</h2>
            <p className={styles.sectionSubtitle}>
              Comportamento geral de salvamento.
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.fieldGroup}>
              <div className={styles.toggleWrapper}>
                <label className={styles.label}>
                  Auto-Save (Salvar alterações automaticamente)
                </label>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={settingsData.autoSave}
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        autoSave: e.target.checked,
                      })
                    }
                    className={styles.toggleInput}
                  />
                  <span className={styles.toggleSlider}></span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Simulation Preferences Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Preferências de Simulação</h2>
            <p className={styles.sectionSubtitle}>
              Configurações padrão para cálculos e unidades.
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Sistema de Unidades</label>

              <div className={styles.radioGroup}>
                {(["metric", "imperial", "custom"] as UnitSystemMode[]).map(
                  (mode) => (
                    <div className={styles.radioItem} key={mode}>
                      <input
                        type="radio"
                        id={mode}
                        name="unitMode"
                        value={mode}
                        checked={settingsData.unitSystem === mode}
                        onChange={(e) =>
                          setSettingsData({
                            ...settingsData,
                            unitSystem: e.target.value as UnitSystemMode,
                          })
                        }
                        className={styles.radioInput}
                      />
                      <label htmlFor={mode} className={styles.label}>
                        {mode === "metric"
                          ? "Métrico (SI)"
                          : mode === "imperial"
                            ? "Imperial"
                            : "Personalizado"}
                      </label>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Tabela de Unidades (Dinâmica) */}
            <div className={styles.unitsTableWrapper}>
              <div className={styles.unitsGrid}>
                {/* Comprimento */}
                <span>Comprimento:</span>
                {settingsData.unitSystem === "custom" ? (
                  <select
                    value={settingsData.preferences.length}
                    onChange={(e) =>
                      handleCustomUnitChange("length", e.target.value)
                    }
                    className={`${styles.input} ${styles.select}`}
                  >
                    {UNIT_OPTIONS.length.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className={styles.fontMono}>
                    {settingsData.preferences.length}
                  </span>
                )}

                {/* Pressão */}
                <span>Pressão:</span>
                {settingsData.unitSystem === "custom" ? (
                  <select
                    value={settingsData.preferences.pressure}
                    onChange={(e) =>
                      handleCustomUnitChange("pressure", e.target.value)
                    }
                    className={`${styles.input} ${styles.select}`}
                  >
                    {UNIT_OPTIONS.pressure.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className={styles.fontMono}>
                    {settingsData.preferences.pressure}
                  </span>
                )}

                {/* Força */}
                <span>Força:</span>
                {settingsData.unitSystem === "custom" ? (
                  <select
                    value={settingsData.preferences.force}
                    onChange={(e) =>
                      handleCustomUnitChange("force", e.target.value)
                    }
                    className={`${styles.input} ${styles.select}`}
                  >
                    {UNIT_OPTIONS.force.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className={styles.fontMono}>
                    {settingsData.preferences.force}
                  </span>
                )}

                {/* Temperatura */}
                <span>Temperatura:</span>
                {settingsData.unitSystem === "custom" ? (
                  <select
                    value={settingsData.preferences.temperature}
                    onChange={(e) =>
                      handleCustomUnitChange("temperature", e.target.value)
                    }
                    className={`${styles.input} ${styles.select}`}
                  >
                    {UNIT_OPTIONS.temperature.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className={styles.fontMono}>
                    {settingsData.preferences.temperature}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Appearance Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Aparência</h2>
            <p className={styles.sectionSubtitle}>
              Personalize a aparência da interface.
            </p>
          </div>
          <div className={styles.card}>
            <label className={styles.label}>Tema</label>
            <div className={styles.themeButtonsWrapper}>
              <button
                type="button"
                onClick={() => handleThemeChange("light")}
                className={`${styles.themeBtn} ${isLightActive ? styles.themeBtnActive : styles.themeBtnInactive}`}
              >
                <Sun className={styles.themeIconSun} strokeWidth={1.5} />
                <span className={styles.themeBtnText}>Claro</span>
              </button>
              <button
                type="button"
                onClick={() => handleThemeChange("dark")}
                className={`${styles.themeBtn} ${isDarkActive ? styles.themeBtnActive : styles.themeBtnInactive}`}
              >
                <Moon className={styles.themeIconMoon} strokeWidth={1.5} />
                <span className={styles.themeBtnText}>Escuro</span>
              </button>
              <button
                type="button"
                onClick={() => handleThemeChange("system")}
                className={`${styles.themeBtn} ${isSystemActive ? styles.themeBtnActive : styles.themeBtnInactive}`}
              >
                <Monitor
                  className={styles.themeIconMonitor}
                  strokeWidth={1.5}
                />
                <span className={styles.themeBtnText}>Sistema</span>
              </button>
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className={styles.saveWrapper}>
          <button type="button" className={styles.saveBtn} onClick={handleSave}>
            Salvar Configurações
          </button>
        </div>
      </div>
    </section>
  );
}
