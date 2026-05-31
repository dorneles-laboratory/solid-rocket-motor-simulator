package srm_engine.modules.setting;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface SettingRepository extends JpaRepository<Setting, UUID> {
    java.util.Optional<Setting> findFirstByOrderByCreatedAtAsc();
}