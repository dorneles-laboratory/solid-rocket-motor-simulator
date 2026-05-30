package srm_engine.modules.structural_material;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class StructuralMaterialService {

  private final StructuralMaterialRepository repository;

  public StructuralMaterialService(StructuralMaterialRepository repository) {
    this.repository = repository;
  }

  public List<StructuralMaterial> getAll() {
    return repository.findAll();
  }

  public StructuralMaterial create(StructuralMaterial material) {
    return repository.save(material);
  }

  public java.util.Optional<StructuralMaterial> getById(UUID id) {
    return repository.findById(id);
  }

  public StructuralMaterial update(UUID id, StructuralMaterial updated) {
    return repository.findById(id).map(existing -> {
      existing.setName(updated.getName());
      existing.setDensity(updated.getDensity());
      existing.setYieldStrength(updated.getYieldStrength());
      existing.setUltimateTensileStrength(updated.getUltimateTensileStrength());
      existing.setElasticModulus(updated.getElasticModulus());
      return repository.save(existing);
    }).orElseThrow(() -> new RuntimeException("Material estrutural não encontrado"));
  }

  public boolean delete(UUID id) {
    if (repository.existsById(id)) {
      repository.deleteById(id);
      return true;
    }
    return false;
  }
}