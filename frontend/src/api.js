const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

export const apiBaseUrl = API_BASE_URL;

export const buildApiUrl = (endpoint) => {
  // Ensure we don't double slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};

export const fetchJson = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = { ...options.headers };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(buildApiUrl(endpoint), {
    ...options,
    headers,
  });
  
  // Handle HTTP 204 No Content
  if (response.status === 204) {
    return null;
  }
  
  const data = await response.json().catch(() => null);
  
  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    // FastAPI returns errors inside 'detail'
    const errorMsg = data?.detail || data?.message || `Request failed with status ${response.status}`;
    const formattedError = typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg;
    throw new Error(formattedError);
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

export const putJson = async (endpoint, body) => {
  return fetchJson(endpoint, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
};

export const deleteJson = async (endpoint) => {
  return fetchJson(endpoint, { method: 'DELETE' });
};
