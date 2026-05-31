package srm_engine.modules.commercial_motors;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import srm_engine.shared.enums.ImpulseClass;

import java.util.UUID;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;

@Entity
@Table(name = "commercial_motors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class CommercialMotor {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(name = "manufacturer", nullable = false)
  private String manufacturer;
  
  @Column(name = "designation", nullable = false, unique = true)
  private String designation;
  
  @Enumerated(EnumType.STRING)
  @Column(name = "impulse_class", nullable = false)
  private ImpulseClass impulseClass;
  
  @Column(name = "total_impulse", nullable = false)
  private double totalImpulse;

  @Column(name = "max_thrust", nullable = false)
  private double maxThrust;

  @Column(name = "burn_time", nullable = false)
  private double burnTime;

  @Column(name = "propellant_mass", nullable = false)
  private double propellantMass;

  @Column(name = "diameter", nullable = false)
  private double diameter;

  @CreatedDate
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @LastModifiedDate
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;
}