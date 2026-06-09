import { useMemo } from 'react';
import * as THREE from 'three';
import { MotorDimensions } from './dash-motor-geometry';

export default function Motor3D({ dimensions }: { dimensions: MotorDimensions }) {
  // 1. CONVERSÃO E PROTEÇÃO (Evita quebrar o 3D se a API mandar 0)
  // Usamos Math.max para garantir um raio mínimo microscópico de 0.1
  const radiusChamber = Math.max(0.1, (dimensions.chamberDiameter || 0) / 2);
  const radiusGrainOuter = Math.max(0.1, (dimensions.grainOuterDiameter || 0) / 2);
  const radiusGrainInner = Math.max(0.05, (dimensions.grainCoreDiameter || 0) / 2);
  const radiusThroat = Math.max(0.1, (dimensions.throatDiameter || 0) / 2);
  
  const chamberLength = dimensions.chamberLength || 0.1;
  const grainLength = dimensions.grainLength || 0.1;

  // 2. GEOMETRIA DINÂMICA DO BOCAL (Usando Trigonometria)
  const nozzlePoints = useMemo(() => {
    // Se o ângulo for 0, assumimos ângulos padrão para não quebrar a conta
    const convAngleRad = (dimensions.convergenceAngle || 30) * (Math.PI / 180);
    const divAngleRad = (dimensions.divergenceAngle || 15) * (Math.PI / 180);

    // L = (R_maior - R_menor) / tan(angulo)
    const convLength = Math.max(5, (radiusChamber - radiusThroat) / Math.tan(convAngleRad));
    
    // Como a interface não tem o diâmetro de saída, inferimos uma proporção padrão
    const radiusExit = radiusThroat * 2.5; 
    const divLength = Math.max(10, (radiusExit - radiusThroat) / Math.tan(divAngleRad));

    return [
      new THREE.Vector2(radiusChamber, 0),                           // Base conectada à câmara
      new THREE.Vector2(radiusThroat, -convLength),                  // Garganta (Descendo no eixo Y negativo)
      new THREE.Vector2(radiusExit, -(convLength + divLength))       // Saída do bocal
    ];
  }, [radiusChamber, radiusThroat, dimensions.convergenceAngle, dimensions.divergenceAngle]);

  // 3. GEOMETRIA DO GRÃO (Formato de "Donut" alongado)
  const grainShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, radiusGrainOuter, 0, Math.PI * 2, false);
    
    // Furo central
    const hole = new THREE.Path();
    hole.absarc(0, 0, radiusGrainInner, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    
    return shape;
  }, [radiusGrainOuter, radiusGrainInner]);

  const GAP = 1;
  const grainMeshes = useMemo(() => {
    const segments = Math.max(1, dimensions.grainSegments || 1);

    const totalLength =
      segments * grainLength +
      (segments - 1) * GAP;

    return Array.from({ length: segments }, (_, index) => ({
      key: index,
      position:
        -totalLength / 2 +
        index * (grainLength + GAP),
    }));
  }, [dimensions.grainSegments, grainLength]);

  return (
    // Grupo principal: Deita o motor inteiro para alinhar com o eixo X da câmera (igual ao 2D)
    <group rotation={[0, 0, -Math.PI / 2]}>
      
      {/* CHAMBER (Carcaça) - Fica no centro (0,0,0) crescendo para ambos os lados */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[radiusChamber, radiusChamber, chamberLength, 32]} />
        <meshPhysicalMaterial 
          color="#3b82f6" 
          metalness={0.8} 
          roughness={0.2} 
          transparent={true} 
          opacity={0.15} // Deixei um pouco mais transparente para o grão destacar mais
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* PROPELLANT GRAIN (Grão) */}
      {/* O Extrude cresce no eixo Z positivo. Rodamos para crescer no Y e centralizamos na carcaça */}
      {grainMeshes.map((grain) => (
        <mesh
          key={grain.key}
          position={[0, grain.position, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <extrudeGeometry
            args={[
              grainShape,
              {
                depth: grainLength,
                curveSegments: 32,
                bevelEnabled: false,
              },
            ]}
          />
          <meshStandardMaterial
            color="#f97316"
            roughness={0.7}
          />
        </mesh>
      ))}

      {grainMeshes.slice(0, -1).map((grain) => {
        const separatorPosition =
          grain.position + grainLength / 2 + GAP / 2;

        return (
          <mesh
            key={`separator-${grain.key}`}
            position={[0, separatorPosition, 0]}
          >
            <ringGeometry
              args={[
                Math.max(radiusGrainOuter - 0.25, radiusGrainInner),
                radiusGrainOuter,
                64,
              ]}
            />
            <meshBasicMaterial
              color="#71717a"
              transparent
              opacity={0.8}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}

      {/* NOZZLE (Bocal) */}
      {/* Encaixado exatamente na borda inferior da carcaça (-chamberLength / 2) */}
      <mesh position={[0, -chamberLength / 2, 0]}>
        <latheGeometry args={[nozzlePoints, 32]} />
        <meshStandardMaterial color="#3f3f46" metalness={0.8} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>

    </group>
  );
}