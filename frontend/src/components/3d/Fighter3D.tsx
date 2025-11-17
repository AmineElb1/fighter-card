import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere, Box } from '@react-three/drei';
// import { useBox } from '@react-three/cannon';
import * as THREE from 'three';
import type { Fighter3D as Fighter3DType } from '../../types/game';
import useGameStore from '../../store/gameStore';

interface Fighter3DProps {
  fighter: Fighter3DType;
  isActive: boolean;
}

const Fighter3D: React.FC<Fighter3DProps> = ({ fighter, isActive }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const { hoverFighter } = useGameStore();

  // Physics body for the fighter (commented out for now)
  // const [ref, api] = useBox(() => ({
  //   mass: 1,
  //   position: [fighter.position.x, fighter.position.y + 1, fighter.position.z],
  //   args: [1, 2, 1], // width, height, depth
  // }));

  // Animation loop
  useFrame((state) => {
    if (!meshRef.current) return;

    // Gentle bobbing animation for idle state
    const time = state.clock.getElapsedTime();
    meshRef.current.position.y = fighter.position.y + Math.sin(time * 2) * 0.1;

    // Rotation based on active state
    if (isActive) {
      meshRef.current.rotation.y = time * 0.5;
    }

    // Hover effect
    if (hovered) {
      meshRef.current.scale.setScalar(1.1 + Math.sin(time * 10) * 0.05);
    } else {
      meshRef.current.scale.setScalar(1.0);
    }
  });

  const handlePointerOver = () => {
    setHovered(true);
    hoverFighter(fighter.id);
  };

  const handlePointerOut = () => {
    setHovered(false);
    hoverFighter(null);
  };

  // Color based on element
  const getElementColor = (element: string): string => {
    const colors = {
      fire: '#ff4444',
      water: '#4444ff',
      earth: '#44ff44',
      air: '#ffff44',
      lightning: '#ff44ff',
      shadow: '#444444',
      light: '#ffffff',
      neutral: '#888888'
    };
    return colors[element as keyof typeof colors] || colors.neutral;
  };

  const elementColor = getElementColor(fighter.element);
  const healthPercentage = fighter.health / fighter.maxHealth;

  return (
    <group position={[fighter.position.x, fighter.position.y, fighter.position.z]}>
      {/* Main Fighter Body */}
      <mesh
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        castShadow
        receiveShadow
      >
        {/* Temporary representation - replace with actual 3D model later */}
        <Box args={[2, 4, 1]}>
          <meshStandardMaterial 
            color={elementColor}
            emissive={isActive ? elementColor : '#000000'}
            emissiveIntensity={isActive ? 0.2 : 0}
            roughness={0.7}
            metalness={0.1}
          />
        </Box>
      </mesh>

      {/* Fighter Name */}
      <Text
        position={[0, 5.5, 0]}
        fontSize={0.5}
        color={isActive ? '#ffff00' : '#ffffff'}
        anchorX="center"
        anchorY="middle"
      >
        {fighter.name}
      </Text>

      {/* Health Bar */}
      <group position={[0, 4.8, 0]}>
        {/* Background */}
        <Box args={[3, 0.2, 0.08]} position={[0, 0, 0]}>
          <meshBasicMaterial color="#333333" />
        </Box>
        {/* Health Fill */}
        <Box 
          args={[3 * healthPercentage, 0.2, 0.1]} 
          position={[-1.5 + (1.5 * healthPercentage), 0, 0.01]}
        >
          <meshBasicMaterial 
            color={healthPercentage > 0.5 ? '#44ff44' : healthPercentage > 0.25 ? '#ffaa44' : '#ff4444'} 
          />
        </Box>
      </group>

      {/* Stamina Bar */}
      <group position={[0, 4.5, 0]}>
        {/* Background */}
        <Box args={[3, 0.1, 0.08]} position={[0, 0, 0]}>
          <meshBasicMaterial color="#222222" />
        </Box>
        {/* Stamina Fill */}
        <Box 
          args={[3 * (fighter.currentStamina / fighter.maxStamina), 0.1, 0.1]} 
          position={[-1.5 + (1.5 * (fighter.currentStamina / fighter.maxStamina)), 0, 0.01]}
        >
          <meshBasicMaterial color="#4488ff" />
        </Box>
      </group>

      {/* Element Indicator */}
      <Sphere args={[0.4]} position={[0, 3, 1.2]}>
        <meshStandardMaterial 
          color={elementColor}
          emissive={elementColor}
          emissiveIntensity={0.3}
        />
      </Sphere>

      {/* Status Effects */}
      {fighter.statusEffects.map((effect, index) => (
        <Sphere 
          key={effect.id}
          args={[0.2]} 
          position={[index * 0.5 - 0.5, 5.2, 0]}
        >
          <meshStandardMaterial 
            color={effect.type === 'buff' ? '#44ff44' : effect.type === 'debuff' ? '#ff4444' : '#ffff44'}
            emissive={effect.type === 'buff' ? '#44ff44' : effect.type === 'debuff' ? '#ff4444' : '#ffff44'}
            emissiveIntensity={0.2}
          />
        </Sphere>
      ))}

      {/* Selection Indicator */}
      {hovered && (
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.5, 2.8, 32]} />
          <meshBasicMaterial 
            color="#ffff00" 
            transparent 
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Active Player Indicator */}
      {isActive && (
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3, 3.3, 32]} />
          <meshBasicMaterial 
            color="#00ff00" 
            transparent 
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
};

export default Fighter3D;