package srm_engine.modules.propellant;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class PropellantService {

  private final PropellantRepository repository;

  public PropellantService(PropellantRepository repository) {
    this.repository = repository;
  }

  public List<Propellant> getAll() {
    return repository.findAll();
  }

  public Propellant create(Propellant propellant) {
    return repository.save(propellant);
  }

  public java.util.Optional<Propellant> getById(UUID id) {
    return repository.findById(id);
  }

  public java.util.Optional<Propellant> update(UUID id, Propellant updated) {
    return repository.findById(id).map(existing -> {
      existing.setName(updated.getName());
      existing.setDensity(updated.getDensity());
      existing.setBurnRateA(updated.getBurnRateA());
      existing.setBurnRateN(updated.getBurnRateN());
      existing.setTheoreticalIsp(updated.getTheoreticalIsp());
      existing.setType(updated.getType());
      return repository.save(existing);
    }).orElseThrow(() -> new RuntimeException("Propelente não encontrado"));
  }

  public boolean delete(UUID id) {
    if (repository.existsById(id)) {
      repository.deleteById(id);
      return true;
    }
    return false;
  }
}