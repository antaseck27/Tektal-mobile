



// // src/services/authService.js
// import * as SecureStore from "expo-secure-store";
// import { API_URL } from "../config/api";
// import * as FileSystem from "expo-file-system/legacy";

// // ========================================
// // HELPERS
// // ========================================

// async function saveTokens({ access, refresh }) {
//   if (access) await SecureStore.setItemAsync("access", access);
//   if (refresh) await SecureStore.setItemAsync("refresh", refresh);
// }

// export async function getAccessToken() {
//   return SecureStore.getItemAsync("access");
// }

// export async function getRefreshToken() {
//   return SecureStore.getItemAsync("refresh");
// }

// export async function clearTokens() {
//   await SecureStore.deleteItemAsync("access");
//   await SecureStore.deleteItemAsync("refresh");
// }

// async function parseJson(res) {
//   try {
//     return await res.json();
//   } catch {
//     return {};
//   }
// }

// async function parseResponseSafely(res) {
//   const raw = await res.text();
//   if (!raw) return {};
//   try {
//     return JSON.parse(raw);
//   } catch {
//     return { detail: raw };
//   }
// }

// // Requete auth avec retry auto sur 401 (refresh token)
// async function authFetch(url, options = {}, retry = true) {
//   const access = await getAccessToken();

//   const res = await fetch(url, {
//     ...options,
//     headers: {
//       ...(options.headers || {}),
//       ...(access ? { Authorization: `Bearer ${access}` } : {}),
//     },
//   });

//   if (res.status === 401 && retry) {
//     const refreshed = await refreshToken();
//     if (refreshed.ok) {
//       return authFetch(url, options, false);
//     }
//   }

//   return res;
// }

// // ========================================
// // UPLOAD CLOUDINARY
// // ========================================

// export async function uploadToCloudinary(videoUri) {
//   console.log("========== DEBUG UPLOAD ==========");
//   console.log("1️⃣ Début uploadToCloudinary");
//   console.log("📹 URI reçue:", videoUri);

//   try {
//     console.log("2️⃣ Vérification existence fichier...");
//     const fileInfo = await FileSystem.getInfoAsync(videoUri);
//     console.log("📁 Info fichier:", fileInfo);

//     if (!fileInfo.exists) {
//       console.error("❌ Fichier non trouvé!");
//       return { ok: false, error: "Fichier non trouvé" };
//     }

//     const fileSizeMB = fileInfo.size / (1024 * 1024);
//     console.log(`📊 Taille fichier: ${fileSizeMB.toFixed(2)} MB`);

//     console.log("3️⃣ Création FormData...");
//     const formData = new FormData();

//     const fileExtension = videoUri.split(".").pop()?.toLowerCase() || "mp4";
//     const mimeType = fileExtension === "mov" ? "video/quicktime" : "video/mp4";
//     console.log("📹 Extension:", fileExtension, "MIME:", mimeType);

//     const filename = `path_video_${Date.now()}.${fileExtension}`;
//     console.log("📝 Nom fichier:", filename);

//     const fileToUpload = {
//       uri: videoUri,
//       type: mimeType,
//       name: filename,
//     };
//     console.log("📎 Fichier à uploader:", fileToUpload);

//     formData.append("file", fileToUpload);
//     formData.append("upload_preset", "tektal_paths");
//     formData.append("cloud_name", "dbqexsya0");
//     formData.append("filename_override", filename);

//     console.log("4️⃣ Envoi vers Cloudinary...");
//     console.log("🌐 URL:", "https://api.cloudinary.com/v1_1/dbqexsya0/video/upload");

//     const startTime = Date.now();

//     const res = await fetch("https://api.cloudinary.com/v1_1/dbqexsya0/video/upload", {
//       method: "POST",
//       body: formData,
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });

//     const endTime = Date.now();
//     console.log(`⏱️ Temps de réponse: ${(endTime - startTime) / 1000} secondes`);
//     console.log("📥 Status HTTP:", res.status);

//     const data = await parseJson(res);
//     console.log("📥 Réponse Cloudinary:", data);

