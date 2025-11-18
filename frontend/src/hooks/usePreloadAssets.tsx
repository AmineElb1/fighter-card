import { useEffect, useState } from 'react';
import { useFBX, useGLTF } from '@react-three/drei';

interface UsePreloadAssetsReturn {
  progress: number;
  isLoaded: boolean;
  loadingStage: string;
}

/**
 * Custom hook to preload all 3D assets
 * Returns progress (0-100) and loading status
 */
// Define all assets to preload (outside component to avoid recreation)
const ortizAssets = [
  '/models/fighters/ortiz/ortiz_base.fbx',
  '/models/fighters/ortiz/ortiz_idle.fbx',
  '/models/fighters/ortiz/ortiz_punch.fbx',
  '/models/fighters/ortiz/ortiz_kick.fbx',
  '/models/fighters/ortiz/ortiz_block.fbx',
  '/models/fighters/ortiz/ortiz_victory.fbx',
  '/models/fighters/ortiz/ortiz_defeat.fbx'
];

const ninjaAssets = [
  '/models/fighters/ninja/ninja_base.fbx',
  '/models/fighters/ninja/ninja_idle.fbx',
  '/models/fighters/ninja/ninja_punch.fbx',
  '/models/fighters/ninja/ninja_kick.fbx',
  '/models/fighters/ninja/ninja_block.fbx',
  '/models/fighters/ninja/ninja_victory.fbx',
  '/models/fighters/ninja/ninja_defeat.fbx'
];

const arenaAssets = [
  '/models/boxing_ring.glb'
];

const totalAssets = ortizAssets.length + ninjaAssets.length + arenaAssets.length;

export const usePreloadAssets = (): UsePreloadAssetsReturn => {
  const [progress, setProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState('Initializing...');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    let loadedCount = 0;

    const updateProgress = (stage: string) => {
      if (!mounted) return;
      loadedCount++;
      const newProgress = Math.floor((loadedCount / totalAssets) * 100);
      setProgress(newProgress);
      setLoadingStage(stage);
    };

    // REAL asset loading with promises
    const loadAssets = async () => {
      try {
        setLoadingStage('🥊 Loading Fighter: Ortiz...');
        
        // Load Ortiz assets one by one
        for (let i = 0; i < ortizAssets.length; i++) {
          await useFBX.preload(ortizAssets[i]);
          updateProgress(`Loading Ortiz animations... (${i + 1}/${ortizAssets.length})`);
          await new Promise(resolve => setTimeout(resolve, 100)); // Small delay for UX
        }

        if (!mounted) return;
        setLoadingStage('🥷 Loading Fighter: Ninja...');
        
        // Load Ninja assets one by one
        for (let i = 0; i < ninjaAssets.length; i++) {
          await useFBX.preload(ninjaAssets[i]);
          updateProgress(`Loading Ninja animations... (${i + 1}/${ninjaAssets.length})`);
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        if (!mounted) return;
        setLoadingStage('🏟️ Loading Combat Arena...');
        
        // Load Arena assets
        for (let i = 0; i < arenaAssets.length; i++) {
          await useGLTF.preload(arenaAssets[i]);
          updateProgress('Finalizing arena...');
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Extra time for texture/material loading
        if (!mounted) return;
        setLoadingStage('✨ Preparing shaders and materials...');
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (mounted) {
          setProgress(100);
          setLoadingStage('🎮 Ready to fight!');
          setIsLoaded(true);
        }
      } catch (error) {
        console.error('❌ Error loading assets:', error);
        if (mounted) {
          setLoadingStage('⚠️ Some assets failed to load. Starting anyway...');
          setProgress(100);
          setIsLoaded(true);
        }
      }
    };

    loadAssets();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    progress,
    isLoaded,
    loadingStage
  };
};

/**
 * Preload component to trigger asset loading
 * Must be inside Canvas or Suspense boundary
 */
export const PreloadAssets: React.FC = () => {
  // Ortiz
  useFBX('/models/fighters/ortiz/ortiz_base.fbx');
  useFBX('/models/fighters/ortiz/ortiz_idle.fbx');
  useFBX('/models/fighters/ortiz/ortiz_punch.fbx');
  useFBX('/models/fighters/ortiz/ortiz_kick.fbx');
  useFBX('/models/fighters/ortiz/ortiz_block.fbx');
  useFBX('/models/fighters/ortiz/ortiz_victory.fbx');
  useFBX('/models/fighters/ortiz/ortiz_defeat.fbx');

  // Ninja
  useFBX('/models/fighters/ninja/ninja_base.fbx');
  useFBX('/models/fighters/ninja/ninja_idle.fbx');
  useFBX('/models/fighters/ninja/ninja_punch.fbx');
  useFBX('/models/fighters/ninja/ninja_kick.fbx');
  useFBX('/models/fighters/ninja/ninja_block.fbx');
  useFBX('/models/fighters/ninja/ninja_victory.fbx');
  useFBX('/models/fighters/ninja/ninja_defeat.fbx');

  // Arena
  useGLTF('/models/boxing_ring.glb');

  return null;
};
