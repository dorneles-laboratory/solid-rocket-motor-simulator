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

  @Column(nullable = false, unique = true)
  private String name;

  @Column(nullable = true)
  private String author;

  @Column(length = 1000)
  private String missionObjective;

  @Column(nullable = false)
  private Double maxDiameter;

  @Column(nullable = true)
  private Double maxLength;

  @Column(nullable = true)
  private Double maxThrust;

  @Column(nullable = false)
  private UUID propellantId;

  @Column(nullable = true)
  private Double targetImpulse;

  @Column(nullable = true)
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