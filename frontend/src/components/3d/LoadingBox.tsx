import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface LoadingBoxProps {
  message?: string;
}

/**
 * LoadingBox - 3D Loading indicator for use inside Canvas
 * This replaces HTML-based LoadingFallback for Suspense fallbacks
 */
const LoadingBox: React.FC<LoadingBoxProps> = ({ message = "Loading..." }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);

  // Rotating animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.5;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.7;
    }
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={[0, 2, 0]}>
      {/* Rotating cube */}
      <mesh ref={meshRef}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color="#4CAF50" 
          wireframe 
          emissive="#4CAF50"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Loading text */}
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {message}
      </Text>

      {/* Light for visibility */}
      <pointLight position={[0, 0, 0]} intensity={1} color="#4CAF50" />
    </group>
  );
};

export default LoadingBox;
