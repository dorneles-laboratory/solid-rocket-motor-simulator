package srm_engine.modules.project;

import org.springframework.stereotype.Service;
import srm_engine.exception.project.ProjectNotFoundException;
import srm_engine.exception.project.InvalidProjectConfigurationException;

import java.util.List;
import java.util.UUID;
import java.util.Optional;
import java.time.LocalDateTime;

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
    validateProject(project);
    return repository.save(project);
  }

  public Project getById(UUID id) throws ProjectNotFoundException {
    return repository.findById(id)
        .orElseThrow(() -> new ProjectNotFoundException("Projeto com ID " + id + " não encontrado."));
  }

  public Project openProject(UUID id) throws ProjectNotFoundException {
    Project project = getById(id);
    project.setLastOpenedAt(LocalDateTime.now());
    return repository.save(project);
  }

  public Project update(UUID id, Project updated) throws ProjectNotFoundException {
    validateProject(updated);
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
      existing.setImpulseClass(updated.getImpulseClass());
      existing.setStatus(updated.getStatus());
      existing.setMotorChamberDiameter(updated.getMotorChamberDiameter());
      existing.setMotorChamberLength(updated.getMotorChamberLength());
      existing.setCoreType(updated.getCoreType());
      existing.setStarPoints(updated.getStarPoints());
      existing.setGrainOuterDiameter(updated.getGrainOuterDiameter());
      existing.setGrainInnerDiameter(updated.getGrainInnerDiameter());
      existing.setGrainSegmentsLength(updated.getGrainSegmentsLength());
      existing.setGrainSegments(updated.getGrainSegments());
      existing.setNozzleThroatDiameter(updated.getNozzleThroatDiameter());
      existing.setNozzleConvergenceAngle(updated.getNozzleConvergenceAngle());
      existing.setNozzleDivergenceAngle(updated.getNozzleDivergenceAngle());
      return repository.save(existing);
    }).orElseThrow(() -> new ProjectNotFoundException("Falha ao atualizar. Projeto com ID " + id + " não encontrado."));
  }

  public void delete(UUID id) throws ProjectNotFoundException {
    if (!repository.existsById(id)) {
      throw new ProjectNotFoundException("Falha ao deletar. Projeto com ID " + id + " não encontrado.");
    }
    repository.deleteById(id);
  }

  public List<Project> getRecentProjects() {
    return repository.findTop3ByOrderByLastOpenedAtDesc();
  }

  /* private */
  private void validateProject(Project project) {
    if (project.getGrainInnerDiameter() != null && project.getGrainOuterDiameter() != null) {
        if (project.getGrainInnerDiameter() >= project.getGrainOuterDiameter()) {
            throw new InvalidProjectConfigurationException("Erro: O diâmetro interno do grão não pode ser maior ou igual ao diâmetro externo.");
        }
    }
    
    if (project.getMaxDiameter() != null && project.getMaxDiameter() <= 0) {
        throw new InvalidProjectConfigurationException("Erro: O diâmetro máximo do projeto deve ser um valor positivo.");
    }
  }
}