package srm_engine.modules.settings;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface SettingsRepository extends JpaRepository<Settings, UUID> {
    java.util.Optional<Settings> findFirstByOrderByCreatedAtAsc();
}