export function loadCrudList(key, fallback = []) {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) || 'null');
    return Array.isArray(parsed) && parsed.length ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function saveCrudList(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadCrudObject(key) {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) || '{}');
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function saveCrudObject(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}
