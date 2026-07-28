const BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

// Thin fetch wrapper. Throws Error(message) on non-2xx so callers can show the server's message.
async function req(path, opts = {}) {
  const url = `${BASE}/api${path}`;

  const res = await fetch(url, opts);

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => ({})) : {};

  if (!res.ok || !isJson) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }

  return data;
}

export const submitTestimonial = (formData) =>
  req("/testimonials", { method: "POST", body: formData });

export const listTestimonials = ({ status, page = 1, limit = 20 } = {}) => {
  const q = new URLSearchParams({ page, limit });
  if (status) q.set("status", status);
  return req(`/testimonials?${q}`);
};

export const listPublic = ({ page = 1, limit = 12 } = {}) =>
  req(`/testimonials/public?${new URLSearchParams({ page, limit })}`);

export const setStatus = (id, status) =>
  req(`/testimonials/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });