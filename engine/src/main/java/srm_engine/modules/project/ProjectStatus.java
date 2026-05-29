package srm_engine.modules.project;

import com.fasterxml.jackson.annotation.JsonValue;

public enum ProjectStatus {
    IN_PROGRESS("in-progress"),
    OPTIMIZED("optimized"),
    TESTED("tested"),
    DRAFT("draft");

    private final String frontendValue;

    ProjectStatus(String frontendValue) {
        this.frontendValue = frontendValue;
    }

    @JsonValue
    public String getFrontendValue() {
        return frontendValue;
    }
}