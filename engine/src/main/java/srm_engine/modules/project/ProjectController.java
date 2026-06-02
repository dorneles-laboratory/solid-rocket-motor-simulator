package srm_engine.modules.project;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.dao.DataIntegrityViolationException;

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
  public ResponseEntity<Project> getById(@PathVariable UUID id) {
    return service.getById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<Object> create(@RequestBody Project project) {
    try {
      Project created = service.create(project);
      return ResponseEntity.status(HttpStatus.CREATED).body(created);
    } catch (DataIntegrityViolationException e) {
      e.printStackTrace();

      return ResponseEntity.status(HttpStatus.CONFLICT)
          .body(e.getMostSpecificCause().getMessage());
    }
  }

  @PutMapping("/{id}")
  public ResponseEntity<Project> update(@PathVariable UUID id, @RequestBody Project project) {
    Project updatedProject = service.update(id, project);
    return ResponseEntity.ok(updatedProject);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable UUID id) {
    if (service.delete(id)) {
      return ResponseEntity.noContent().build();
    } else {
      return ResponseEntity.notFound().build();
    }
  }
}