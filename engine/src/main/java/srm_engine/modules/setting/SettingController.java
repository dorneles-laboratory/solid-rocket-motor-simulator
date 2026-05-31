package srm_engine.modules.setting;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "*")
public class SettingController {

    private final SettingService service;

    public SettingController(SettingService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Setting> getFirst () {
        return ResponseEntity.ok(service.getFirst());
    }

    @PostMapping
    public ResponseEntity<Setting> saveOrUpdateSetting(@RequestBody SettingRequestDTO requestDTO) {
        Setting updatedSetting = service.saveOrUpdate(requestDTO);
        return ResponseEntity.ok(updatedSetting);
    }
}