package srm_engine.modules.project;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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
}