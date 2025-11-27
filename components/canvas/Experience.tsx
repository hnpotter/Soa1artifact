
/// <reference types="@react-three/fiber" />
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Grid } from '@react-three/drei';
import { PCModel } from './PCModel';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';

export const Experience: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full bg-zinc-950">
      <Canvas shadows camera={{ position: [0, 0, 7], fov: 45 }}>
        <fog attach="fog" args={['#09090b', 5, 20]} />
        
        <Suspense fallback={null}>
            <group position={[0, 0, 0]}>
                <PCModel />
            </group>
            
            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00f3ff" />
            
            {/* Environment */}
            <Environment preset="city" />
            <ContactShadows position={[0, -3, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
            <Grid 
                position={[0, -3.01, 0]} 
                args={[20, 20]} 
                cellColor="#27272a" 
                sectionColor="#00f3ff" 
                sectionThickness={1}
                cellThickness={0.5}
                fadeDistance={15}
            />
        </Suspense>

        <OrbitControls 
            minPolarAngle={Math.PI / 4} 
            maxPolarAngle={Math.PI / 1.5}
            enableZoom={true}
            minDistance={4}
            maxDistance={10}
            enablePan={false}
        />

        {/* Post Processing for the Cyberpunk look */}
        <EffectComposer enableNormalPass={false}>
            <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.4} />
            <Noise opacity={0.05} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