//     if (!res.ok) {
//       console.error("❌ Erreur Cloudinary:", data);
//       return { ok: false, error: data.error?.message || `Erreur ${res.status}` };
//     }

//     console.log("✅ Upload réussi! URL:", data.secure_url);
//     console.log("========== FIN DEBUG ==========");

//     return { ok: true, data };
//   } catch (error) {
//     console.error("❌ Exception Cloudinary:", error);
//     console.error("📚 Stack:", error.stack);
//     console.log("========== FIN DEBUG (ERREUR) ==========");
//     return { ok: false, error: error.message };
//   }
// }

// // ========================================
// // AUTHENTICATION
// // ========================================

// // ✅ Utilise "name" comme attendu par le backend
// export async function register({ email, password, name }) {
//   const res = await fetch(`${API_URL}/api/auth/users/`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, password, name }),
//   });
//   const data = await parseJson(res);
//   return { ok: res.ok, status: res.status, data };
// }

// export async function login({ email, password }) {
//   const res = await fetch(`${API_URL}/api/auth/jwt/create/`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, password }),
//   });
//   const data = await parseJson(res);
//   if (res.ok) await saveTokens(data);
//   return { ok: res.ok, status: res.status, data };
// }

// export async function refreshToken() {
//   const refresh = await getRefreshToken();
//   const res = await fetch(`${API_URL}/api/auth/jwt/refresh/`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ refresh }),
//   });
//   const data = await parseJson(res);
//   if (res.ok && data?.access) await saveTokens({ access: data.access });
//   return { ok: res.ok, status: res.status, data };
// }

// export async function getProfile() {
//   const res = await authFetch(`${API_URL}/api/auth/users/me/`);
//   const data = await parseJson(res);
//   return { ok: res.ok, status: res.status, data };
// }

// export async function updateProfile(payload) {
//   const res = await authFetch(`${API_URL}/api/auth/users/me/`, {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });
//   const data = await parseJson(res);
//   return { ok: res.ok, status: res.status, data };
// }

// export async function getFavorites() {
//   const res = await authFetch(`${API_URL}/api/users/me/favorites/`);
//   const data = await parseJson(res);
//   return { ok: res.ok, status: res.status, data };
// }

// export async function getMyPaths() {
//   const res = await authFetch(`${API_URL}/api/paths/?mine=true`);
//   const data = await parseJson(res);
//   return { ok: res.ok, status: res.status, data };
// }

// export async function activateAccount({ uid, token }) {
//   const res = await fetch(`${API_URL}/api/auth/users/activation/`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ uid, token }),
//   });
//   const data = await parseJson(res);
//   return { ok: res.ok, status: res.status, data };
// }

// export async function resetPassword(email) {
//   const res = await fetch(`${API_URL}/api/auth/users/reset_password/`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email }),
//   });
//   const data = await parseJson(res);
//   return { ok: res.ok, status: res.status, data };
// }

// export async function confirmReset({ uid, token, new_password, re_new_password }) {
//   const res = await fetch(`${API_URL}/api/auth/users/reset_password_confirm/`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ uid, token, new_password, re_new_password }),
//   });
//   const data = await parseJson(res);
//   return { ok: res.ok, status: res.status, data };
// }

// export async function logout() {
//   try {
//     const refresh = await SecureStore.getItemAsync("refresh");
//     if (refresh) {
//       await fetch(`${API_URL}/api/auth/jwt/blacklist/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ refresh }),
//       });
//     }
//   } catch {
//     // ignore
//   } finally {
//     await clearTokens();
//   }
// }

// // ========================================
// // PATHS API
// // ========================================

// async function postCreate(url, pathData) {
//   console.log("📤 Envoi vers:", url);

//   const res = await authFetch(url, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(pathData),
//   });

//   const data = await parseResponseSafely(res);
//   console.log("📥 Réponse backend:", res.status, data);

//   return { ok: res.ok, status: res.status, data };
// }

