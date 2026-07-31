// Central place for environment-driven configuration.
// Previously every component hardcoded "http://localhost:5000", which meant
// the app broke the moment it was opened from another device, port, or a
// deployed environment. Now it's read once from the Vite env file
// (client/.env -> VITE_API_URL) and reused everywhere.
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Images now come from Cloudinary as full URLs (e.g. https://res.cloudinary.com/...)
// after the backend switched away from local disk storage. Older records saved
// before that switch may still have a relative "/uploads/..." path. This helper
// handles both so nothing breaks either way: full URLs are used as-is, relative
// paths get the API base prefixed like before.
export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE_URL}${path}`;
};
