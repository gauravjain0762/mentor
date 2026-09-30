export const BASE_URL = "https://fitness-app-seven-beryl.vercel.app";
export const SESSION_STARTED_AT_KEY = "mentor_session_started_at";
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;

function decodeJwtPayload(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function clearMentorSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("mentorProfile");
  localStorage.removeItem(SESSION_STARTED_AT_KEY);
}

export function isMentorSessionExpired() {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("token");
  if (!token) return false;

  let startedAt = Number(localStorage.getItem(SESSION_STARTED_AT_KEY));
  if (!Number.isFinite(startedAt) || startedAt <= 0) {
    const issuedAt = decodeJwtPayload(token)?.iat;
    startedAt = Number.isFinite(issuedAt) ? issuedAt * 1000 : Date.now();
    localStorage.setItem(SESSION_STARTED_AT_KEY, String(startedAt));
  }

  return Date.now() - startedAt >= SESSION_MAX_AGE_MS;
}

// Resolves the signed-in mentor's display info from whatever the backend actually gave us:
// a stored profile object (if the login response included one), else claims baked into the JWT,
// else a safe generic fallback. Never a hardcoded name.
export function getMentorProfile() {
  if (typeof window === "undefined") return null;

  const fallback = { id: null, name: "Mentor", role: "Performance Mentor", avatar: "https://i.pravatar.cc/150?img=33" };

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
    id: source.userId || source.id || source._id || source.sub || source.mentorId || null,
    name,
    role: source.role || source.designation || fallback.role,
    avatar: source.avatarUrl || source.avatar || source.photoUrl || fallback.avatar,
  };
}

export async function apiFetch(path, options = {}) {
  if (!path.startsWith("/api/auth/mentor/login") && isMentorSessionExpired()) {
    if (typeof window !== "undefined") window.dispatchEvent(new Event("mentor-session-expired"));
    throw new Error("Session expired. Please sign in again.");
  }
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
