package srm_engine;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EnableJpaAuditing
@ComponentScan(basePackages = {"com.srm.engine", "srm_engine"})
@EnableJpaRepositories(basePackages = {"com.srm.engine", "srm_engine"})
@EntityScan(basePackages = {"com.srm.engine", "srm_engine"})
public class EngineApplication {

	public static void main(String[] args) {
		SpringApplication.run(EngineApplication.class, args);
	}

}
