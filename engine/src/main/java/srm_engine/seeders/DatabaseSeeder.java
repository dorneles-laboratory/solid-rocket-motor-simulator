package srm_engine.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.ArrayList;

// Settings
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

// Commercial Motors
import srm_engine.modules.commercial_motors.CommercialMotorRepository;
import srm_engine.modules.commercial_motors.CommercialMotor;
import srm_engine.shared.enums.ImpulseClass;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseSeeder.class);
    
    private final SettingRepository settingRepository;
    private final PropellantRepository propellantRepository;
    private final StructuralMaterialRepository structuralMaterialRepository;
    private final ThermalMaterialRepository thermalMaterialRepository;
    private final CommercialMotorRepository commercialMotorRepository;

    public DatabaseSeeder(
        SettingRepository settingRepository, 
        PropellantRepository propellantRepository,
        StructuralMaterialRepository structuralMaterialRepository,
        ThermalMaterialRepository thermalMaterialRepository,
        CommercialMotorRepository commercialMotorRepository
    ) {
        this.settingRepository = settingRepository;
        this.propellantRepository = propellantRepository;
        this.structuralMaterialRepository = structuralMaterialRepository;
        this.thermalMaterialRepository = thermalMaterialRepository;
        this.commercialMotorRepository = commercialMotorRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        logger.info("🌱 Iniciando o Database Seeder...");

        seedSetting();
        seedPropellants();
        seedStructuralMaterials();
        seedThermalMaterials();
        seedCommercialMotors();

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

    private void seedCommercialMotors() {
        if (commercialMotorRepository.count() == 0) {
            logger.info("Semeando tabela de Motores Comerciais (CommercialMotor)...");

            List<CommercialMotor> motors = new ArrayList<>();

            CommercialMotor g80t = new CommercialMotor();
            g80t.setManufacturer("Aerotech");
            g80t.setDesignation("G80-T");
            g80t.setImpulseClass(ImpulseClass.G);
            g80t.setTotalImpulse(120);
            g80t.setMaxThrust(108);
            g80t.setBurnTime(1.2);
            g80t.setPropellantMass(62);
            g80t.setDiameter(29);
            motors.add(g80t);

            CommercialMotor h123w = new CommercialMotor();
            h123w.setManufacturer("Aerotech");
            h123w.setDesignation("H123-W");
            h123w.setImpulseClass(ImpulseClass.H);
            h123w.setTotalImpulse(219);
            h123w.setMaxThrust(175);
            h123w.setBurnTime(1.4);
            h123w.setPropellantMass(109);
            h123w.setDiameter(29);
            motors.add(h123w);

            CommercialMotor h143ss = new CommercialMotor();
            h143ss.setManufacturer("Cesaroni");
            h143ss.setDesignation("H143-SS");
            h143ss.setImpulseClass(ImpulseClass.H);
            h143ss.setTotalImpulse(236);
            h143ss.setMaxThrust(187);
            h143ss.setBurnTime(1.5);
            h143ss.setPropellantMass(119);
            h143ss.setDiameter(29);
            motors.add(h143ss);

            CommercialMotor i218rw = new CommercialMotor();
            i218rw.setManufacturer("Cesaroni");
            i218rw.setDesignation("I218-RW");
            i218rw.setImpulseClass(ImpulseClass.I);
            i218rw.setTotalImpulse(420);
            i218rw.setMaxThrust(285);
            i218rw.setBurnTime(1.8);
            i218rw.setPropellantMass(196);
            i218rw.setDiameter(38);
            motors.add(i218rw);

            CommercialMotor i284w = new CommercialMotor();
            i284w.setManufacturer("Aerotech");
            i284w.setDesignation("I284-W");
            i284w.setImpulseClass(ImpulseClass.I);
            i284w.setTotalImpulse(512);
            i284w.setMaxThrust(320);
            i284w.setBurnTime(1.9);
            i284w.setPropellantMass(238);
            i284w.setDiameter(38);
            motors.add(i284w);

            CommercialMotor j350lw = new CommercialMotor();
            j350lw.setManufacturer("Loki Research");
            j350lw.setDesignation("J350-LW");
            j350lw.setImpulseClass(ImpulseClass.J);
            j350lw.setTotalImpulse(780);
            j350lw.setMaxThrust(420);
            j350lw.setBurnTime(2.1);
            j350lw.setPropellantMass(375);
            j350lw.setDiameter(38);
            motors.add(j350lw);

            CommercialMotor j394pp = new CommercialMotor();
            j394pp.setManufacturer("Cesaroni");
            j394pp.setDesignation("J394-PP");
            j394pp.setImpulseClass(ImpulseClass.J);
            j394pp.setTotalImpulse(830);
            j394pp.setMaxThrust(465);
            j394pp.setBurnTime(2.0);
            j394pp.setPropellantMass(392);
            j394pp.setDiameter(54);
            motors.add(j394pp);

            CommercialMotor k550w = new CommercialMotor();
            k550w.setManufacturer("Aerotech");
            k550w.setDesignation("K550-W");
            k550w.setImpulseClass(ImpulseClass.K);
            k550w.setTotalImpulse(1420);
            k550w.setMaxThrust(680);
            k550w.setBurnTime(2.5);
            k550w.setPropellantMass(680);
            k550w.setDiameter(54);
            motors.add(k550w);

            CommercialMotor k660ww = new CommercialMotor();
            k660ww.setManufacturer("Cesaroni");
            k660ww.setDesignation("K660-WW");
            k660ww.setImpulseClass(ImpulseClass.K);
            k660ww.setTotalImpulse(1580);
            k660ww.setMaxThrust(810);
            k660ww.setBurnTime(2.3);
            k660ww.setPropellantMass(745);
            k660ww.setDiameter(54);
            motors.add(k660ww);

            CommercialMotor l850bb = new CommercialMotor();
            l850bb.setManufacturer("Animal Motor Works");
            l850bb.setDesignation("L850-BB");
            l850bb.setImpulseClass(ImpulseClass.L);
            l850bb.setTotalImpulse(2840);
            l850bb.setMaxThrust(1050);
            l850bb.setBurnTime(3.1);
            l850bb.setPropellantMass(1340);
            l850bb.setDiameter(75);
            motors.add(l850bb);

            CommercialMotor f32t = new CommercialMotor();
            f32t.setManufacturer("Aerotech");
            f32t.setDesignation("F32-T");
            f32t.setImpulseClass(ImpulseClass.F);
            f32t.setTotalImpulse(51);
            f32t.setMaxThrust(42);
            f32t.setBurnTime(1.6);
            f32t.setPropellantMass(26);
            f32t.setDiameter(24);
            motors.add(f32t);

            CommercialMotor e126 = new CommercialMotor();
            e126.setManufacturer("Estes");
            e126.setDesignation("E12-6");
            e126.setImpulseClass(ImpulseClass.E);
            e126.setTotalImpulse(28);
            e126.setMaxThrust(22);
            e126.setBurnTime(2.1);
            e126.setPropellantMass(18);
            e126.setDiameter(24);
            motors.add(e126);

            commercialMotorRepository.saveAll(motors);
            logger.info("Catálogo de Motores Comerciais populado com sucesso!");
        } else {
            logger.info("Motores Comerciais já existem. Pulando...");
        }
    }
}