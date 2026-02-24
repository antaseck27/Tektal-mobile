


// // services/adminPathService.js
// import http from "./http";

// /**
//  * ========================================
//  * GESTION DES CHEMINS
//  * ========================================
//  */

// // ✅ Créer un nouveau chemin (POST /api/paths/)
// // Le backend doit auto-mettre status="approved" à la création
// export async function createPath(pathData) {
//   try {
//     const isFormData = typeof FormData !== "undefined" && pathData instanceof FormData;

//     if (isFormData) {
//       console.log("📤 createPath payload: FormData");
//     } else {
//       console.log("📤 createPath payload:", JSON.stringify(pathData, null, 2));
//     }

//     // Endpoint standard REST
//     const response = await http.post("/api/paths/", pathData, {
//       headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
//     });

//     return { ok: true, data: response.data, status: response.status };
//   } catch (error) {
//     const status = error?.response?.status;
//     const data = error?.response?.data;

//     console.log("❌ createPath status:", status);
//     console.log("❌ createPath data:", JSON.stringify(data, null, 2));
//     console.error("❌ createPath raw error:", error?.message);

//     return {
//       ok: false,
//       error: data || "Erreur lors de la création du chemin",
//       status,
//     };
//   }
// }

// // ✅ Récupérer tous les chemins avec filtres (GET /api/paths/)
// export async function getAllPaths(params = {}) {
//   try {
//     const response = await http.get("/api/paths/", { params });
//     return { ok: true, data: response.data };
//   } catch (error) {
//     console.error("Erreur récupération chemins:", error);
//     return {
//       ok: false,
//       error: error.response?.data || "Erreur lors de la récupération des chemins",
//       status: error.response?.status,
//     };
//   }
// }

// // ✅ Récupérer un chemin par ID (GET /api/paths/{id}/)
// export async function getPathById(pathId) {
//   try {
//     const response = await http.get(`/api/paths/${pathId}/`);
//     return { ok: true, data: response.data };
//   } catch (error) {
//     console.error("Erreur récupération chemin:", error);
//     return {
//       ok: false,
//       error: error.response?.data || "Chemin introuvable",
//       status: error.response?.status,
//     };
//   }
// }

// // ✅ Approuver un chemin (POST /api/paths/{id}/approve/)
// export async function approvePath(pathId) {
//   try {
//     const response = await http.post(`/api/paths/${pathId}/approve/`);
//     return { ok: true, data: response.data };
//   } catch (error) {
//     console.error("Erreur approbation chemin:", error);
//     return {
//       ok: false,
//       error: error.response?.data?.detail || "Erreur lors de l'approbation",
//       status: error.response?.status,
//     };
//   }
// }

// // ✅ Rejeter un chemin (POST /api/paths/{id}/reject/)
// export async function rejectPath(pathId, reason = "") {
//   try {
//     const response = await http.post(`/api/paths/${pathId}/reject/`, { reason });
//     return { ok: true, data: response.data };
//   } catch (error) {
//     console.error("Erreur rejet chemin:", error);
//     return {
//       ok: false,
//       error: error.response?.data?.detail || "Erreur lors du rejet",
//       status: error.response?.status,
//     };
//   }
// }

// // ✅ Supprimer un chemin (DELETE /api/paths/{id}/)
// export async function deletePath(pathId) {
//   try {
//     await http.delete(`/api/paths/${pathId}/`);
//     return { ok: true };
//   } catch (error) {
//     console.error("Erreur suppression chemin:", error);
//     return {
//       ok: false,
//       error: error.response?.data?.detail || "Erreur lors de la suppression",
//       status: error.response?.status,
//     };
//   }
// }

// // ✅ Récupérer les chemins publics (GET /api/public-paths/)
// export async function getPublicPaths(params = {}) {
//   try {
//     const response = await http.get("/api/public-paths/", { params });
//     return { ok: true, data: response.data };
//   } catch (error) {
//     console.error("Erreur récupération chemins publics:", error);
//     return {
//       ok: false,
//       error: error.response?.data || "Erreur lors de la récupération",
//       status: error.response?.status,
//     };
//   }
// }

// /**
//  * ========================================
//  * HELPERS / FILTRES
//  * ========================================
//  */

// export async function getPendingPaths() {
//   return getAllPaths({ status: "pending" });
// }

// export async function getApprovedPaths() {
//   return getAllPaths({ status: "approved" });
// }

// export async function getRejectedPaths() {
//   return getAllPaths({ status: "rejected" });
// }

// export async function getOfficialPaths() {
//   return getAllPaths({ is_official: true });
// }

// export async function getCommunityPaths() {
//   return getAllPaths({ is_official: false });
// }

// export async function searchPaths(query) {
//   return getAllPaths({ search: query });
// }

// export async function getPathsPaginated(page = 1, pageSize = 10) {
//   return getAllPaths({
//     page,
//     page_size: pageSize,
//   });
// }


// services/adminPathService.js
import http from "./http";

/**
 * ========================================
 * GESTION DES CHEMINS (ADMIN)
 * ========================================
 */

