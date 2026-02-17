// src/context/PathContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPaths as fetchPathsFromAPI } from '../services/authService';

const PathContext = createContext();

export const PathProvider = ({ children }) => {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPaths();
  }, []);

  const loadPaths = async () => {
    try {
      setLoading(true);
      
      console.log('📥 Chargement des chemins depuis l\'API...');
      const result = await fetchPathsFromAPI();
      
      console.log('📦 Résultat API complet:', JSON.stringify(result, null, 2));
      console.log('📊 result.ok:', result.ok);
      console.log('📊 result.data type:', typeof result.data);
      
      if (result.ok && result.data) {
        // ✅ L'API Django pagine les résultats dans data.results
        const pathsArray = Array.isArray(result.data.results) 
          ? result.data.results 
          : (Array.isArray(result.data) ? result.data : []);
        
        console.log(`📊 Nombre de chemins: ${pathsArray.length}`);
        
        if (pathsArray.length === 0) {
          console.log('⚠️ Aucun chemin trouvé dans l\'API');
          setPaths([]);
          setLoading(false);
          return;
        }
        
        // ✅ Pour chaque chemin, charger ses coordonnées GPS locales
        const formattedPaths = await Promise.all(
          pathsArray.map(async (path) => {
            console.log('🔄 Formatage du chemin:', path.title);
            
            // ✅ Charger les coordonnées GPS depuis AsyncStorage
            let coordinates = [];
            try {
              const gpsData = await AsyncStorage.getItem(`path_gps_${path.id}`);
              if (gpsData) {
                coordinates = JSON.parse(gpsData);
                console.log(`📍 ${coordinates.length} points GPS chargés pour ${path.title}`);
              }
            } catch (e) {
              console.log('⚠️ Pas de GPS sauvegardé pour ce chemin');
            }
            
            // Si pas de coordonnées GPS, créer au moins départ et arrivée
            if (coordinates.length === 0 && path.start_lat && path.start_lng) {
              coordinates = [
                { 
                  latitude: parseFloat(path.start_lat), 
                  longitude: parseFloat(path.start_lng) 
                },
                { 
                  latitude: parseFloat(path.end_lat), 
                  longitude: parseFloat(path.end_lng) 
                },
              ];
              console.log(`📍 Coordonnées de base créées (départ → arrivée)`);
            }
            
            // ✅ Générer une miniature depuis Cloudinary
            let thumbnail = '';
            if (path.video_url) {
              thumbnail = path.video_url
                .replace('/upload/', '/upload/so_0,w_400,h_300,c_fill/')
                .replace('.mov', '.jpg')
                .replace('.mp4', '.jpg')
                .replace('.MOV', '.jpg')
                .replace('.MP4', '.jpg');
              
              console.log('🖼️ Miniature générée:', thumbnail);
            }
            
            return {
              id: path.id,
              share_token: path.share_token || null, // ✅ AJOUTÉ
              title: path.title || 'Sans titre',
              departure: path.start_label || 'Départ',
              destination: path.end_label || 'Arrivée',
              thumbnail: thumbnail,
              videoUri: path.video_url || '',
              duration: path.duration ? `${path.duration} sec` : '0 sec',
              steps: path.steps || [],
              creator: path.user?.full_name || path.user?.email || 'Utilisateur',
              campus: 'Bakeli Dakar',
              isOfficial: path.is_official || false,
              isFavorite: false,
              views: 0,
              likes: 0,
              createdAt: path.created_at,
              coordinates: coordinates,
              startLocation: coordinates.length > 0 ? coordinates[0] : null,
              endLocation: coordinates.length > 0 ? coordinates[coordinates.length - 1] : null,
            };
          })
        );

        console.log(`✅ ${formattedPaths.length} chemins formatés avec succès`);
        setPaths(formattedPaths);
        
        // Sauvegarder en cache
        await AsyncStorage.setItem('paths_cache', JSON.stringify(formattedPaths));
      } else {
        console.log('⚠️ API ne retourne pas ok ou data est vide');
        setPaths([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('❌ Erreur chargement chemins:', error);
      console.error('❌ Stack:', error.stack);
      
      // Fallback sur le cache si erreur réseau
      try {
        const cached = await AsyncStorage.getItem('paths_cache');
        if (cached) {
          const cachedPaths = JSON.parse(cached);
          setPaths(cachedPaths);
          console.log(`📦 ${cachedPaths.length} chemins chargés depuis le cache`);
        } else {
          console.log('📦 Aucun cache disponible');
          setPaths([]);
        }
      } catch (e) {
        console.error('❌ Erreur lecture cache:', e);
        setPaths([]);
      }
      
      setLoading(false);
    }
  };

  const addPath = async (pathData) => {
    console.warn('⚠️ addPath() est déprécié. Utilisez PathConfirmationScreen');
    return { success: false };
  };

  const deletePath = async (pathId) => {
    try {
      console.log('🗑️ Suppression du chemin:', pathId);
      
      // ✅ Supprimer aussi les coordonnées GPS locales
      await AsyncStorage.removeItem(`path_gps_${pathId}`);
      
      const updatedPaths = paths.filter(p => p.id !== pathId);
      setPaths(updatedPaths);
      await AsyncStorage.setItem('paths_cache', JSON.stringify(updatedPaths));
      
      console.log('✅ Chemin et GPS supprimés');
      return { success: true };
    } catch (error) {
      console.error('❌ Erreur suppression:', error);
      return { success: false, error: error.message };
    }
  };

  const toggleFavorite = async (pathId) => {
    try {
      console.log('❤️ Toggle favori pour:', pathId);
      
      const updatedPaths = paths.map(p =>
        p.id === pathId ? { ...p, isFavorite: !p.isFavorite } : p
      );
      
      setPaths(updatedPaths);
      await AsyncStorage.setItem('paths_cache', JSON.stringify(updatedPaths));
      
      console.log('✅ Favori mis à jour');
      return { success: true };
    } catch (error) {
      console.error('❌ Erreur favori:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    paths,
    loading,
    addPath,
    deletePath,
    toggleFavorite,
    refreshPaths: loadPaths,
  };

  return (
    <PathContext.Provider value={value}>
      {children}
    </PathContext.Provider>
  );
};

export const usePaths = () => {
  const context = useContext(PathContext);
  if (!context) {
    throw new Error('usePaths doit être utilisé dans PathProvider');
  }
  return context;
};