package srm_engine.modules.material.interfaces;

public interface AnalyzableMaterial {
    double getSafetyLimit();
    String getAnalysisSummary();
}