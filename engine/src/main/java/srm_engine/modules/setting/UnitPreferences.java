package srm_engine.modules.setting;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UnitPreferences {
  
  @Column(name = "preferences_length", nullable = false)
  private String length;

  @Column(name = "preferences_pressure", nullable = false)
  private String pressure;

  @Column(name = "preferences_force", nullable = false)
  private String force;

  @Column(name = "preferences_temperature", nullable = false)
  private String temperature;
}