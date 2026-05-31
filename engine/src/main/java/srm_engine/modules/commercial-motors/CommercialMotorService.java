package srm_engine.modules.commercial_motors;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CommercialMotorService {

  private final CommercialMotorRepository repository;

  public CommercialMotorService(CommercialMotorRepository repository) {
    this.repository = repository;
  }

  public List<CommercialMotor> getAll() {
    return repository.findAll();
  }

  public CommercialMotor create(CommercialMotor commercialMotor) {
    return repository.save(commercialMotor);
  }

  public java.util.Optional<CommercialMotor> getById(UUID id) {
    return repository.findById(id);
  }

  public CommercialMotor update(UUID id, CommercialMotor updated) {
    return repository.findById(id).map(existing -> {
      existing.setDesignation(updated.getDesignation());
      existing.setImpulseClass(updated.getImpulseClass());
      existing.setTotalImpulse(updated.getTotalImpulse());
      existing.setMaxThrust(updated.getMaxThrust());
      existing.setBurnTime(updated.getBurnTime());
      existing.setPropellantMass(updated.getPropellantMass());
      existing.setDiameter(updated.getDiameter());
      return repository.save(existing);
    }).orElseThrow(() -> new RuntimeException("Motor comercial não encontrado"));
  }

  public boolean delete(UUID id) {
    if (repository.existsById(id)) {
      repository.deleteById(id);
      return true;
    }
    return false;
  }
}