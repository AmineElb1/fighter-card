import React, { useEffect, useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Box, useFBX, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import useGameStore from "../../store/gameStore";
import type { Fighter3D as Fighter3DType } from "../../types/game";

interface Props {
  fighter: Fighter3DType;
  isActive: boolean;
  basePath: string;     // "/models/fighters/ortiz/ortiz" (path + name prefix)
  scale?: number;
}

// find actual mesh inside FBX skeleton container
function getRealMesh(obj: THREE.Object3D): THREE.Object3D {
  let mesh = obj;
  obj.traverse((child) => {
    if (child instanceof THREE.SkinnedMesh || child instanceof THREE.Mesh) {
      mesh = child;
    }
  });
  return mesh;
}

const FighterFBXAnimated: React.FC<Props> = ({
  fighter,
  isActive,
  basePath,
  scale = 0.04,
}) => {
  const groupRef = useRef<THREE.Group>(null!);
  const [yOffset, setYOffset] = useState(0);
  const [currentAnim, setCurrentAnim] = useState("idle");

  const { testAnimationState, hoverFighter, fighterAnimations, gameState } = useGameStore();
  
  // Get the latest fighter data from the store
  const currentFighter = gameState?.players.find(p => p.fighter.id === fighter.id)?.fighter || fighter;

  /** ----------------------------------------------------------
   * 1. LOAD BASE MODEL (One time, never swapped)
   * ---------------------------------------------------------- */
  const base = useFBX(`${basePath}_base.fbx`);
  
  // Debug: Check if Steve's base loaded
  useEffect(() => {
    if (fighter.id === 'fighter4') {
      console.log('🔧 Steve base object:', base ? 'LOADED' : 'NOT LOADED');
      if (base) {
        console.log('🔧 Steve base type:', base.type);
        console.log('🔧 Steve base children:', base.children.length);
      }
    }
  }, [base, fighter.id]);

  /** ----------------------------------------------------------
   * 2. LOAD ALL ANIMATION CLIPS
   * ---------------------------------------------------------- */

  const idleFBX    = useFBX(`${basePath}_idle.fbx`);
  const punchFBX   = useFBX(`${basePath}_punch.fbx`);
  const kickFBX    = useFBX(`${basePath}_kick.fbx`);
  const blockFBX   = useFBX(`${basePath}_block.fbx`);
  const victoryFBX = useFBX(`${basePath}_victory.fbx`);
  const defeatFBX  = useFBX(`${basePath}_defeat.fbx`);

  // Create properly named clips object
  const animations = useMemo(() => {
    const clips: Record<string, THREE.AnimationClip> = {};
    
    if (idleFBX.animations[0]) {
      clips.idle = idleFBX.animations[0].clone();
      clips.idle.name = "idle";
    }
    if (punchFBX.animations[0]) {
      clips.punch = punchFBX.animations[0].clone();
      clips.punch.name = "punch";
    }
    if (kickFBX.animations[0]) {
      clips.kick = kickFBX.animations[0].clone();
      clips.kick.name = "kick";
    }
    if (blockFBX.animations[0]) {
      clips.block = blockFBX.animations[0].clone();
      clips.block.name = "block";
    }
    if (victoryFBX.animations[0]) {
      clips.victory = victoryFBX.animations[0].clone();
      clips.victory.name = "victory";
    }
    if (defeatFBX.animations[0]) {
      clips.defeat = defeatFBX.animations[0].clone();
      clips.defeat.name = "defeat";
    }
    
    return Object.values(clips);
  }, [idleFBX, punchFBX, kickFBX, blockFBX, victoryFBX, defeatFBX]);

  /** ----------------------------------------------------------
   * 3. useAnimations with properly named clips
   * ---------------------------------------------------------- */
  const { actions } = useAnimations(animations, groupRef);

  // Debug: Log available animations once
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      console.log(`Available animations for ${fighter.name}:`, Object.keys(actions));
    }
  }, [actions, fighter.name]);


  /** ----------------------------------------------------------
   * 4. Decide which anim to play
   * 
   * Priority order:
   * 1. Combat action animations (from fighterAnimations store)
   * 2. Test animations (from animation test menu)
   * 3. Health-based animations (defeat when health <= 0)
   * 4. Default idle animation
   * ---------------------------------------------------------- */
  useEffect(() => {
    // Check for combat-triggered animations first
    const combatAnimation = fighterAnimations[fighter.id];
    if (combatAnimation && combatAnimation !== 'idle') {
      setCurrentAnim(combatAnimation);
      return;
    }

    // Then check for test animations (for debugging)
    if (testAnimationState !== "idle") {
      setCurrentAnim(testAnimationState);
      return;
    }

    // Check health status
    if (currentFighter.health <= 0) {
      setCurrentAnim("defeat");
      return;
    }

    // Default to idle
    setCurrentAnim("idle");
  }, [currentFighter.health, fighter.id, testAnimationState, fighterAnimations, currentFighter]);


  /** ----------------------------------------------------------
   * 5. Play animation (clean fade with loop)
   * ---------------------------------------------------------- */
  useEffect(() => {
    if (!actions || !actions[currentAnim]) {
      console.warn(`Animation "${currentAnim}" not found for fighter ${fighter.id}`);
      return;
    }

    // Stop all other animations
    Object.values(actions).forEach((action) => {
      if (action && action !== actions[currentAnim]) {
        action.stop();
      }
    });

    // Play the current animation with loop
    const action = actions[currentAnim];
    if (action) {
      action.reset()
        .setLoop(THREE.LoopRepeat, Infinity)  // Loop forever
        .fadeIn(0.25)
        .play();
      
      console.log(`Playing animation: ${currentAnim} for fighter ${fighter.id}`);
    }

  }, [currentAnim, actions, fighter.id]);


  /** ----------------------------------------------------------
   * 7. Height Fix (only once, based on BASE mesh)
   * ---------------------------------------------------------- */
  useEffect(() => {
    if (!base) {
      if (fighter.id === 'fighter4') {
        console.log('⚠️ Steve base model not loaded yet');
      }
      return;
    }

    if (fighter.id === 'fighter4') {
      console.log('✅ Steve base model loaded successfully');
    }

    base.scale.set(scale, scale, scale);

    // Much brighter material - lighter base color and better light response
    base.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const mat = new THREE.MeshStandardMaterial({
          color: "#ffffff",        // Bright white base color instead of dark brown
          roughness: 0.4,          // Smoother surface = more light reflection
          metalness: 0.05,         // Slight metallic sheen
          emissive: "#444444",     // Self-illumination for brightness
          emissiveIntensity: 0.3,  // Adds extra brightness
        });
        const oldMaterial = child.material as THREE.MeshStandardMaterial;
        if (oldMaterial?.map) {
          mat.map = oldMaterial.map;
          mat.needsUpdate = true;
        }
        child.material = mat;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    const mesh = getRealMesh(base);
    const box = new THREE.Box3().setFromObject(mesh);
    const minY = box.min.y;
    
    // Debug for Steve
    if (fighter.id === 'fighter4') {
      console.log('🔧 Steve bounding box:', {
        min: box.min,
        max: box.max,
        minY: minY,
        calculatedOffset: -minY
      });
    }
    
    // Always use minY to ensure feet are on the ground (Y=0)
    const offset = -minY;
    setYOffset(offset);

  }, [base, scale, fighter.name, fighter.id]);



  /** ----------------------------------------------------------
   * 8. Face opponent and idle wiggle
   * ---------------------------------------------------------- */
  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Determine base rotation to face opponent
    // Fighter on left (x < 0) faces right (+90°)
    // Fighter on right (x > 0) faces left (-90°)
    const baseRotation = fighter.position.x < 0 ? Math.PI / 2 : -Math.PI / 2;
    
    // Add subtle wiggle for active fighter
    if (isActive) {
      groupRef.current.rotation.y = baseRotation + Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1;
    } else {
      groupRef.current.rotation.y = baseRotation;
    }
  });


  const healthPercentage = currentFighter.health / currentFighter.maxHealth;


  /** ----------------------------------------------------------
   * 7. RENDER
   * ---------------------------------------------------------- */
  
  // Safety check
  if (!base) return null;

  // Position adjustment per fighter - alle fighters op -0.4
  let groundOffset = -0.4; // Ninja
  if (fighter.id === 'fighter2') {
    groundOffset = -0.4; // Ortiz
  } else if (fighter.id === 'fighter3') {
    groundOffset = -0.4; // Boss
  } else if (fighter.id === 'fighter4') {
    groundOffset = -0.4; // Steve
  }

  return (
    <group position={[fighter.position.x, fighter.position.y + groundOffset, fighter.position.z]}>
      
      {/* FIGHTER LIGHTING - follows the fighter */}
      {/* Front key light */}
      <spotLight
        position={[0, 8, 8]}
        angle={0.6}
        penumbra={0.5}
        intensity={1.2}
        color="#ffffff"
        castShadow
        target-position={[0, 4, 0]}
      />
      
      {/* Back rim light - creates outline */}
      <pointLight
        position={[0, 6, -4]}
        intensity={0.8}
        distance={12}
        color="#ffaa66"
      />
      
      {/* Side fill lights - reduces harsh shadows */}
      <pointLight
        position={[-4, 5, 0]}
        intensity={0.5}
        distance={10}
        color="#add8e6"
      />
      <pointLight
        position={[4, 5, 0]}
        intensity={0.5}
        distance={10}
        color="#add8e6"
      />
      
      {/* Active fighter glow */}
      {isActive && (
        <pointLight
          position={[0, 1, 0]}
          intensity={0.8}
          distance={8}
          color="#00ff88"
        />
      )}
      
      {/* BASE MODEL */}
      <group
        ref={groupRef}
        position={[0, (fighter.id === 'fighter3' || fighter.id === 'fighter4') ? 0 : yOffset, 0]}
        onPointerOver={() => hoverFighter(fighter.id)}
        onPointerOut={() => hoverFighter(null)}
      >
        <primitive object={base} />
      </group>

      {/* NAME */}
      <Text
        position={[0, (fighter.id === 'fighter3' || fighter.id === 'fighter4') ? 9.0 : yOffset + 9.0, 0]}
        fontSize={0.5}
        color="#000"
        outlineWidth={0.02}
        outlineColor="#fff"
        anchorX="center"
        anchorY="middle"
      >
        {currentFighter.name}
      </Text>

      {/* HEALTH BAR */}
      <group position={[0, (fighter.id === 'fighter3' || fighter.id === 'fighter4') ? 8.5 : yOffset + 8.5, 0]}>
        <Box args={[3, 0.2, 0.08]}>
          <meshBasicMaterial color="#333" />
        </Box>
        <Box
          args={[3 * healthPercentage, 0.2, 0.1]}
          position={[-1.5 + 1.5 * healthPercentage, 0, 0.01]}
        >
          <meshBasicMaterial
            color={
              healthPercentage > 0.5
                ? "#44ff44"
                : healthPercentage > 0.25
                ? "#ffaa44"
                : "#ff4444"
            }
          />
        </Box>
      </group>
      
      {/* HEALTH TEXT */}
      <Text
        position={[0, (fighter.id === 'fighter3' || fighter.id === 'fighter4') ? 8.2 : yOffset + 8.2, 0]}
        fontSize={0.3}
        color="#fff"
        outlineWidth={0.02}
        outlineColor="#000"
        anchorX="center"
        anchorY="middle"
      >
        {`${Math.round(currentFighter.health)}/${currentFighter.maxHealth}`}
      </Text>
    </group>
  );
};

export default FighterFBXAnimated;
