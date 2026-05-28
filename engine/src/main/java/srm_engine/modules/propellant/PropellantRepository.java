package srm_engine.modules.propellant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PropellantRepository extends JpaRepository<Propellant, UUID> {
  
}