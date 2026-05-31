package srm_engine.shared.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum ImpulseClass {
    A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, UNCLASSIFIED;

    @JsonValue
    public String getFrontendValue() {
        return this == UNCLASSIFIED ? "-" : this.name();
    }
}