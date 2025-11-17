import React, { Suspense } from 'react';
import { useGLTF } from '@react-three/drei';
import { usePlane } from '@react-three/cannon';
import * as THREE from 'three';
import type { CombatArena3D } from '../../types/game';

interface CombatArenaProps {
  arena: CombatArena3D;
}

// Boxing Ring Model Component
const BoxingRingModel: React.FC = () => {
  const { scene } = useGLTF('/models/boxing_ring.glb');
  
  return (
    <primitive 
      object={scene.clone()} 
      position={[0, 0, 0]} 
      rotation={[0, 0, 0]} 
      scale={[2, 2, 2]} 
    />
  );
};

const CombatArena: React.FC<CombatArenaProps> = ({ arena }) => {
  // Ground physics
  const [groundRef] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.1, 0],
    material: { friction: 0.4, restitution: 0.3 }
  }));

  return (
    <group>
      {/* 3D Boxing Ring Model */}
      <Suspense fallback={null}>
        <BoxingRingModel />
      </Suspense>

      {/* Invisible Ground Plane for Physics */}
      <mesh ref={groundRef} receiveShadow position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <planeGeometry args={[arena.terrain.scale.x, arena.terrain.scale.z]} />
        <meshStandardMaterial 
          color="#4a5d23"
          roughness={0.8}
          metalness={0.1}
          transparent
          opacity={0}
        />
      </mesh>

      {/* Arena Center Marker (optional, remove if boxing ring model has one) */}
      <mesh position={[0, 0.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 1, 32]} />
        <meshBasicMaterial 
          color="#ffffff"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

export default CombatArena;