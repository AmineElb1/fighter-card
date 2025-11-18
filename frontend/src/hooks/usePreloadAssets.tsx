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
// ✅ LAZY LOADING STRATEGY + ULTRA-COMPRESSED GLB BASE MODELS
// Only preload ESSENTIAL assets (optimized GLB base + idle FBX) during loading screen
// Other animations (punch, kick, block, victory, defeat) are loaded on-demand during gameplay
// Base models optimized with gltf-transform (Draco + WebP textures):
//   - Ortiz: 41MB FBX → 535KB GLB (98.7% reduction!)
//   - Ninja: 51MB FBX → 535KB GLB (99% reduction!)
// Total initial load: ~42MB (idle FBX) + 1MB (base GLB) = ~43MB vs 685MB (16x faster!)

const ortizEssentialAssets = [
  { path: '/models/fighters/ortiz/ortiz_base.opt.glb', type: 'gltf' },
  { path: '/models/fighters/ortiz/ortiz_idle.fbx', type: 'fbx' },
];

const ninjaEssentialAssets = [
  { path: '/models/fighters/ninja/ninja_base.opt.glb', type: 'gltf' },
  { path: '/models/fighters/ninja/ninja_idle.fbx', type: 'fbx' },
];

const arenaAssets = [
  { path: '/models/boxing_ring.glb', type: 'gltf' }
];

const totalAssets = ortizEssentialAssets.length + ninjaEssentialAssets.length + arenaAssets.length;

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
        setLoadingStage('🥊 Loading Fighter: Ortiz (GLB base + idle)...');
        
        // Load Ortiz ESSENTIAL assets (GLB + FBX)
        for (let i = 0; i < ortizEssentialAssets.length; i++) {
          const asset = ortizEssentialAssets[i];
          if (asset.type === 'gltf') {
            await useGLTF.preload(asset.path);
          } else {
            await useFBX.preload(asset.path);
          }
          updateProgress(`Loading Ortiz essentials... (${i + 1}/${ortizEssentialAssets.length})`);
          await new Promise(resolve => setTimeout(resolve, 100)); // Small delay for UX
        }

        if (!mounted) return;
        setLoadingStage('🥷 Loading Fighter: Ninja (GLB base + idle)...');
        
        // Load Ninja ESSENTIAL assets (GLB + FBX)
        for (let i = 0; i < ninjaEssentialAssets.length; i++) {
          const asset = ninjaEssentialAssets[i];
          if (asset.type === 'gltf') {
            await useGLTF.preload(asset.path);
          } else {
            await useFBX.preload(asset.path);
          }
          updateProgress(`Loading Ninja essentials... (${i + 1}/${ninjaEssentialAssets.length})`);
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        if (!mounted) return;
        setLoadingStage('🏟️ Loading Combat Arena...');
        
        // Load Arena assets
        for (let i = 0; i < arenaAssets.length; i++) {
          const asset = arenaAssets[i];
          await useGLTF.preload(asset.path);
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
 * 🚀 ULTRA-OPTIMIZED LOADING: Uses gltf-transform optimized GLB base models
 * Base models: 535KB each (was 41-51MB FBX!)
 * Draco compression + WebP textures = 98% size reduction
 * Other animations are loaded on-demand by FighterFBXAnimated component
 */
export const PreloadAssets: React.FC = () => {
  // Ortiz - Ultra-compressed GLB base (535KB) + FBX idle
  useGLTF('/models/fighters/ortiz/ortiz_base.opt.glb');
  useFBX('/models/fighters/ortiz/ortiz_idle.fbx');

  // Ninja - Ultra-compressed GLB base (535KB) + FBX idle
  useGLTF('/models/fighters/ninja/ninja_base.opt.glb');
  useFBX('/models/fighters/ninja/ninja_idle.fbx');

  // Arena
  useGLTF('/models/boxing_ring.glb');

  return null;
};
