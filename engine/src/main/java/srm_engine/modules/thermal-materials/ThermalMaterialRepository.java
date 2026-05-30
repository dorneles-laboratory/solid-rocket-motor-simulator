package srm_engine.modules.thermal_material;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ThermalMaterialRepository extends JpaRepository<ThermalMaterial, UUID> {
  
}