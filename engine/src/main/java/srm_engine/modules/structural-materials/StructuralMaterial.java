package srm_engine.modules.structural_material;

import jakarta.persistence.*;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import srm_engine.modules.material.Material;

import srm_engine.modules.material.interfaces.AnalyzableMaterial;
import srm_engine.modules.material.interfaces.Searchable;

@Entity
@Table(name = "structural_materials")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StructuralMaterial extends Material implements AnalyzableMaterial, Searchable {

    @Column(name = "yield_strength", nullable = false)
    private double yieldStrength;

    @Column(name = "ultimate_tensile_strength", nullable = false)
    private double ultimateTensileStrength;

    @Column(name = "elastic_modulus", nullable = false)
    private double elasticModulus;

    /* implementation abstract method */
    @Override
    public String getMaterialType() {
      return "Structural";
    }

    @Override
    public double getSafetyLimit() {
      return yieldStrength;
    }

    @Override
    public String getAnalysisSummary() {
      return "Yield strength: " + yieldStrength + " MPa";
    }

    @Override
    public String getSearchKey() {
        return getName();
    }
}