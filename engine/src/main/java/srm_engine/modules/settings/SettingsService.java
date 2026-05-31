package srm_engine.modules.settings;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import srm_engine.modules.settings.SettingsRequestDTO;

@Service
public class SettingsService {

    private final SettingsRepository repository;

    public SettingsService(SettingsRepository repository) {
        this.repository = repository;
    }

    public Settings getFirst() {
        return repository.findFirstByOrderByCreatedAtAsc()
                .orElseGet(this::createDefault);
    }

    @Transactional
    public Settings saveOrUpdate(SettingsRequestDTO dto) {
        Settings settings = repository.findFirstByOrderByCreatedAtAsc()
                .orElse(new Settings());
        settings.setUnitSystem(dto.getUnitSystem());
        settings.setAutoSave(dto.isAutoSave());
        if (settings.getPreferences() == null) {
            settings.setPreferences(new UnitPreferences());
        }
        settings.getPreferences().setLength(dto.getPreferences().getLength());
        settings.getPreferences().setPressure(dto.getPreferences().getPressure());
        settings.getPreferences().setForce(dto.getPreferences().getForce());
        settings.getPreferences().setTemperature(dto.getPreferences().getTemperature());
        return repository.save(settings);
    }

    private Settings createDefault() {
        Settings defaultSettings = new Settings();
        defaultSettings.setUnitSystem("metric");
        defaultSettings.setAutoSave(false);
        defaultSettings.setPreferences(new UnitPreferences("mm", "MPa", "N", "K"));
        
        return repository.save(defaultSettings);
    }
}