// // Fallback: /api/paths/create/ puis /api/paths/ si 405
// export async function createPath(pathData) {
//   try {
//     const first = await postCreate(`${API_URL}/api/paths/create/`, pathData);
//     if (first.status !== 405) return first;
//     return await postCreate(`${API_URL}/api/paths/`, pathData);
//   } catch (error) {
//     console.error("❌ Erreur réseau:", error);
//     return { ok: false, status: 0, data: { detail: error.message } };
//   }
// }

// export async function getPaths() {
//   try {
//     const res = await authFetch(`${API_URL}/api/paths/`);
//     const data = await parseJson(res);
//     return { ok: res.ok, status: res.status, data };
//   } catch (error) {
//     console.error("❌ Erreur récupération chemins:", error);
//     return { ok: false, error: error.message };
//   }
// }

// // ✅ Chemins filtrés par établissement
// export async function getPathsByEstablishment(establishmentId) {
//   try {
//     const res = await authFetch(
//       `${API_URL}/api/paths/?establishment_id=${establishmentId}`
//     );
//     const data = await parseJson(res);
//     return { ok: res.ok, status: res.status, data };
//   } catch (error) {
//     console.error("❌ Erreur récupération chemins établissement:", error);
//     return { ok: false, error: error.message };
//   }
// }

// export async function getPathById(pathId) {
//   try {
//     const res = await authFetch(`${API_URL}/api/paths/${pathId}/`);
//     const data = await parseJson(res);
//     return { ok: res.ok, status: res.status, data };
//   } catch (error) {
//     console.error("Erreur récupération chemin:", error);
//     return { ok: false, error: error.message };
//   }
// }

// export async function savePathToFavorites(pathId) {
//   try {
//     const res = await authFetch(`${API_URL}/api/paths/${pathId}/favorite/`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//     });
//     const data = await parseJson(res);
//     return { ok: res.ok, status: res.status, data };
//   } catch (error) {
//     console.error("Erreur sauvegarde favori:", error);
//     return { ok: false, error: error.message };
//   }
// }

// export async function removeSavedPath(pathId) {
//   try {
//     const res = await authFetch(`${API_URL}/api/paths/${pathId}/favorite/`, {
//       method: "DELETE",
//     });
//     return { ok: res.ok, status: res.status };
//   } catch (error) {
//     console.error("Erreur suppression favori:", error);
//     return { ok: false, error: error.message };
//   }
// }

// export async function getSavedPaths() {
//   try {
//     const res = await authFetch(`${API_URL}/api/users/me/favorites/`);
//     const data = await parseJson(res);
//     return { ok: res.ok, status: res.status, data };
//   } catch (error) {
//     console.error("Erreur récupération favoris:", error);
//     return { ok: false, error: error.message };
//   }
// }

// // ========================================
// // ÉTABLISSEMENTS
// // ========================================

// // ✅ Liste tous les établissements
// export async function getEstablishments() {
//   try {
//     const res = await authFetch(`${API_URL}/api/establishments/`);
//     const data = await parseJson(res);
//     return { ok: res.ok, status: res.status, data };
//   } catch (error) {
//     console.error("❌ Erreur récupération établissements:", error);
//     return { ok: false, error: error.message };
//   }
// }

// // ========================================
// // ADMIN
// // ========================================

// export async function getConnectedUsers() {
//   const res = await authFetch(`${API_URL}/admin-panel/api/users/connected/`);
//   const data = await parseJson(res);
//   return { ok: res.ok, status: res.status, data };
// }









// src/services/authService.js
import * as SecureStore from "expo-secure-store";
import { API_URL } from "../config/api";
import * as FileSystem from "expo-file-system/legacy";

// ========================================
// HELPERS
// ========================================

async function saveTokens({ access, refresh }) {
  if (access) await SecureStore.setItemAsync("access", access);
  if (refresh) await SecureStore.setItemAsync("refresh", refresh);
}

export async function getAccessToken() {
  return SecureStore.getItemAsync("access");
}

export async function getRefreshToken() {
  return SecureStore.getItemAsync("refresh");
}

