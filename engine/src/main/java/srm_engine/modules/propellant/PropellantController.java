package srm_engine.modules.propellant;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/propellants")
@CrossOrigin(origins = "*")
public class PropellantController {
  private final PropellantService service;

  public PropellantController(PropellantService service) {
        this.service = service;
    }

  @GetMapping
  public ResponseEntity<List<Propellant>> getAll() {
    return ResponseEntity.ok(service.getAll());
  }

  @GetMapping("/{id}")
  public ResponseEntity<Propellant> getById(@PathVariable UUID id) {
    return service.getById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<Propellant> create(@RequestBody Propellant propellant) {
    Propellant created = service.create(propellant);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Propellant> update(@PathVariable UUID id, @RequestBody Propellant propellant) {
    Propellant updatedPropellant = service.update(id, propellant);
    return ResponseEntity.ok(updatedPropellant);
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