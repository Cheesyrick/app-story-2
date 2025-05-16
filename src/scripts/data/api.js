import CONFIG from "../config";

export async function getAllStories(token) {
  const response = await fetch(`${CONFIG.BASE_URL}/stories`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil data cerita");
  }

  return await response.json();
}

export async function postStory(formData, token) {
  const response = await fetch(`${CONFIG.BASE_URL}/stories`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Gagal mengirim cerita");
  }

  return await response.json();
}

export async function register(data) {
  const response = await fetch(`${CONFIG.BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Gagal mendaftar");
  }

  return await response.json();
}

export async function login(data) {
  const response = await fetch(`${CONFIG.BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Gagal login");
  }

  return await response.json();
}
