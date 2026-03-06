
// src/context/PathContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getPaths as fetchPathsFromAPI,
  getSavedPaths,
  savePathToFavorites,
  removeSavedPath,
} from '../services/authService';

const PathContext = createContext();

// ✅ Formate une date ISO en "JJ/MM/YYYY à HH:MM"
const formatPublishedAt = (isoDate) => {
  if (!isoDate) return null;
  try {
    const d = new Date(isoDate);
    const date = d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const time = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    return `${date} à ${time}`;
  } catch {
    return null;
  }
};

export const PathProvider = ({ children }) => {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPaths();
  }, []);

  // ✅ Charge les chemins ET les favoris depuis l'API
  const loadPaths = async () => {
    try {
      setLoading(true);

      console.log('📥 Chargement des chemins depuis l\'API...');
      const [pathsResult, favoritesResult] = await Promise.all([
        fetchPathsFromAPI(),
        getSavedPaths(),
      ]);

      // ── Récupérer les IDs favoris depuis le backend ──
      let favoriteIds = new Set();
      if (favoritesResult.ok && favoritesResult.data) {
        const favArr = Array.isArray(favoritesResult.data.results)
          ? favoritesResult.data.results
          : Array.isArray(favoritesResult.data) ? favoritesResult.data : [];

        // SavedPathSerializer retourne { id, user, path, created_at }
        // où "path" est directement l'ID (entier), pas un objet
        favArr.forEach((fav) => {
          // SavedPathSerializer: "path" est l'ID entier directement (pas un objet)
          const pathId = typeof fav.path === 'object' ? fav.path?.id : fav.path;
          if (pathId != null && !isNaN(Number(pathId))) {
            favoriteIds.add(Number(pathId));
          }
        });
        console.log(`❤️ ${favoriteIds.size} favoris chargés depuis l'API`);
      }

      if (pathsResult.ok && pathsResult.data) {
        const pathsArray = Array.isArray(pathsResult.data.results)
          ? pathsResult.data.results
          : Array.isArray(pathsResult.data) ? pathsResult.data : [];

        console.log(`📊 ${pathsArray.length} chemins trouvés`);

        const formattedPaths = await Promise.all(
          pathsArray.map(async (path) => {
            // GPS depuis AsyncStorage
            let coordinates = [];
            try {
              const gpsData = await AsyncStorage.getItem(`path_gps_${path.id}`);
              if (gpsData) coordinates = JSON.parse(gpsData);
            } catch (e) {}

            if (coordinates.length === 0 && path.start_lat && path.start_lng) {
              coordinates = [
                { latitude: parseFloat(path.start_lat), longitude: parseFloat(path.start_lng) },
                { latitude: parseFloat(path.end_lat), longitude: parseFloat(path.end_lng) },
              ];
            }

            // Miniature Cloudinary
            let thumbnail = '';
            if (path.video_url) {
              thumbnail = path.video_url
                .replace('/upload/', '/upload/so_0,w_400,h_300,c_fill/')
                .replace(/\.(mov|mp4|MOV|MP4)$/, '.jpg');
            }

            return {
              id: path.id,
              share_token: path.share_token || null,
              title: path.title || 'Sans titre',
              departure: path.start_label || 'Départ',
              destination: path.end_label || 'Arrivée',
              thumbnail,
              videoUri: path.video_url || '',
              duration: path.duration ? `${path.duration} sec` : '0 sec',
              steps: path.steps || [],
              creator: path.user?.full_name || path.user?.email || 'Utilisateur',
              campus: 'Bakeli Dakar',
              isOfficial: path.is_official || false,
              // ✅ isFavorite vient du backend
              isFavorite: favoriteIds.has(Number(path.id)),
              views: 0,
              likes: 0,
              createdAt: path.created_at,
              publishedAt: formatPublishedAt(path.created_at),
              coordinates,
              startLocation: coordinates.length > 0 ? coordinates[0] : null,
              endLocation: coordinates.length > 0 ? coordinates[coordinates.length - 1] : null,
            };
          })
        );

        console.log(`✅ ${formattedPaths.length} chemins formatés`);
        setPaths(formattedPaths);
        await AsyncStorage.setItem('paths_cache', JSON.stringify(formattedPaths));
      } else {
        setPaths([]);
      }
    } catch (error) {
      console.error('❌ Erreur chargement:', error);
      // Fallback cache
      try {
        const cached = await AsyncStorage.getItem('paths_cache');
        if (cached) setPaths(JSON.parse(cached));
        else setPaths([]);
      } catch (e) {
        setPaths([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle favori — appelle l'API puis met à jour le state local
  const toggleFavorite = async (pathId) => {
    try {
      const path = paths.find((p) => p.id === pathId);
      if (!path) return { success: false };

      const isCurrentlyFavorite = path.isFavorite;

      // Mise à jour optimiste immédiate
      const updatedPaths = paths.map((p) =>
        p.id === pathId ? { ...p, isFavorite: !isCurrentlyFavorite } : p
      );
      setPaths(updatedPaths);

      // Appel API
      let result;
      if (isCurrentlyFavorite) {
        result = await removeSavedPath(pathId);
        console.log('💔 Favori supprimé via API:', result);
      } else {
        result = await savePathToFavorites(pathId);
        console.log('❤️ Favori ajouté via API:', result);
      }

      if (!result.ok && result.status !== 204) {
        // Rollback si erreur API
        console.warn('⚠️ Erreur API favori, rollback');
        setPaths(paths);
        return { success: false };
      }

      // Mettre à jour le cache
      await AsyncStorage.setItem('paths_cache', JSON.stringify(updatedPaths));
      return { success: true };
    } catch (error) {
      console.error('❌ Erreur toggleFavorite:', error);
      setPaths(paths); // rollback
      return { success: false, error: error.message };
    }
  };

  const deletePath = async (pathId) => {
    try {
      await AsyncStorage.removeItem(`path_gps_${pathId}`);
      const updatedPaths = paths.filter((p) => p.id !== pathId);
      setPaths(updatedPaths);
      await AsyncStorage.setItem('paths_cache', JSON.stringify(updatedPaths));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const addPath = async () => {
    console.warn('⚠️ addPath() est déprécié.');
    return { success: false };
  };

  return (
    <PathContext.Provider value={{ paths, loading, addPath, deletePath, toggleFavorite, refreshPaths: loadPaths }}>
      {children}
    </PathContext.Provider>
  );
};

export const usePaths = () => {
  const context = useContext(PathContext);
  if (!context) throw new Error('usePaths doit être utilisé dans PathProvider');
  return context;
};


// // src/context/PathContext.js
// import React, { createContext, useState, useContext, useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {
//   getPaths as fetchPathsFromAPI,
//   getSavedPaths,
//   savePathToFavorites,
//   removeSavedPath,
// } from '../services/authService';

// const PathContext = createContext();

// export const PathProvider = ({ children }) => {
//   const [paths, setPaths] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadPaths();
//   }, []);

//   // ✅ Charge les chemins ET les favoris depuis l'API
//   const loadPaths = async () => {
//     try {
//       setLoading(true);

//       console.log('📥 Chargement des chemins depuis l\'API...');
//       const [pathsResult, favoritesResult] = await Promise.all([
//         fetchPathsFromAPI(),
//         getSavedPaths(),
//       ]);

//       // ── Récupérer les IDs favoris depuis le backend ──
//       let favoriteIds = new Set();
//       if (favoritesResult.ok && favoritesResult.data) {
//         const favArr = Array.isArray(favoritesResult.data.results)
//           ? favoritesResult.data.results
//           : Array.isArray(favoritesResult.data) ? favoritesResult.data : [];

//         // SavedPathSerializer retourne { id, user, path, created_at }
//         // où "path" est directement l'ID (entier), pas un objet
//         favArr.forEach((fav) => {
//           // SavedPathSerializer: "path" est l'ID entier directement (pas un objet)
//           const pathId = typeof fav.path === 'object' ? fav.path?.id : fav.path;
//           if (pathId != null && !isNaN(Number(pathId))) {
//             favoriteIds.add(Number(pathId));
//           }
//         });
//         console.log(`❤️ ${favoriteIds.size} favoris chargés depuis l'API`);
//       }

//       if (pathsResult.ok && pathsResult.data) {
//         const pathsArray = Array.isArray(pathsResult.data.results)
//           ? pathsResult.data.results
//           : Array.isArray(pathsResult.data) ? pathsResult.data : [];

//         console.log(`📊 ${pathsArray.length} chemins trouvés`);

//         const formattedPaths = await Promise.all(
//           pathsArray.map(async (path) => {
//             // GPS depuis AsyncStorage
//             let coordinates = [];
//             try {
//               const gpsData = await AsyncStorage.getItem(`path_gps_${path.id}`);
//               if (gpsData) coordinates = JSON.parse(gpsData);
//             } catch (e) {}

//             if (coordinates.length === 0 && path.start_lat && path.start_lng) {
//               coordinates = [
//                 { latitude: parseFloat(path.start_lat), longitude: parseFloat(path.start_lng) },
//                 { latitude: parseFloat(path.end_lat), longitude: parseFloat(path.end_lng) },
//               ];
//             }

//             // Miniature Cloudinary
//             let thumbnail = '';
//             if (path.video_url) {
//               thumbnail = path.video_url
//                 .replace('/upload/', '/upload/so_0,w_400,h_300,c_fill/')
//                 .replace(/\.(mov|mp4|MOV|MP4)$/, '.jpg');
//             }

//             return {
//               id: path.id,
//               share_token: path.share_token || null,
//               title: path.title || 'Sans titre',
//               departure: path.start_label || 'Départ',
//               destination: path.end_label || 'Arrivée',
//               thumbnail,
//               videoUri: path.video_url || '',
//               duration: path.duration ? `${path.duration} sec` : '0 sec',
//               steps: path.steps || [],
//               creator: path.user?.full_name || path.user?.email || 'Utilisateur',
//               campus: 'Bakeli Dakar',
//               isOfficial: path.is_official || false,
//               // ✅ isFavorite vient du backend
//               isFavorite: favoriteIds.has(Number(path.id)),
//               views: 0,
//               likes: 0,
//               createdAt: path.created_at,
//               coordinates,
//               startLocation: coordinates.length > 0 ? coordinates[0] : null,
//               endLocation: coordinates.length > 0 ? coordinates[coordinates.length - 1] : null,
//             };
//           })
//         );

//         console.log(`✅ ${formattedPaths.length} chemins formatés`);
//         setPaths(formattedPaths);
//         await AsyncStorage.setItem('paths_cache', JSON.stringify(formattedPaths));
//       } else {
//         setPaths([]);
//       }
//     } catch (error) {
//       console.error('❌ Erreur chargement:', error);
//       // Fallback cache
//       try {
//         const cached = await AsyncStorage.getItem('paths_cache');
//         if (cached) setPaths(JSON.parse(cached));
//         else setPaths([]);
//       } catch (e) {
//         setPaths([]);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Toggle favori — appelle l'API puis met à jour le state local
//   const toggleFavorite = async (pathId) => {
//     try {
//       const path = paths.find((p) => p.id === pathId);
//       if (!path) return { success: false };

//       const isCurrentlyFavorite = path.isFavorite;

//       // Mise à jour optimiste immédiate
//       const updatedPaths = paths.map((p) =>
//         p.id === pathId ? { ...p, isFavorite: !isCurrentlyFavorite } : p
//       );
//       setPaths(updatedPaths);

//       // Appel API
//       let result;
//       if (isCurrentlyFavorite) {
//         result = await removeSavedPath(pathId);
//         console.log('💔 Favori supprimé via API:', result);
//       } else {
//         result = await savePathToFavorites(pathId);
//         console.log('❤️ Favori ajouté via API:', result);
//       }

//       if (!result.ok && result.status !== 204) {
//         // Rollback si erreur API
//         console.warn('⚠️ Erreur API favori, rollback');
//         setPaths(paths);
//         return { success: false };
//       }

//       // Mettre à jour le cache
//       await AsyncStorage.setItem('paths_cache', JSON.stringify(updatedPaths));
//       return { success: true };
//     } catch (error) {
//       console.error('❌ Erreur toggleFavorite:', error);
//       setPaths(paths); // rollback
//       return { success: false, error: error.message };
//     }
//   };

//   const deletePath = async (pathId) => {
//     try {
//       await AsyncStorage.removeItem(`path_gps_${pathId}`);
//       const updatedPaths = paths.filter((p) => p.id !== pathId);
//       setPaths(updatedPaths);
//       await AsyncStorage.setItem('paths_cache', JSON.stringify(updatedPaths));
//       return { success: true };
//     } catch (error) {
//       return { success: false, error: error.message };
//     }
//   };

//   const addPath = async () => {
//     console.warn('⚠️ addPath() est déprécié.');
//     return { success: false };
//   };

//   return (
//     <PathContext.Provider value={{ paths, loading, addPath, deletePath, toggleFavorite, refreshPaths: loadPaths }}>
//       {children}
//     </PathContext.Provider>
//   );
// };

// export const usePaths = () => {
//   const context = useContext(PathContext);
//   if (!context) throw new Error('usePaths doit être utilisé dans PathProvider');
//   return context;
// };


