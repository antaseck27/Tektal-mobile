

import * as SecureStore from "expo-secure-store";
import { API_URL } from "../config/api";

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
  await clearTokens();
}
