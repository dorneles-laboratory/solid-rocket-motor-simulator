package srm_engine.modules.structural_material;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.dao.DataIntegrityViolationException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/structural-materials")
@CrossOrigin(origins = "*")
public class StructuralMaterialController {
  private final StructuralMaterialService service;

  public StructuralMaterialController(StructuralMaterialService service) {
        this.service = service;
    }

  @GetMapping
  public ResponseEntity<List<StructuralMaterial>> getAll() {
    return ResponseEntity.ok(service.getAll());
  }

  @GetMapping("/{id}")
  public ResponseEntity<StructuralMaterial> getById(@PathVariable UUID id) {
    return service.getById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<Object> create(@RequestBody StructuralMaterial material) {
    try {
      StructuralMaterial created = service.create(material);
      return ResponseEntity.status(HttpStatus.CREATED).body(created);
    } catch (DataIntegrityViolationException e) {
      return ResponseEntity.status(HttpStatus.CONFLICT)
          .body("Já existe um material estrutural com este nome.");
    }
  }

  @PutMapping("/{id}")
  public ResponseEntity<StructuralMaterial> update(@PathVariable UUID id, @RequestBody StructuralMaterial material) {
    StructuralMaterial updatedMaterial = service.update(id, material);
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