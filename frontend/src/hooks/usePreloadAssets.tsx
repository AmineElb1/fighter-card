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

  // Preload all FBX files
  ortizAssets.forEach(path => useFBX.preload(path));
  ninjaAssets.forEach(path => useFBX.preload(path));
  
  // Preload GLB files
  arenaAssets.forEach(path => useGLTF.preload(path));

  useEffect(() => {
    let mounted = true;
    let currentLoaded = 0;

    const updateProgress = (stage: string) => {
      if (!mounted) return;
      currentLoaded++;
      const newProgress = Math.floor((currentLoaded / totalAssets) * 100);
      setProgress(newProgress);
      setLoadingStage(stage);
    };

    // Simulate loading stages for user feedback
    const loadAssets = async () => {
      // Stage 1: Ortiz Fighter
      setLoadingStage('Loading Fighter: Ortiz...');
      await new Promise(resolve => setTimeout(resolve, 100));
      ortizAssets.forEach((_, index) => {
        setTimeout(() => updateProgress(`Loading Ortiz animations... (${index + 1}/${ortizAssets.length})`), index * 150);
      });

      // Stage 2: Ninja Fighter
      await new Promise(resolve => setTimeout(resolve, ortizAssets.length * 150));
      setLoadingStage('Loading Fighter: Ninja...');
      ninjaAssets.forEach((_, index) => {
        setTimeout(() => updateProgress(`Loading Ninja animations... (${index + 1}/${ninjaAssets.length})`), (ortizAssets.length + index) * 150);
      });

      // Stage 3: Arena
      await new Promise(resolve => setTimeout(resolve, (ortizAssets.length + ninjaAssets.length) * 150));
      setLoadingStage('Loading Combat Arena...');
      arenaAssets.forEach((_, index) => {
        setTimeout(() => updateProgress('Finalizing arena...'), (ortizAssets.length + ninjaAssets.length + index) * 150);
      });

      // Stage 4: Complete
      await new Promise(resolve => setTimeout(resolve, totalAssets * 150 + 500));
      if (mounted) {
        setProgress(100);
        setLoadingStage('Ready!');
      }
    };

    loadAssets();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    progress,
    isLoaded: progress === 100,
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
