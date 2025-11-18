import { useGLTF } from '@react-three/drei';
import { useEffect } from 'react';

/**
 * Test component to inspect GLB file structure and animations
 * Usage: Add to Canvas to see console output
 */
export const GLBAnimationTest = () => {
  // Load the GLB files
  const ortiz = useGLTF('/models/fighters/ortiz/ortiz_base.glb');
  const ninja = useGLTF('/models/fighters/ninja/ninja_base.glb');

  useEffect(() => {
    console.log('🥊 ORTIZ GLB Structure:');
    console.log('- Scene:', ortiz.scene);
    console.log('- Animations:', ortiz.animations);
    console.log('- Animation count:', ortiz.animations?.length || 0);
    
    if (ortiz.animations && ortiz.animations.length > 0) {
      console.log('🎬 Ortiz Animation Names:');
      ortiz.animations.forEach((anim, idx) => {
        console.log(`  ${idx + 1}. ${anim.name} (${anim.duration.toFixed(2)}s, ${anim.tracks.length} tracks)`);
      });
    }

    console.log('\n🥷 NINJA GLB Structure:');
    console.log('- Scene:', ninja.scene);
    console.log('- Animations:', ninja.animations);
    console.log('- Animation count:', ninja.animations?.length || 0);
    
    if (ninja.animations && ninja.animations.length > 0) {
      console.log('🎬 Ninja Animation Names:');
      ninja.animations.forEach((anim, idx) => {
        console.log(`  ${idx + 1}. ${anim.name} (${anim.duration.toFixed(2)}s, ${anim.tracks.length} tracks)`);
      });
    }
  }, [ortiz, ninja]);

  return null;
};
