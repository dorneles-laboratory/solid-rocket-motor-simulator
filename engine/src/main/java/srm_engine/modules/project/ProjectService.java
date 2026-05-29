package srm_engine.modules.project;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ProjectService {

  private final ProjectRepository repository;

  public ProjectService(ProjectRepository repository) {
    this.repository = repository;
  }

  public List<Project> getAll() {
    return repository.findAll();
  }

  public Project create(Project project) {
    return repository.save(project);
  }

  public java.util.Optional<Project> getById(UUID id) {
    return repository.findById(id);
  }

  public Project update(UUID id, Project updated) {
    return repository.findById(id).map(existing -> {
      existing.setName(updated.getName());
      existing.setAuthor(updated.getAuthor());
      existing.setMissionObjective(updated.getMissionObjective());
      existing.setMaxDiameter(updated.getMaxDiameter());
      existing.setMaxLength(updated.getMaxLength());
      existing.setPropellantId(updated.getPropellantId());
      existing.setTargetImpulse(updated.getTargetImpulse());
      existing.setTargetBurnTime(updated.getTargetBurnTime());
      existing.setMaxThrust(updated.getMaxThrust());
      return repository.save(existing);
    }).orElseThrow(() -> new RuntimeException("Project não encontrado"));
  }

  public boolean delete(UUID id) {
    if (repository.existsById(id)) {
      repository.deleteById(id);
      return true;
    }
    return false;
  }
}