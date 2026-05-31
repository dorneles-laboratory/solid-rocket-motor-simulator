package srm_engine.modules.setting;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import srm_engine.modules.setting.SettingRequestDTO;

@Service
public class SettingService {

    private final SettingRepository repository;

    public SettingService(SettingRepository repository) {
        this.repository = repository;
    }

    public Setting getFirst() {
        return repository.findFirstByOrderByCreatedAtAsc()
                .orElseGet(this::createDefault);
    }

    @Transactional
    public Setting saveOrUpdate(SettingRequestDTO dto) {
        Setting setting = repository.findFirstByOrderByCreatedAtAsc()
                .orElse(new Setting());
        setting.setUnitSystem(dto.getUnitSystem());
        setting.setAutoSave(dto.isAutoSave());
        if (setting.getPreferences() == null) {
            setting.setPreferences(new UnitPreferences());
        }
        setting.getPreferences().setLength(dto.getPreferences().getLength());
        setting.getPreferences().setPressure(dto.getPreferences().getPressure());
        setting.getPreferences().setForce(dto.getPreferences().getForce());
        setting.getPreferences().setTemperature(dto.getPreferences().getTemperature());
        return repository.save(setting);
    }

    private Setting createDefault() {
        Setting defaultSetting = new Setting();
        defaultSetting.setUnitSystem("metric");
        defaultSetting.setAutoSave(false);
        defaultSetting.setPreferences(new UnitPreferences("mm", "MPa", "N", "K"));
        
        return repository.save(defaultSetting);
    }
}