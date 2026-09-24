export const BASE_URL = "https://fitness-app-seven-beryl.vercel.app";

function decodeJwtPayload(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

// Resolves the signed-in mentor's display info from whatever the backend actually gave us:
// a stored profile object (if the login response included one), else claims baked into the JWT,
// else a safe generic fallback. Never a hardcoded name.
export function getMentorProfile() {
  if (typeof window === "undefined") return null;

  const fallback = { name: "Mentor", role: "Performance Mentor", avatar: "https://i.pravatar.cc/150?img=33" };

  let stored = null;
  try {
    const raw = localStorage.getItem("mentorProfile");
    if (raw) stored = JSON.parse(raw);
  } catch {
    stored = null;
  }

  const token = localStorage.getItem("token");
  const claims = token ? decodeJwtPayload(token) : null;

  const source = stored || claims;
  if (!source) return fallback;

  const name =
    source.name ||
    source.fullName ||
    [source.firstName, source.lastName].filter(Boolean).join(" ") ||
    (source.email ? source.email.split("@")[0] : "") ||
    fallback.name;

  return {
    name,
    role: source.role || source.designation || fallback.role,
    avatar: source.avatarUrl || source.avatar || source.photoUrl || fallback.avatar,
  };
}

export async function apiFetch(path, options = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    headers,
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}
