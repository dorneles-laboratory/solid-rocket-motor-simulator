package srm_engine.modules.commercial_motors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.dao.DataIntegrityViolationException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/commercial-motors")
@CrossOrigin(origins = "*")
public class CommercialMotorController {
  private final CommercialMotorService service;

  public CommercialMotorController(CommercialMotorService service) {
        this.service = service;
    }

  @GetMapping
  public ResponseEntity<List<CommercialMotor>> getAll() {
    return ResponseEntity.ok(service.getAll());
  }

  @GetMapping("/{id}")
  public ResponseEntity<CommercialMotor> getById(@PathVariable UUID id) {
    return service.getById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<Object> create(@RequestBody CommercialMotor commercialMotor) {
    try {
      CommercialMotor created = service.create(commercialMotor);
      return ResponseEntity.status(HttpStatus.CREATED).body(created);
    } catch (DataIntegrityViolationException e) {
      return ResponseEntity.status(HttpStatus.CONFLICT)
          .body("Já existe um motor comercial com este nome.");
    }
  }

  @PutMapping("/{id}")
  public ResponseEntity<CommercialMotor> update(@PathVariable UUID id, @RequestBody CommercialMotor commercialMotor) {
    CommercialMotor updatedCommercialMotor = service.update(id, commercialMotor);
    return ResponseEntity.ok(updatedCommercialMotor);
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