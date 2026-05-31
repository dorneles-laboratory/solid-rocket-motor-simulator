package srm_engine.modules.settings;

import lombok.Data;

@Data
public class SettingsRequestDTO {
  private String unitSystem;
  private UnitPreferencesDTO preferences;
  private boolean autoSave;

  @Data
  public static class UnitPreferencesDTO {
      private String length;
      private String pressure;
      private String force;
      private String temperature;
  }
}