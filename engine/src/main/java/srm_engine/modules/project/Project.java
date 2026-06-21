package srm_engine.modules.project;

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
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Project {
  
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(name = "name", nullable = false, unique = true)
  private String name;

  @Column(name = "author", nullable = true)
  private String author;

  @Column(name = "mission_objective", length = 1000)
  private String missionObjective;

  @Column(name = "max_diameter", nullable = false)
  private Double maxDiameter;

  @Column(name = "max_length", nullable = true)
  private Double maxLength;

  @Column(name = "max_thrust", nullable = true)
  private Double maxThrust;

  @Column(name = "propellant_id", nullable = false)
  private UUID propellantId;

  @Column(name = "target_impulse", nullable = true)
  private Double targetImpulse;

  @Column(name = "target_burn_time", nullable = true)
  private Double targetBurnTime;

  @Enumerated(EnumType.STRING)
  @Column(name = "impulse_class", nullable = false)
  private ImpulseClass impulseClass;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private ProjectStatus status = ProjectStatus.DRAFT;

  @Column(name = "motor_chamber_diameter", nullable = true)
  private Double motorChamberDiameter;

  @Column(name = "motor_chamber_length", nullable = true)
  private Double motorChamberLength;

  @Column(name = "grain_core_type", nullable = false, length = 50)
  private String coreType = "bates";

  @Column(name = "star_points", nullable = false, columnDefinition = "integer default 5")
  private Integer starPoints = 5;

  @Column(name = "grain_outer_diameter", nullable = true)
  private Double grainOuterDiameter;

  @Column(name = "grain_inner_diameter", nullable = true)
  private Double grainInnerDiameter;

  @Column(name = "grain_length", nullable = true)
  private Double grainSegmentsLength;

  @Column(name = "grain_segments", nullable = true)
  private Double grainSegments;

  @Column(name = "nozzle_throat_diameter", nullable = true)
  private Double nozzleThroatDiameter;

  @Column(name = "nozzle_exit_diameter", nullable = true)
  private Double nozzleConvergenceAngle;

  @Column(name = "nozzle_divergence_angle", nullable = true)
  private Double nozzleDivergenceAngle;

  @CreatedDate
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @LastModifiedDate
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  @Column(name = "last_opened_at")
  private LocalDateTime lastOpenedAt;
}
