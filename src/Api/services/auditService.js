import httpClient from '../httpClient.js';
import { ENDPOINTS } from '../endpoints.js';

async function getAllAudits() {
  return httpClient.get(ENDPOINTS.AUDIT.GET_ALL);
}

export { getAllAudits };