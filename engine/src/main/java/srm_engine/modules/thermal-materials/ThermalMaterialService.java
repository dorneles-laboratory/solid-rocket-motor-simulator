package srm_engine.modules.thermal_material;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ThermalMaterialService {

  private final ThermalMaterialRepository repository;

  public ThermalMaterialService(ThermalMaterialRepository repository) {
    this.repository = repository;
  }

  public List<ThermalMaterial> getAll() {
    return repository.findAll();
  }

  public ThermalMaterial create(ThermalMaterial material) {
    return repository.save(material);
  }

  public java.util.Optional<ThermalMaterial> getById(UUID id) {
    return repository.findById(id);
  }

  public ThermalMaterial update(UUID id, ThermalMaterial updated) {
    return repository.findById(id).map(existing -> {
      existing.setName(updated.getName());
      existing.setDensity(updated.getDensity());
      existing.setThermalConductivity(updated.getThermalConductivity());
      existing.setSpecificHeat(updated.getSpecificHeat());
      existing.setMaxServiceTemperature(updated.getMaxServiceTemperature());
      existing.setApplication(updated.getApplication());
      return repository.save(existing);
    }).orElseThrow(() -> new RuntimeException("Material térmico não encontrado"));
  }

  public boolean delete(UUID id) {
    if (repository.existsById(id)) {
      repository.deleteById(id);
      return true;
    }
    return false;
  }
}