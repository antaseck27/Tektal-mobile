// src/services/authService.js
import * as SecureStore from "expo-secure-store";
import { API_URL } from "../config/api";
import * as FileSystem from 'expo-file-system/legacy';

// ========================================
// HELPERS
// ========================================

async function saveTokens({ access, refresh }) {
  if (access) await SecureStore.setItemAsync("access", access);
  if (refresh) await SecureStore.setItemAsync("refresh", refresh);
}

async function getAccessToken() {
  return SecureStore.getItemAsync("access");
}

async function clearTokens() {
  await SecureStore.deleteItemAsync("access");
  await SecureStore.deleteItemAsync("refresh");
}

async function parseJson(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

// ========================================
// UPLOAD CLOUDINARY CORRIGÉ (sans paramètres non autorisés)
// ========================================

export async function uploadToCloudinary(videoUri) {
  console.log('========== DEBUG UPLOAD ==========');
  console.log('1️⃣ Début uploadToCloudinary');
  console.log('📹 URI reçue:', videoUri);
  
  try {
    // 1. Vérifier que le fichier existe
    console.log('2️⃣ Vérification existence fichier...');
    const fileInfo = await FileSystem.getInfoAsync(videoUri);
    console.log('📁 Info fichier:', fileInfo);
    
    if (!fileInfo.exists) {
      console.error('❌ Fichier non trouvé!');
      return { ok: false, error: 'Fichier non trouvé' };
    }
    
    const fileSizeMB = fileInfo.size / (1024 * 1024);
    console.log(`📊 Taille fichier: ${fileSizeMB.toFixed(2)} MB`);

    // 2. Créer FormData
    console.log('3️⃣ Création FormData...');
    const formData = new FormData();
    
    // Déterminer le type MIME
    const fileExtension = videoUri.split('.').pop()?.toLowerCase() || 'mp4';
    const mimeType = fileExtension === 'mov' ? 'video/quicktime' : 'video/mp4';
    console.log('📹 Extension:', fileExtension, 'MIME:', mimeType);
    
    // Ajouter le fichier
    const filename = `path_video_${Date.now()}.${fileExtension}`;
    console.log('📝 Nom fichier:', filename);
    
    const fileToUpload = {
      uri: videoUri,
      type: mimeType,
      name: filename,
    };
    console.log('📎 Fichier à uploader:', fileToUpload);
    
    formData.append('file', fileToUpload);
    
    // ✅ UNIQUEMENT LES PARAMÈTRES AUTORISÉS
    formData.append('upload_preset', 'tektal_paths');
    formData.append('cloud_name', 'dbqexsya0');
    formData.append('filename_override', filename); // Optionnel mais autorisé
    
    // ❌ SUPPRIMER tous ces paramètres non autorisés :
    // formData.append('quality', '60');
    // formData.append('format', 'mp4');
    // formData.append('width', '1280');
    // formData.append('crop', 'limit');
    
    // 3. Envoyer la requête
    console.log('4️⃣ Envoi vers Cloudinary avec paramètres de base...');
    console.log('🌐 URL:', 'https://api.cloudinary.com/v1_1/dbqexsya0/video/upload');
    
    const startTime = Date.now();
    
    const res = await fetch(
      'https://api.cloudinary.com/v1_1/dbqexsya0/video/upload',
      {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    const endTime = Date.now();
    console.log(`⏱️ Temps de réponse: ${(endTime - startTime) / 1000} secondes`);
    console.log('📥 Status HTTP:', res.status);
    
    const data = await parseJson(res);
    console.log('📥 Réponse Cloudinary:', data);
    
    if (!res.ok) {
      console.error('❌ Erreur Cloudinary:', data);
      return { ok: false, error: data.error?.message || `Erreur ${res.status}` };
    }
    
    console.log('✅ Upload réussi! URL:', data.secure_url);
    console.log('========== FIN DEBUG ==========');
    
    return { ok: true, data };
    
  } catch (error) {
    console.error('❌ Exception Cloudinary:', error);
    console.error('📚 Stack:', error.stack);
    console.log('========== FIN DEBUG (ERREUR) ==========');
    
    return { ok: false, error: error.message };
  }
}

// ========================================
// AUTHENTICATION
// ========================================

export async function register({ email, password, full_name }) {
  const res = await fetch(`${API_URL}/api/auth/users/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, full_name }),
  });
  const data = await parseJson(res);
  return { ok: res.ok, status: res.status, data };
}

export async function login({ email, password }) {
  const res = await fetch(`${API_URL}/api/auth/jwt/create/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await parseJson(res);
  if (res.ok) await saveTokens(data);
  return { ok: res.ok, status: res.status, data };
}

export async function refreshToken() {
  const refresh = await SecureStore.getItemAsync("refresh");
  const res = await fetch(`${API_URL}/api/auth/jwt/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  const data = await parseJson(res);
  if (res.ok && data?.access) await saveTokens({ access: data.access });
  return { ok: res.ok, status: res.status, data };
}

export async function getProfile() {
  const access = await getAccessToken();
  const res = await fetch(`${API_URL}/api/auth/users/me/`, {
    headers: { Authorization: `Bearer ${access}` },
  });
  const data = await parseJson(res);
  return { ok: res.ok, status: res.status, data };
}

export async function activateAccount({ uid, token }) {
  const res = await fetch(`${API_URL}/api/auth/users/activation/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid, token }),
  });
  const data = await parseJson(res);
  return { ok: res.ok, status: res.status, data };
}

export async function resetPassword(email) {
  const res = await fetch(`${API_URL}/api/auth/users/reset_password/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await parseJson(res);
  return { ok: res.ok, status: res.status, data };
}

export async function confirmReset({ uid, token, new_password, re_new_password }) {
  const res = await fetch(`${API_URL}/api/auth/users/reset_password_confirm/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid, token, new_password, re_new_password }),
  });
  const data = await parseJson(res);
  return { ok: res.ok, status: res.status, data };
}