export async function clearTokens() {
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

async function parseResponseSafely(res) {
  const raw = await res.text();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return { detail: raw };
  }
}

// Requête auth avec retry auto sur 401 (refresh token)
async function authFetch(url, options = {}, retry = true) {
  const access = await getAccessToken();

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(access ? { Authorization: `Bearer ${access}` } : {}),
    },
  });

  if (res.status === 401 && retry) {
    const refreshed = await refreshToken();
    if (refreshed.ok) {
      return authFetch(url, options, false);
    }
  }

  return res;
}

// ========================================
// UPLOAD CLOUDINARY
// ========================================

export async function uploadToCloudinary(videoUri) {
  console.log("========== DEBUG UPLOAD ==========");
  console.log("1️⃣ Début uploadToCloudinary");
  console.log("📹 URI reçue:", videoUri);

  try {
    console.log("2️⃣ Vérification existence fichier...");
    const fileInfo = await FileSystem.getInfoAsync(videoUri);
    console.log("📁 Info fichier:", fileInfo);

    if (!fileInfo.exists) {
      console.error("❌ Fichier non trouvé!");
      return { ok: false, error: "Fichier non trouvé" };
    }

    const fileSizeMB = fileInfo.size / (1024 * 1024);
    console.log(`📊 Taille fichier: ${fileSizeMB.toFixed(2)} MB`);

    console.log("3️⃣ Création FormData...");
    const formData = new FormData();

    const fileExtension = videoUri.split(".").pop()?.toLowerCase() || "mp4";
    const mimeType = fileExtension === "mov" ? "video/quicktime" : "video/mp4";
    console.log("📹 Extension:", fileExtension, "MIME:", mimeType);

    const filename = `path_video_${Date.now()}.${fileExtension}`;
    console.log("📝 Nom fichier:", filename);

    const fileToUpload = {
      uri: videoUri,
      type: mimeType,
      name: filename,
    };
    console.log("📎 Fichier à uploader:", fileToUpload);

    formData.append("file", fileToUpload);
    formData.append("upload_preset", "tektal_paths");
    formData.append("cloud_name", "dbqexsya0");
    formData.append("filename_override", filename);

    console.log("4️⃣ Envoi vers Cloudinary...");
    const startTime = Date.now();

    const res = await fetch("https://api.cloudinary.com/v1_1/dbqexsya0/video/upload", {
      method: "POST",
      body: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });

    const endTime = Date.now();
    console.log(`⏱️ Temps de réponse: ${(endTime - startTime) / 1000} secondes`);
    console.log("📥 Status HTTP:", res.status);

    const data = await parseJson(res);
    console.log("📥 Réponse Cloudinary:", data);

    if (!res.ok) {
      console.error("❌ Erreur Cloudinary:", data);
      return { ok: false, error: data.error?.message || `Erreur ${res.status}` };
    }

    console.log("✅ Upload réussi! URL:", data.secure_url);
    console.log("========== FIN DEBUG ==========");
    return { ok: true, data };
  } catch (error) {
    console.error("❌ Exception Cloudinary:", error);
    console.error("📚 Stack:", error.stack);
    console.log("========== FIN DEBUG (ERREUR) ==========");
    return { ok: false, error: error.message };
  }
}

// ========================================
// AUTHENTICATION
// ========================================

export async function register({ email, password, name }) {
  const res = await fetch(`${API_URL}/api/auth/users/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
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
  const refresh = await getRefreshToken();
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
  const res = await authFetch(`${API_URL}/api/auth/users/me/`);
  const data = await parseJson(res);
  return { ok: res.ok, status: res.status, data };
}

export async function updateProfile(payload) {
  const res = await authFetch(`${API_URL}/api/auth/users/me/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await parseJson(res);
  return { ok: res.ok, status: res.status, data };
}

export async function getFavorites() {
  const res = await authFetch(`${API_URL}/api/users/me/favorites/`);
  const data = await parseJson(res);
  return { ok: res.ok, status: res.status, data };
}

export async function getMyPaths() {
  const res = await authFetch(`${API_URL}/api/paths/?mine=true`);
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
  } catch {
    // ignore
  } finally {
    await clearTokens();
  }
}

