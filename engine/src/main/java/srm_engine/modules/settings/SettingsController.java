package srm_engine.modules.settings;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "*")
public class SettingsController {

    private final SettingsService service;

    public SettingsController(SettingsService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Settings> getFirst () {
        return ResponseEntity.ok(service.getFirst());
    }

    @PostMapping
    public ResponseEntity<Settings> saveOrUpdateSettings(@RequestBody SettingsRequestDTO requestDTO) {
        Settings updatedSettings = service.saveOrUpdate(requestDTO);
        return ResponseEntity.ok(updatedSettings);
    }
}