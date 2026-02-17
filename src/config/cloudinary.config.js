// src/config/cloudinary.config.js

/**
 * Configuration Cloudinary pour TEKTAL
 * Cloud name: dbqexsya0
 */

export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: 'dbqexsya0',
  UPLOAD_PRESET: 'tektal_paths',
  FOLDER: 'tektal/paths',
  
  // URL de l'API Cloudinary
  UPLOAD_URL: 'https://api.cloudinary.com/v1_1/dbqexsya0/video/upload',
};

// Options d'upload par défaut
export const CLOUDINARY_UPLOAD_OPTIONS = {
  resource_type: 'video',
  folder: CLOUDINARY_CONFIG.FOLDER,
  upload_preset: CLOUDINARY_CONFIG.UPLOAD_PRESET,
  
  // Transformations vidéo (optionnel)
  eager: [
    {
      width: 720,
      height: 1280,
      crop: 'limit',
      quality: 'auto',
      format: 'mp4',
    },
  ],
  
  // Tags pour organisation
  tags: ['path', 'mobile'],
};

export default CLOUDINARY_CONFIG;