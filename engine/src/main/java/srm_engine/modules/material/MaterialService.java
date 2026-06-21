package srm_engine.modules.material;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import srm_engine.modules.structural_material.StructuralMaterialRepository;
import srm_engine.modules.thermal_material.ThermalMaterialRepository;

import srm_engine.modules.material.interfaces.AnalyzableMaterial;

@Service
public class MaterialService {
  private final ThermalMaterialRepository thermalRepository;
  private final StructuralMaterialRepository structuralRepository;

  public MaterialService(
    ThermalMaterialRepository thermalRepository,
    StructuralMaterialRepository structuralRepository
  ) {
    this.thermalRepository = thermalRepository;
    this.structuralRepository = structuralRepository;
  }

  public List<Material> getAllMaterials() {
    List<Material> materials = new ArrayList<>();

    materials.addAll(thermalRepository.findAll());
    materials.addAll(structuralRepository.findAll());

    return materials;
  }

  public List<String> getMaterialTypes() {
    List<String> types = new ArrayList<>();

    for (Material material : getAllMaterials()) {
      types.add(material.getMaterialType());
    }

    return types;
  }

  public List<String> getAnalysisSummaries() {
    List<AnalyzableMaterial> materials = new ArrayList<>();
    materials.addAll(thermalRepository.findAll());
    materials.addAll(structuralRepository.findAll());

    List<String> summaries = new ArrayList<>();

    for (AnalyzableMaterial material : materials) {
      summaries.add(material.getAnalysisSummary());
    }

    return summaries;
  }
}