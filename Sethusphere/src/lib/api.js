const API_BASE_URL = (import.meta.env.VITE_API_URL || "https://sethusphere-backend.onrender.com/api/health").replace(/\/+$/, "");

export const getAuthToken = () => localStorage.getItem("sethusphere_token");

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("sethusphere_token", token);
  } else {
    localStorage.removeItem("sethusphere_token");
  }
};

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  const token = getAuthToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`Backend unavailable. Please make sure the API server is running at ${API_BASE_URL}.`);
    }
    throw error;
  }
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "Unable to complete the request.");
  }

  return payload;
}
