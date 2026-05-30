package srm_engine.modules.structural_material;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface StructuralMaterialRepository extends JpaRepository<StructuralMaterial, UUID> {
  
}