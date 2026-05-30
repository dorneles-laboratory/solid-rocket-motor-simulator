package srm_engine.modules.thermal_material;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.dao.DataIntegrityViolationException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/thermal-materials")
@CrossOrigin(origins = "*")
public class ThermalMaterialController {
  private final ThermalMaterialService service;

  public ThermalMaterialController(ThermalMaterialService service) {
        this.service = service;
    }

  @GetMapping
  public ResponseEntity<List<ThermalMaterial>> getAll() {
    return ResponseEntity.ok(service.getAll());
  }

  @GetMapping("/{id}")
  public ResponseEntity<ThermalMaterial> getById(@PathVariable UUID id) {
    return service.getById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<Object> create(@RequestBody ThermalMaterial material) {
    try {
      ThermalMaterial created = service.create(material);
      return ResponseEntity.status(HttpStatus.CREATED).body(created);
    } catch (DataIntegrityViolationException e) {
      return ResponseEntity.status(HttpStatus.CONFLICT)
          .body("Já existe um material térmico com este nome.");
    }
  }

  @PutMapping("/{id}")
  public ResponseEntity<ThermalMaterial> update(@PathVariable UUID id, @RequestBody ThermalMaterial material) {
    ThermalMaterial updatedMaterial = service.update(id, material);
    return ResponseEntity.ok(updatedMaterial);
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