package srm_engine.modules.setting;

import lombok.Data;

@Data
public class SettingRequestDTO {
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