export async function logout() {
  try {
    const refresh = await SecureStore.getItemAsync("refresh");
    if (refresh) {
      await fetch(`${API_URL}/api/auth/jwt/blacklist/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });
    }
  } catch (e) {
    // ignore
  } finally {
    await clearTokens();
  }
}

// ========================================
// PATHS API
// ========================================

export async function createPath(pathData) {
  try {
    const access = await getAccessToken();
    
    console.log('🔑 Token:', access ? 'OK' : 'MANQUANT');
    console.log('📤 Envoi vers:', `${API_URL}/api/paths/create/`);
    
    const res = await fetch(`${API_URL}/api/paths/create/`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access}`
      },
      body: JSON.stringify(pathData),
    });
    
    const data = await parseJson(res);
    
    console.log('📥 Réponse backend:', res.status);
    
    return { ok: res.ok, status: res.status, data };
  } catch (error) {
    console.error('❌ Erreur réseau:', error);
    return { ok: false, error: error.message };
  }
}

export async function getPaths() {
  try {
    const access = await getAccessToken();
    
    const res = await fetch(`${API_URL}/api/paths/`, {
      headers: { 
        "Authorization": `Bearer ${access}` 
      },
    });
    
    const data = await parseJson(res);
    
    return { ok: res.ok, status: res.status, data };
  } catch (error) {
    console.error('❌ Erreur récupération chemins:', error);
    return { ok: false, error: error.message };
  }
}

export async function getPathById(pathId) {
  try {
    const access = await getAccessToken();
    
    const res = await fetch(`${API_URL}/api/paths/${pathId}/`, {
      headers: { 
        "Authorization": `Bearer ${access}` 
      },
    });
    
    const data = await parseJson(res);
    return { ok: res.ok, status: res.status, data };
  } catch (error) {
    console.error('Erreur récupération chemin:', error);
    return { ok: false, error: error.message };
  }
}

export async function savePathToFavorites(pathId) {
  try {
    const access = await getAccessToken();
    
    const res = await fetch(`${API_URL}/api/paths/${pathId}/favorite/`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access}`
      },
    });
    
    const data = await parseJson(res);
    return { ok: res.ok, status: res.status, data };
  } catch (error) {
    console.error('Erreur sauvegarde favori:', error);
    return { ok: false, error: error.message };
  }
}

export async function removeSavedPath(pathId) {
  try {
    const access = await getAccessToken();
    
    const res = await fetch(`${API_URL}/api/paths/${pathId}/favorite/`, {
      method: "DELETE",
      headers: { 
        "Authorization": `Bearer ${access}`
      },
    });
    
    return { ok: res.ok, status: res.status };
  } catch (error) {
    console.error('Erreur suppression favori:', error);
    return { ok: false, error: error.message };
  }
}

export async function getSavedPaths() {
  try {
    const access = await getAccessToken();
    
    const res = await fetch(`${API_URL}/api/users/me/favorites/`, {
      headers: { 
        "Authorization": `Bearer ${access}` 
      },
    });
    
    const data = await parseJson(res);
    return { ok: res.ok, status: res.status, data };
  } catch (error) {
    console.error('Erreur récupération favoris:', error);
    return { ok: false, error: error.message };
  }
}