package srm_engine.modules.propellant;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "propellants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Propellant {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(nullable = false, unique = true)
  private String name;
  
  @Column(nullable = false)
  private double density;
  
  @Column(nullable = false)
  private double burnRateA;
  
  @Column(nullable = false)
  private double burnRateN;

  @Column(nullable = false)
  private double theoreticalIsp;

  @Column(nullable = false)
  private String type;
}