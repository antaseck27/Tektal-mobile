

// // /Users/antayussuf/Desktop/volkeno/tektal-mobile/src/services/authService.js
// import * as SecureStore from "expo-secure-store";
// import { API_URL } from "../config/api";

// async function saveTokens({ access, refresh }) {
//   if (access) await SecureStore.setItemAsync("access", access);
//   if (refresh) await SecureStore.setItemAsync("refresh", refresh);
// }

// async function getAccessToken() {
//   return SecureStore.getItemAsync("access");
// }

// async function clearTokens() {
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

// export async function register({ email, password, full_name }) {
//   const res = await fetch(`${API_URL}/api/auth/users/`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, password, full_name }),
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
//   const refresh = await SecureStore.getItemAsync("refresh");
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
//   const access = await getAccessToken();
//   const res = await fetch(`${API_URL}/api/auth/users/me/`, {
//     headers: { Authorization: `Bearer ${access}` },
//   });
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

//     // Optionnel: invalider le refresh token côté backend
//     if (refresh) {
//       await fetch(`${API_URL}/api/auth/jwt/blacklist/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ refresh }),
//       });
//     }
//   } catch (e) {
//     // ignore
//   } finally {
//     await clearTokens();
//   }
// }


// /Users/antayussuf/Desktop/volkeno/tektal-mobile/src/services/authService.js
import * as SecureStore from "expo-secure-store";
import { API_URL } from "../config/api";

const ACCESS_KEY = "access";
const REFRESH_KEY = "refresh";
const USER_KEY = "user_profile";

async function saveTokens({ access, refresh }) {
  if (access) await SecureStore.setItemAsync(ACCESS_KEY, access);
  if (refresh) await SecureStore.setItemAsync(REFRESH_KEY, refresh);
}

async function getAccessToken() {
  return SecureStore.getItemAsync(ACCESS_KEY);
}

async function getRefreshToken() {
  return SecureStore.getItemAsync(REFRESH_KEY);
}

async function clearTokens() {
  await SecureStore.deleteItemAsync(ACCESS_KEY);
  await SecureStore.deleteItemAsync(REFRESH_KEY);
}

async function parseJson(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

async function saveUserProfile(profile) {
  if (!profile) return;
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(profile));
}

export async function getStoredUserProfile() {
  const raw = await SecureStore.getItemAsync(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function clearStoredUserProfile() {
  await SecureStore.deleteItemAsync(USER_KEY);
}

function getErrorMessage(data, fallback = "Une erreur est survenue.") {
  if (!data) return fallback;
  if (typeof data === "string") return data;
  if (data.detail) return data.detail;

  const firstKey = Object.keys(data)[0];
  if (!firstKey) return fallback;

  const value = data[firstKey];
  if (Array.isArray(value) && value.length > 0) return String(value[0]);
  if (typeof value === "string") return value;

  return fallback;
}

async function authFetch(path, options = {}) {
  const access = await getAccessToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (access) headers.Authorization = `Bearer ${access}`;

  return fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });
}

async function authFetchWithRefresh(path, options = {}) {
  let res = await authFetch(path, options);

  if (res.status !== 401) return res;

  const refreshed = await refreshToken();
  if (!refreshed.ok) return res;

  return authFetch(path, options);
}

export async function register({ email, password, full_name }) {
  const res = await fetch(`${API_URL}/api/auth/users/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, full_name }),
  });

  const data = await parseJson(res);
  return {
    ok: res.ok,
    status: res.status,
    data,
    message: res.ok ? "Compte créé avec succès." : getErrorMessage(data, "Inscription échouée."),
  };
}

export async function login({ email, password }) {
  const res = await fetch(`${API_URL}/api/auth/jwt/create/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await parseJson(res);

  if (res.ok) {
    await saveTokens(data);

    // Précharge le profil après login pour Redux/UX
    const profileRes = await getProfile();
    if (profileRes.ok) {
      await saveUserProfile(profileRes.data);
    }
  }

  return {
    ok: res.ok,
    status: res.status,
    data,
    message: res.ok ? "Connexion réussie." : getErrorMessage(data, "Connexion échouée."),
  };
}

export async function refreshToken() {
  const refresh = await getRefreshToken();

  if (!refresh) {
    return {
      ok: false,
      status: 401,
      data: { detail: "Refresh token manquant." },
      message: "Session expirée.",
    };
  }

  const res = await fetch(`${API_URL}/api/auth/jwt/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  const data = await parseJson(res);

  if (res.ok && data?.access) {
    await saveTokens({ access: data.access });
  } else if (!res.ok) {
    await clearTokens();
    await clearStoredUserProfile();
  }

  return {
    ok: res.ok,
    status: res.status,
    data,
    message: res.ok ? "Token rafraîchi." : getErrorMessage(data, "Session expirée."),
  };
}

export async function getProfile() {
  const res = await authFetchWithRefresh("/api/auth/users/me/", { method: "GET" });
  const data = await parseJson(res);

  if (res.ok) {
    await saveUserProfile(data);
  }

  return {
    ok: res.ok,
    status: res.status,
    data,
    message: res.ok ? "Profil chargé." : getErrorMessage(data, "Impossible de charger le profil."),
  };
}

export async function activateAccount({ uid, token }) {
  const res = await fetch(`${API_URL}/api/auth/users/activation/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid, token }),
  });

  let data = {};
  if (res.status !== 204) {
    data = await parseJson(res);
  }

  return {
    ok: res.ok,
    status: res.status,
    data,
    message: res.ok ? "Compte activé." : getErrorMessage(data, "Activation échouée."),
  };
}

export async function resetPassword(email) {
  const res = await fetch(`${API_URL}/api/auth/users/reset_password/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  let data = {};
  if (res.status !== 204) {
    data = await parseJson(res);
  }

  return {
    ok: res.ok,
    status: res.status,
    data,
    message: res.ok ? "Email de réinitialisation envoyé." : getErrorMessage(data, "Échec de l'envoi."),
  };
}

export async function confirmReset({ uid, token, new_password, re_new_password }) {
  const res = await fetch(`${API_URL}/api/auth/users/reset_password_confirm/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid, token, new_password, re_new_password }),
  });

  let data = {};
  if (res.status !== 204) {
    data = await parseJson(res);
  }

  return {
    ok: res.ok,
    status: res.status,
    data,
    message: res.ok ? "Mot de passe mis à jour." : getErrorMessage(data, "Réinitialisation échouée."),
  };
}

export async function logout() {
  try {
    const refresh = await getRefreshToken();

    if (refresh) {
      await fetch(`${API_URL}/api/auth/jwt/blacklist/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });
    }
  } catch {
    // ignore network/logout backend errors
  } finally {
    await clearTokens();
    await clearStoredUserProfile();
  }
}
