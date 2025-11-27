
/// <reference types="@react-three/fiber" />
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Line, Text, Float } from '@react-three/drei';
import { useBuildStore } from '../../store/buildStore';
import * as THREE from 'three';

const NeonComponent = ({ position, size, color, name, isPresent, labelOffset = [0,0,0] }: any) => {
  const mesh = useRef<THREE.Mesh>(null);

  // Animation logic
  useFrame((state) => {
    if (mesh.current) {
        const mat = mesh.current.material as THREE.MeshStandardMaterial;
        // Pulse effect if present
        if (isPresent && mat) {
             mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0.8, 0.1);
             mat.emissiveIntensity = 1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.5;
        } else if (mat) {
             mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0.1, 0.1);
             mat.emissiveIntensity = 0.2;
        }
    }
  });

  return (
    <group position={position}>
      <RoundedBox ref={mesh} args={size} radius={0.05} smoothness={4}>
        <meshStandardMaterial 
            color={isPresent ? color : '#333'} 
            emissive={isPresent ? color : '#000'}
            transparent 
            opacity={0.1}
            roughness={0.2}
            metalness={0.8}
            wireframe={!isPresent}
        />
      </RoundedBox>
      {isPresent && (
          <Float speed={2} rotationIntensity={0} floatIntensity={0.2}>
            <Text
                position={[0, size[1]/2 + 0.2, 0]}
                fontSize={0.15}
                color="white"
                anchorX="center"
                anchorY="middle"
                font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
            >
                {name}
            </Text>
          </Float>
      )}
    </group>
  );
};

export const PCModel: React.FC = () => {
  const { parts, ui } = useBuildStore();
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      // Gentle rotation for the showcase feel
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group ref={group}>
      {/* CASE FRAME (Abstract) */}
      <group>
        {/* Main Chassis Box Outline */}
        <Line points={[[-2, -2.5, -1], [2, -2.5, -1], [2, 2.5, -1], [-2, 2.5, -1], [-2, -2.5, -1]]} color="#333" lineWidth={2} />
        <Line points={[[-2, -2.5, 1], [2, -2.5, 1], [2, 2.5, 1], [-2, 2.5, 1], [-2, -2.5, 1]]} color="#333" lineWidth={2} />
        {/* Connecting Lines */}
        <Line points={[[-2, -2.5, -1], [-2, -2.5, 1]]} color="#333" lineWidth={2} />
        <Line points={[[2, -2.5, -1], [2, -2.5, 1]]} color="#333" lineWidth={2} />
        <Line points={[[2, 2.5, -1], [2, 2.5, 1]]} color="#333" lineWidth={2} />
        <Line points={[[-2, 2.5, -1], [-2, 2.5, 1]]} color="#333" lineWidth={2} />
        
        {/* Glass Panel Hint */}
        <RoundedBox args={[4.1, 5.1, 0.1]} position={[0, 0, 1.05]} radius={0.1}>
            <meshPhysicalMaterial 
                transmission={0.6} 
                roughness={0} 
                thickness={0.5} 
                color="#111" 
                envMapIntensity={2}
            />
        </RoundedBox>
      </group>

      {/* MOTHERBOARD (The Base) */}
      <NeonComponent 
        position={[0, 0, -0.5]} 
        size={[3.5, 4.5, 0.1]} 
        color="#333" 
        name="Motherboard" 
        isPresent={!!parts.motherboard}
      />

      {/* CPU (Center) */}
      <NeonComponent 
        position={[0, 0.8, -0.4]} 
        size={[0.8, 0.8, 0.1]} 
        color="#00f3ff" 
        name={parts.cpu?.name || "CPU Socket"}
        isPresent={!!parts.cpu}
      />

      {/* GPU (Bottom Horizontal) - Renders First GPU only for now in 3D */}
      <NeonComponent 
        position={[0, -1.2, 0]} 
        size={[3.2, 0.5, 1.2]} 
        color="#00f3ff" 
        name={parts.gpus[0]?.name || "PCIe Slot 1"}
        isPresent={parts.gpus.length > 0}
      />

      {/* RAM (Right of CPU) */}
      <group position={[0.8, 0.8, -0.3]}>
        <NeonComponent 
            position={[0, 0, 0]} 
            size={[0.1, 1.2, 0.1]} 
            color="#b026ff" 
            name={parts.ram?.name || "DIMM"}
            isPresent={!!parts.ram}
        />
        {parts.ram && parts.ram.modules > 2 && (
             <NeonComponent 
                position={[0.2, 0, 0]} 
                size={[0.1, 1.2, 0.1]} 
                color="#b026ff" 
                name=""
                isPresent={true}
            />
        )}
      </group>

      {/* PSU (Bottom Block) */}
      <NeonComponent 
        position={[0, -2, -0.5]} 
        size={[2, 0.8, 0.8]} 
        color="#ffb700" 
        name={parts.psu?.name || "PSU Bay"}
        isPresent={!!parts.psu}
      />

    </group>
  );
};
