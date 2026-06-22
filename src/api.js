const API_BASE_URL = 'https://stringlab-ims-server.herokuapp.com/api';

export const apiBaseUrl = API_BASE_URL;

export const buildApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;

export const fetchJson = async (endpoint, options = {}) => {
  const response = await fetch(buildApiUrl(endpoint), options);
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error = data?.message || `Request failed with status ${response.status}`;
    throw new Error(error);
  }
  return data;
};

export const postJson = async (endpoint, body) => {
  return fetchJson(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
};

export const deleteJson = async (endpoint) => {
  return fetchJson(endpoint, { method: 'DELETE' });
};
