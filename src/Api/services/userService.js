import httpClient from '../httpClient.js';
import { ENDPOINTS } from '../endpoints.js';

async function getAllUsers() {
  return httpClient.get(ENDPOINTS.USER.GET_ALL);
}

async function getUserById(id) {
  return httpClient.get(ENDPOINTS.USER.GET_BY_ID(id));
}

async function syncCurrentUser() {
  return httpClient.post(ENDPOINTS.USER.ME);
}

export { getAllUsers, getUserById, syncCurrentUser };
