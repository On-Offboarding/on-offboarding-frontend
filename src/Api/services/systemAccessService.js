import httpClient from '../httpClient.js';
import { ENDPOINTS } from '../endpoints.js';

async function getAllProfiles() {
  return httpClient.get(ENDPOINTS.SYSTEM_ACCESS.GET_ALL_PROFILES);
}

async function getAllSystems() {
  return httpClient.get(ENDPOINTS.SYSTEM_ACCESS.GET_ALL);
}

export { getAllProfiles, getAllSystems };
