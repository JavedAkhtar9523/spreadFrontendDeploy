
// utils/localStorage.js
export const STORAGE_KEY = "socialAppState";

// ✅ Load full app state
export const loadState = () => {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : undefined;
  } catch (err) {
    console.error("loadState error:", err);
    return undefined;
  }
};

// ✅ Save full app state (users + currentUser + others)
export const saveState = (state) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("activityUpdated")); // trigger UI refresh
  } catch (err) {
    console.error("saveState error:", err);
  }
};

// ✅ Partial: Save only updated users
export const saveUsers = (updatedUsers) => {
  if (typeof window === "undefined") return;
  try {
    const state = loadState() || {};
    state.users = updatedUsers;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("activityUpdated"));
  } catch (err) {
    console.error("saveUsers error:", err);
  }
};

// ✅ Clear localStorage
export const clearState = () => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("clearState error:", err);
  }
};

