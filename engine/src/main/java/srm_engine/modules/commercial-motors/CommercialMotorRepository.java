package srm_engine.modules.commercial_motors;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CommercialMotorRepository extends JpaRepository<CommercialMotor, UUID> {
  
}