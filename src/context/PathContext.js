// src/context/PathContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as VideoThumbnails from 'expo-video-thumbnails'; // ✅ AJOUT

const PathContext = createContext();

export const PathProvider = ({ children }) => {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPaths();
  }, []);

  const loadPaths = async () => {
    try {
      const storedPaths = await AsyncStorage.getItem('paths');
      if (storedPaths) {
        setPaths(JSON.parse(storedPaths));
      }
      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement chemins:', error);
      setLoading(false);
    }
  };

  const savePaths = async (newPaths) => {
    try {
      await AsyncStorage.setItem('paths', JSON.stringify(newPaths));
    } catch (error) {
      console.error('Erreur sauvegarde chemins:', error);
    }
  };

  // ✅ Fonction pour générer une miniature
  const generateThumbnail = async (videoUri) => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
        time: 1000, // Prendre la frame à 1 seconde
      });
      return uri;
    } catch (error) {
      console.error('Erreur génération miniature:', error);
      return videoUri; // Retourner la vidéo si échec
    }
  };

  // ✅ Ajouter un chemin avec miniature
  const addPath = async (pathData) => {
    try {
      const thumbnail = await generateThumbnail(pathData.videoUri);

      const newPath = {
        id: Date.now().toString(),
        ...pathData,
        thumbnail, // ✅ Ajouter la miniature
        createdAt: new Date().toISOString(),
      };

      const updatedPaths = [newPath, ...paths];
      setPaths(updatedPaths);
      await savePaths(updatedPaths);

      return { success: true, path: newPath };
    } catch (error) {
      console.error('Erreur ajout chemin:', error);
      return { success: false, error: error.message };
    }
  };

  const deletePath = async (pathId) => {
    try {
      const updatedPaths = paths.filter(p => p.id !== pathId);
      setPaths(updatedPaths);
      await savePaths(updatedPaths);
      return { success: true };
    } catch (error) {
      console.error('Erreur suppression chemin:', error);
      return { success: false, error: error.message };
    }
  };

  const toggleFavorite = async (pathId) => {
    try {
      const updatedPaths = paths.map(path =>
        path.id === pathId
          ? { ...path, isFavorite: !path.isFavorite }
          : path
      );
      setPaths(updatedPaths);
      await savePaths(updatedPaths);
      return { success: true };
    } catch (error) {
      console.error('Erreur toggle favori:', error);
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
