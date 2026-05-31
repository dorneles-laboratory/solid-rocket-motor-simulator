package srm_engine.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.ArrayList;

import srm_engine.modules.setting.Setting;
import srm_engine.modules.setting.SettingRepository;
import srm_engine.modules.setting.UnitPreferences;

// Propellants
import srm_engine.modules.propellant.PropellantRepository;
import srm_engine.modules.propellant.Propellant;

// Structural Materials
import srm_engine.modules.structural_material.StructuralMaterialRepository;
import srm_engine.modules.structural_material.StructuralMaterial;

// Thermal Materials
import srm_engine.modules.thermal_material.ThermalMaterialRepository;
import srm_engine.modules.thermal_material.ThermalMaterial;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseSeeder.class);
    
    private final SettingRepository settingRepository;
    private final PropellantRepository propellantRepository;
    private final StructuralMaterialRepository structuralMaterialRepository;
    private final ThermalMaterialRepository thermalMaterialRepository;

    public DatabaseSeeder(
        SettingRepository settingRepository, 
        PropellantRepository propellantRepository,
        StructuralMaterialRepository structuralMaterialRepository,
        ThermalMaterialRepository thermalMaterialRepository
    ) {
        this.settingRepository = settingRepository;
        this.propellantRepository = propellantRepository;
        this.structuralMaterialRepository = structuralMaterialRepository;
        this.thermalMaterialRepository = thermalMaterialRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        logger.info("🌱 Iniciando o Database Seeder...");

        seedSetting();
        seedPropellants();
        seedStructuralMaterials();
        seedThermalMaterials();

        logger.info("✅ Database Seeder finalizado com sucesso!");
    }

    private void seedSetting() {
        if (settingRepository.count() == 0) {
            logger.info("Semeando tabela de Configurações (Setting)...");
            
            Setting defaultSetting = new Setting();
            defaultSetting.setUnitSystem("metric");
            defaultSetting.setAutoSave(false);
            defaultSetting.setPreferences(new UnitPreferences("mm", "MPa", "N", "K"));
            
            settingRepository.save(defaultSetting);
        } else {
            logger.info("Configurações já existem. Pulando...");
        }
    }

    private void seedPropellants() {
        if (propellantRepository.count() == 0) {
            logger.info("Semeando tabela de Propelentes (Propellant)...");
            
            Propellant knsbFine = new Propellant();
            knsbFine.setName("KNSB Fine");
            knsbFine.setDensity(1.841);
            knsbFine.setBurnRateA(8.26);
            knsbFine.setBurnRateN(0.319);
            knsbFine.setTheoreticalIsp(164);
            knsbFine.setType("Sugar");

            propellantRepository.save(knsbFine);

            Propellant kndxCoarse = new Propellant();
            kndxCoarse.setName("KNDX Coarse");
            kndxCoarse.setDensity(1.879);
            kndxCoarse.setBurnRateA(5.13);
            kndxCoarse.setBurnRateN(0.220);
            kndxCoarse.setTheoreticalIsp(177);
            kndxCoarse.setType("Sugar");

            propellantRepository.save(kndxCoarse);

            Propellant knsu = new Propellant();
            knsu.setName("KNSU");
            knsu.setDensity(1.889);
            knsu.setBurnRateA(8.26);
            knsu.setBurnRateN(0.319);
            knsu.setTheoreticalIsp(166);
            knsu.setType("Sugar");

            propellantRepository.save(knsu);

            Propellant kner = new Propellant();
            kner.setName("KNER");
            kner.setDensity(1.820);
            kner.setBurnRateA(7.55);
            kner.setBurnRateN(0.305);
            kner.setTheoreticalIsp(158);
            kner.setType("Sugar");

            propellantRepository.save(kner);

            Propellant apcp701515 = new Propellant();
            apcp701515.setName("APCP 70/15/15");
            apcp701515.setDensity(1.750);
            apcp701515.setBurnRateA(3.84);
            apcp701515.setBurnRateN(0.380);
            apcp701515.setTheoreticalIsp(265);
            apcp701515.setType("Composite");

            propellantRepository.save(apcp701515);

            Propellant apcp801010 = new Propellant();
            apcp801010.setName("APCP 80/10/10");
            apcp801010.setDensity(1.820);
            apcp801010.setBurnRateA(4.21);
            apcp801010.setBurnRateN(0.410);
            apcp801010.setTheoreticalIsp(275);
            apcp801010.setType("Composite");

            propellantRepository.save(apcp801010);

            Propellant apcpBlueThunder = new Propellant();
            apcpBlueThunder.setName("APCP Blue Thunder");
            apcpBlueThunder.setDensity(1.790);
            apcpBlueThunder.setBurnRateA(5.10);
            apcpBlueThunder.setBurnRateN(0.350);
            apcpBlueThunder.setTheoreticalIsp(260);
            apcpBlueThunder.setType("Composite");
            
            propellantRepository.save(apcpBlueThunder);

            Propellant knsbCoarse = new Propellant();
            knsbCoarse.setName("KNSB Coarse");
            knsbCoarse.setDensity(1.750);
            knsbCoarse.setBurnRateA(5.13);
            knsbCoarse.setBurnRateN(0.220);
            knsbCoarse.setTheoreticalIsp(164);
            knsbCoarse.setType("Sugar");

            propellantRepository.save(knsbCoarse);
        }
    }

    private void seedStructuralMaterials() {
        if (structuralMaterialRepository.count() == 0) {
            logger.info("Semeando tabela de Materiais Estruturais (StructuralMaterial)...");

            List<StructuralMaterial> materials = new ArrayList<>();

            StructuralMaterial aluminum6061T6 = new StructuralMaterial();
            aluminum6061T6.setName("Alumínio 6061-T6");
            aluminum6061T6.setYieldStrength(276);
            aluminum6061T6.setUltimateTensileStrength(310);
            aluminum6061T6.setDensity(2.70);
            aluminum6061T6.setElasticModulus(68.9);
            // aluminum6061T6.setType("Metal");
            materials.add(aluminum6061T6);

            StructuralMaterial aluminium7075T6 = new StructuralMaterial();
            aluminium7075T6.setName("Alumínio 7075-T6");
            aluminium7075T6.setYieldStrength(503);
            aluminium7075T6.setUltimateTensileStrength(572);
            aluminium7075T6.setDensity(2.81);
            aluminium7075T6.setElasticModulus(71.7);
            // aluminium7075T6.setType("Metal");
            materials.add(aluminium7075T6);

            StructuralMaterial pvcSchedule40 = new StructuralMaterial();
            pvcSchedule40.setName("PVC Schedule 40");
            pvcSchedule40.setYieldStrength(45);
            pvcSchedule40.setUltimateTensileStrength(52);
            pvcSchedule40.setDensity(1.40);
            pvcSchedule40.setElasticModulus(2.9);
            // pvcSchedule40.setType("Plastic");
            materials.add(pvcSchedule40);

            StructuralMaterial pvcSchedule80 = new StructuralMaterial();
            pvcSchedule80.setName("PVC Schedule 80");
            pvcSchedule80.setYieldStrength(55);
            pvcSchedule80.setUltimateTensileStrength(62);
            pvcSchedule80.setDensity(1.44);
            pvcSchedule80.setElasticModulus(3.1);
            // pvcSchedule80.setType("Plastic");
            materials.add(pvcSchedule80);

            StructuralMaterial fiberglassEpoxy = new StructuralMaterial();
            fiberglassEpoxy.setName("Fiberglass/Epoxy");
            fiberglassEpoxy.setYieldStrength(350);
            fiberglassEpoxy.setUltimateTensileStrength(450);
            fiberglassEpoxy.setDensity(1.85);
            fiberglassEpoxy.setElasticModulus(25.0);
            // fiberglassEpoxy.setType("Composite");
            materials.add(fiberglassEpoxy);

            StructuralMaterial carbonFiberEpoxy = new StructuralMaterial();
            carbonFiberEpoxy.setName("Carbon Fiber/Epoxy");
            carbonFiberEpoxy.setYieldStrength(600);
            carbonFiberEpoxy.setUltimateTensileStrength(800);
            carbonFiberEpoxy.setDensity(1.55);
            carbonFiberEpoxy.setElasticModulus(70.0);
            // carbonFiberEpoxy.setType("Composite");
            materials.add(carbonFiberEpoxy);

            StructuralMaterial steelAISI4130 = new StructuralMaterial();
            steelAISI4130.setName("Steel AISI 4130");
            steelAISI4130.setYieldStrength(435);
            steelAISI4130.setUltimateTensileStrength(670);
            steelAISI4130.setDensity(7.85);
            steelAISI4130.setElasticModulus(205.0);
            // steelAISI4130.setType("Metal");
            materials.add(steelAISI4130);

            StructuralMaterial kraftPhenolic = new StructuralMaterial();
            kraftPhenolic.setName("Kraft Phenolic");
            kraftPhenolic.setYieldStrength(70);
            kraftPhenolic.setUltimateTensileStrength(85);
            kraftPhenolic.setDensity(1.35);
            kraftPhenolic.setElasticModulus(8.0);
            // kraftPhenolic.setType("Composite");
            materials.add(kraftPhenolic);

            structuralMaterialRepository.saveAll(materials);
            logger.info("Catálogo de Materiais Estruturais populado com sucesso!");
        } else {
            logger.info("Materiais Estruturais já existem. Pulando...");
        }
    }

    private void seedThermalMaterials() {
        if (thermalMaterialRepository.count() == 0) {
            logger.info("Semeando tabela de Materiais Térmicos (ThermalMaterial)...");

            List<ThermalMaterial> materials = new ArrayList<>();

            ThermalMaterial graphiteIsomolded = new ThermalMaterial();
            graphiteIsomolded.setName("Graphite (Isomolded)");
            graphiteIsomolded.setThermalConductivity(120);
            graphiteIsomolded.setSpecificHeat(710);
            graphiteIsomolded.setDensity(1.78);
            graphiteIsomolded.setMaxServiceTemperature(3000);
            graphiteIsomolded.setApplication("Nozzle Throat");
            // graphiteIsomolded.setType("Refractory");
            materials.add(graphiteIsomolded);

            ThermalMaterial phenolicResin = new ThermalMaterial();
            phenolicResin.setName("Phenolic Resin (Ablative)");
            phenolicResin.setThermalConductivity(0.35);
            phenolicResin.setSpecificHeat(1200);
            phenolicResin.setDensity(1.30);
            phenolicResin.setMaxServiceTemperature(500);
            phenolicResin.setApplication("Nozzle Liner");
            // phenolicResin.setType("Ablative");
            materials.add(phenolicResin);

            ThermalMaterial epdmRubber = new ThermalMaterial();
            epdmRubber.setName("EPDM Rubber");
            epdmRubber.setThermalConductivity(0.25);
            epdmRubber.setSpecificHeat(2010);
            epdmRubber.setDensity(0.86);
            epdmRubber.setMaxServiceTemperature(150);
            epdmRubber.setApplication("Case Insulation");
            // epdmRubber.setType("Insulator");
            materials.add(epdmRubber);

            ThermalMaterial silicaPhenolic = new ThermalMaterial();
            silicaPhenolic.setName("Silica Phenolic");
            silicaPhenolic.setThermalConductivity(0.45);
            silicaPhenolic.setSpecificHeat(1050);
            silicaPhenolic.setDensity(1.72);
            silicaPhenolic.setMaxServiceTemperature(1650);
            silicaPhenolic.setApplication("Exit Cone");
            // silicaPhenolic.setType("Ablative");
            materials.add(silicaPhenolic);

            ThermalMaterial carbonCarbon = new ThermalMaterial();
            carbonCarbon.setName("Carbon-Carbon Composite");
            carbonCarbon.setThermalConductivity(50);
            carbonCarbon.setSpecificHeat(720);
            carbonCarbon.setDensity(1.75);
            carbonCarbon.setMaxServiceTemperature(2800);
            carbonCarbon.setApplication("High-temp Throat");
            // carbonCarbon.setType("Refractory");
            materials.add(carbonCarbon);

            ThermalMaterial kaowool = new ThermalMaterial();
            kaowool.setName("Ceramic Paper (Kaowool)");
            kaowool.setThermalConductivity(0.08);
            kaowool.setSpecificHeat(1130);
            kaowool.setDensity(0.13);
            kaowool.setMaxServiceTemperature(1260);
            kaowool.setApplication("External Insulation");
            // kaowool.setType("Insulator");
            materials.add(kaowool);

            ThermalMaterial nbrRubber = new ThermalMaterial();
            nbrRubber.setName("NBR Rubber");
            nbrRubber.setThermalConductivity(0.30);
            nbrRubber.setSpecificHeat(1900);
            nbrRubber.setDensity(1.00);
            nbrRubber.setMaxServiceTemperature(120);
            nbrRubber.setApplication("O-rings");
            // nbrRubber.setType("Elastomer");
            materials.add(nbrRubber);

            thermalMaterialRepository.saveAll(materials);
            logger.info("Catálogo de Materiais Térmicos populado com sucesso!");
        } else {
            logger.info("Materiais Térmicos já existem. Pulando...");
        }
    }
}