// ========================================
// PATHS API
// ========================================

async function postCreate(url, pathData) {
  console.log("📤 Envoi vers:", url);
  const res = await authFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pathData),
  });
  const data = await parseResponseSafely(res);
  console.log("📥 Réponse backend:", res.status, data);
  return { ok: res.ok, status: res.status, data };
}

// Fallback: /api/paths/create/ puis /api/paths/ si 405
export async function createPath(pathData) {
  try {
    const first = await postCreate(`${API_URL}/api/paths/create/`, pathData);
    if (first.status !== 405) return first;
    return await postCreate(`${API_URL}/api/paths/`, pathData);
  } catch (error) {
    console.error("❌ Erreur réseau:", error);
    return { ok: false, status: 0, data: { detail: error.message } };
  }
}

export async function getPaths() {
  try {
    const res = await authFetch(`${API_URL}/api/paths/`);
    const data = await parseJson(res);
    return { ok: res.ok, status: res.status, data };
  } catch (error) {
    console.error("❌ Erreur récupération chemins:", error);
    return { ok: false, error: error.message };
  }
}

export async function getPathsByEstablishment(establishmentId) {
  try {
    const res = await authFetch(`${API_URL}/api/paths/?establishment_id=${establishmentId}`);
    const data = await parseJson(res);
    return { ok: res.ok, status: res.status, data };
  } catch (error) {
    console.error("❌ Erreur récupération chemins établissement:", error);
    return { ok: false, error: error.message };
  }
}

export async function getPathById(pathId) {
  try {
    const res = await authFetch(`${API_URL}/api/paths/${pathId}/`);
    const data = await parseJson(res);
    return { ok: res.ok, status: res.status, data };
  } catch (error) {
    console.error("Erreur récupération chemin:", error);
    return { ok: false, error: error.message };
  }
}

export async function savePathToFavorites(pathId) {
  try {
    const res = await authFetch(`${API_URL}/api/paths/${pathId}/favorite/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await parseJson(res);
    return { ok: res.ok, status: res.status, data };
  } catch (error) {
    console.error("Erreur sauvegarde favori:", error);
    return { ok: false, error: error.message };
  }
}

export async function removeSavedPath(pathId) {
  try {
    const res = await authFetch(`${API_URL}/api/paths/${pathId}/favorite/`, {
      method: "DELETE",
    });
    return { ok: res.ok, status: res.status };
  } catch (error) {
    console.error("Erreur suppression favori:", error);
    return { ok: false, error: error.message };
  }
}

export async function getSavedPaths() {
  try {
    const res = await authFetch(`${API_URL}/api/users/me/favorites/`);
    const data = await parseJson(res);
    return { ok: res.ok, status: res.status, data };
  } catch (error) {
    console.error("Erreur récupération favoris:", error);
    return { ok: false, error: error.message };
  }
}


// ✅ NOUVEAU — Récupère le profil public d'un user par son ID
// Utilisé par PathContext pour résoudre le vrai nom du créateur
export async function getUserById(userId) {
  try {
    const res = await authFetch(`${API_URL}/api/auth/users/${userId}/`);
    const data = await parseJson(res);
    return { ok: res.ok, status: res.status, data };
  } catch (error) {
    console.error("Erreur récupération user:", error);
    return { ok: false, error: error.message };
  }
}

// ========================================
// ÉTABLISSEMENTS
// ========================================

export async function getEstablishments() {
  try {
    const res = await authFetch(`${API_URL}/api/establishments/`);
    const data = await parseJson(res);
    return { ok: res.ok, status: res.status, data };
  } catch (error) {
    console.error("❌ Erreur récupération établissements:", error);
    return { ok: false, error: error.message };
  }
}

// ========================================
// ADMIN
// ========================================

export async function getConnectedUsers() {
  const res = await authFetch(`${API_URL}/admin-panel/api/users/connected/`);
  const data = await parseJson(res);
  return { ok: res.ok, status: res.status, data };
}