package srm_engine.modules.project;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataIntegrityViolationException;

import srm_engine.exception.project.ProjectNotFoundException;
import srm_engine.exception.project.InvalidProjectConfigurationException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {
  
  private final ProjectService service;

  public ProjectController(ProjectService service) {
    this.service = service;
  }

  @GetMapping
  public ResponseEntity<List<Project>> getAll() {
    return ResponseEntity.ok(service.getAll());
  }

  @GetMapping("/{id}")
  public ResponseEntity<Object> getById(@PathVariable UUID id) {
    try {
      Project project = service.getById(id);
      return ResponseEntity.ok(project);
    } catch (ProjectNotFoundException e) {
      // 404: Projeto não encontrado
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }
  }

  @GetMapping("/{id}/open")
  public ResponseEntity<Object> openProject(@PathVariable UUID id) {
    try {
      Project project = service.openProject(id);
      return ResponseEntity.ok(project);
    } catch (ProjectNotFoundException e) {
      // 404: Projeto não encontrado
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }
  }

  @PostMapping
  public ResponseEntity<Object> create(@RequestBody Project project) {
    try {
      Project created = service.create(project);
      return ResponseEntity.status(HttpStatus.CREATED).body(created);
    } catch (InvalidProjectConfigurationException e) {
      // 400: Erro de validação física do motor
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    } catch (DataIntegrityViolationException e) {
      // 409: Erro do banco (ex: nome duplicado)
      return ResponseEntity.status(HttpStatus.CONFLICT).body("Erro de integridade: " + e.getMostSpecificCause().getMessage());
    }
  }

  @PutMapping("/{id}")
  public ResponseEntity<Object> update(@PathVariable UUID id, @RequestBody Project project) {
    try {
      Project updatedProject = service.update(id, project);
      return ResponseEntity.ok(updatedProject);
    } catch (ProjectNotFoundException e) {
      // 404: Projeto não encontrado
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    } catch (InvalidProjectConfigurationException e) {
      // 400: Erro de validação física do motor
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    } catch (DataIntegrityViolationException e) {
      // 409: Erro do banco
      return ResponseEntity.status(HttpStatus.CONFLICT).body("Erro de integridade: " + e.getMostSpecificCause().getMessage());
    }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Object> delete(@PathVariable UUID id) {
    try {
      service.delete(id);
      return ResponseEntity.noContent().build();
    } catch (ProjectNotFoundException e) {
      // 404: Projeto não encontrado na hora de deletar
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }
  }

  @GetMapping("/recent")
  public ResponseEntity<List<Project>> getRecentProjects() {
      return ResponseEntity.ok(service.getRecentProjects());
  }
}