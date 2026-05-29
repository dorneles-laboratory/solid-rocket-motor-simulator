package srm_engine.modules.project;

import com.fasterxml.jackson.annotation.JsonValue;

public enum ProjectMotorClass {
    A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, UNCLASSIFIED;

    @JsonValue
    public String getFrontendValue() {
        return this == UNCLASSIFIED ? "-" : this.name();
    }
}