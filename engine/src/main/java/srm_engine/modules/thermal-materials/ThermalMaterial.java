package srm_engine.modules.thermal_material;

import jakarta.persistence.*;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import srm_engine.modules.material.Material;

import srm_engine.modules.material.interfaces.AnalyzableMaterial;
import srm_engine.modules.material.interfaces.Searchable;

@Entity
@Table(name = "thermal_materials")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ThermalMaterial extends Material implements AnalyzableMaterial, Searchable {

    @Column(name = "thermal_conductivity", nullable = false)
    private double thermalConductivity;

    @Column(name = "specific_heat", nullable = false)
    private double specificHeat;

    @Column(name = "max_service_temperature", nullable = false)
    private double maxServiceTemperature;

    @Column(name = "application")
    private String application;

    /* implementation abstract method */
    @Override
    public String getMaterialType() {
      return "Thermal";
    }

    @Override
    public double getSafetyLimit() {
      return maxServiceTemperature;
    }

    @Override
    public String getAnalysisSummary() {
      return "Max temperature: " + maxServiceTemperature + " °C";
    }

    @Override
    public String getSearchKey() {
      return getName();
    }
}