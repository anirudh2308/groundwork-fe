// Thin wrappers around the Groundwork API. All URLs are relative so the app
// works behind the Vite proxy in dev and same-origin in production.

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(path, {
      credentials: "same-origin",
      ...options,
      headers: options.body ? { "Content-Type": "application/json" } : undefined,
    });
  } catch {
    throw new ApiError(0, "Can't reach the server. Check your connection and try again.");
  }

  if (res.status === 204) return null;

  let body = null;
  try {
    body = await res.json();
  } catch {
    // Non-JSON response (e.g. proxy error page); fall through with body = null.
  }

  if (!res.ok) {
    throw new ApiError(res.status, body?.error || `Request failed (${res.status})`);
  }
  return body;
}

export function login(email, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function logout() {
  return request("/auth/logout", { method: "POST" });
}

export function getMe() {
  return request("/auth/me");
}

// Only params with a non-empty value are sent.
export function getLeads(params) {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    const str = String(value).trim();
    if (str !== "") qs.set(key, str);
  }
  const query = qs.toString();
  return request(query ? `/leads?${query}` : "/leads");
}
