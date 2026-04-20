import { API_BASE_URL, API_TIMEOUT } from './config.js';
import { getAccessToken } from "../auth/tokenService.js";

class HttpError extends Error {
  constructor(status, message, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

class HttpClient {
  async request(method, endpoint, body = null, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;    
    const token = await getAccessToken();
    console.log('TOKEN => ', token)
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    const config = {
      method,
      headers,
      signal: AbortSignal.timeout(API_TIMEOUT),
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.text().then(text => {
          try { return JSON.parse(text); } catch { return text; }
        });
        throw new HttpError(response.status, `HTTP ${response.status}`, errorData);
      }

      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new HttpError(500, error.message);
    }
  }

  async requestBlob(method, endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      method,
      signal: AbortSignal.timeout(API_TIMEOUT),
      ...options,
    };

    const response = await fetch(url, config);
    if (!response.ok) {
      throw new HttpError(response.status, `HTTP ${response.status}`);
    }
    return response.blob();
  }

  getBlob(endpoint, options) {
    return this.requestBlob('GET', endpoint, options);
  }

  get(endpoint, options) {
    return this.request('GET', endpoint, null, options);
  }

  post(endpoint, body, options) {
    return this.request('POST', endpoint, body, options);
  }

  put(endpoint, body, options) {
    return this.request('PUT', endpoint, body, options);
  }

  patch(endpoint, body, options) {
    return this.request('PATCH', endpoint, body, options);
  }

  delete(endpoint, options) {
    return this.request('DELETE', endpoint, null, options);
  }
}

export { HttpClient, HttpError };
export default new HttpClient();
