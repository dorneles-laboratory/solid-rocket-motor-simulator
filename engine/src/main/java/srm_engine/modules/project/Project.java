package srm_engine.modules.project;

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
  @Column(name = "motor_class", nullable = false)
  private ProjectMotorClass motorClass = ProjectMotorClass.UNCLASSIFIED;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private ProjectStatus status = ProjectStatus.DRAFT;

  @CreatedDate
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @LastModifiedDate
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;
}