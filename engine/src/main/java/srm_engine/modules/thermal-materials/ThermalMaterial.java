package srm_engine.modules.thermal_material;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;

@Entity
@Table(name = "thermal_materials")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class ThermalMaterial {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(name = "name", nullable = false, unique = true)
  private String name;
  
  @Column(name = "density", nullable = false)
  private double density;
  
  @Column(name = "thermal_conductivity", nullable = false)
  private double thermalConductivity;
  
  @Column(name = "specific_heat", nullable = false)
  private double specificHeat;

  @Column(name = "max_service_temperature", nullable = false)
  private double maxServiceTemperature;

  @Column(name = "applications", nullable = true)
  private String applications;

  @CreatedDate
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @LastModifiedDate
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;
}