// ✅ Créer un nouveau chemin (fallback entre /api/paths/create/ et /api/paths/)
export async function createPath(pathData) {
  const isFormData = typeof FormData !== "undefined" && pathData instanceof FormData;
  const config = {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
  };

  if (isFormData) {
    console.log("📤 createPath payload: FormData");
  } else {
    console.log("📤 createPath payload:", JSON.stringify(pathData, null, 2));
  }

  try {
    return await postCreate("/api/paths/create/", pathData, config);
  } catch (e1) {
    const status1 = e1?.response?.status;
    const data1 = e1?.response?.data;

    console.log("❌ createPath status:", status1);
    console.log("❌ createPath data:", JSON.stringify(data1, null, 2));
    console.error("❌ createPath raw error:", e1?.message);

    if (status1 !== 405) {
      return {
        ok: false,
        error: data1 || "Erreur lors de la création du chemin",
        status: status1,
      };
    }

    // fallback si /api/paths/create/ refuse POST
    try {
      return await postCreate("/api/paths/", pathData, config);
    } catch (e2) {
      const status2 = e2?.response?.status;
      const data2 = e2?.response?.data;

      console.log("❌ createPath fallback status:", status2);
      console.log("❌ createPath fallback data:", JSON.stringify(data2, null, 2));
      console.error("❌ createPath fallback raw error:", e2?.message);

      return {
        ok: false,
        error: data2 || "Erreur lors de la création du chemin",
        status: status2,
      };
    }
  }
}

async function postCreate(url, pathData, config) {
  console.log("📤 Envoi vers:", `https://tektal-backend.onrender.com${url}`);
  const response = await http.post(url, pathData, config);
  return { ok: true, data: response.data, status: response.status };
}

// ✅ Récupérer tous les chemins avec filtres (GET /api/paths/)
export async function getAllPaths(params = {}) {
  try {
    const response = await http.get("/api/paths/", { params });
    return { ok: true, data: response.data };
  } catch (error) {
    console.error("Erreur récupération chemins:", error);
    return {
      ok: false,
      error: error.response?.data || "Erreur lors de la récupération des chemins",
      status: error.response?.status,
    };
  }
}

// ✅ Récupérer un chemin par ID (GET /api/paths/{id}/)
export async function getPathById(pathId) {
  try {
    const response = await http.get(`/api/paths/${pathId}/`);
    return { ok: true, data: response.data };
  } catch (error) {
    console.error("Erreur récupération chemin:", error);
    return {
      ok: false,
      error: error.response?.data || "Chemin introuvable",
      status: error.response?.status,
    };
  }
}

// ✅ Approuver un chemin (POST /api/paths/{id}/approve/)
export async function approvePath(pathId) {
  try {
    const response = await http.post(`/api/paths/${pathId}/approve/`);
    return { ok: true, data: response.data };
  } catch (error) {
    console.error("Erreur approbation chemin:", error);
    return {
      ok: false,
      error: error.response?.data?.detail || "Erreur lors de l'approbation",
      status: error.response?.status,
    };
  }
}

// ✅ Rejeter un chemin (POST /api/paths/{id}/reject/)
export async function rejectPath(pathId, reason = "") {
  try {
    const response = await http.post(`/api/paths/${pathId}/reject/`, { reason });
    return { ok: true, data: response.data };
  } catch (error) {
    console.error("Erreur rejet chemin:", error);
    return {
      ok: false,
      error: error.response?.data?.detail || "Erreur lors du rejet",
      status: error.response?.status,
    };
  }
}

// ✅ Supprimer un chemin (DELETE /api/paths/{id}/)
export async function deletePath(pathId) {
  try {
    await http.delete(`/api/paths/${pathId}/`);
    return { ok: true };
  } catch (error) {
    console.error("Erreur suppression chemin:", error);
    return {
      ok: false,
      error: error.response?.data?.detail || "Erreur lors de la suppression",
      status: error.response?.status,
    };
  }
}

// ✅ Récupérer les chemins publics (GET /api/public-paths/)
export async function getPublicPaths(params = {}) {
  try {
    const response = await http.get("/api/public-paths/", { params });
    return { ok: true, data: response.data };
  } catch (error) {
    console.error("Erreur récupération chemins publics:", error);
    return {
      ok: false,
      error: error.response?.data || "Erreur lors de la récupération",
      status: error.response?.status,
    };
  }
}

/**
 * ========================================
 * HELPERS / FILTRES
 * ========================================
 */

export async function getPendingPaths() {
  return getAllPaths({ status: "pending" });
}

export async function getApprovedPaths() {
  return getAllPaths({ status: "approved" });
}

export async function getRejectedPaths() {
  return getAllPaths({ status: "rejected" });
}

export async function getOfficialPaths() {
  return getAllPaths({ is_official: true });
}

export async function getCommunityPaths() {
  return getAllPaths({ is_official: false });
}

export async function searchPaths(query) {
  return getAllPaths({ search: query });
}

export async function getPathsPaginated(page = 1, pageSize = 10) {
  return getAllPaths({
    page,
    page_size: pageSize,
  });
}
