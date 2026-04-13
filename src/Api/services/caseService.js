import httpClient from '../httpClient.js';
import { ENDPOINTS } from '../endpoints.js';

async function getAllCases() {
  return httpClient.get(ENDPOINTS.CASES.GET_ALL);
}

async function getCaseById(id) {
  return httpClient.get(ENDPOINTS.CASES.GET_BY_ID(id));
}

async function createCase(caseData) {
  return httpClient.post(ENDPOINTS.CASES.CREATE, caseData);
}

async function updateCase(id, caseData) {
  return httpClient.put(ENDPOINTS.CASES.UPDATE, { id, ...caseData });
}

async function deleteCase(id) {
  return httpClient.delete(ENDPOINTS.CASES.DELETE(id));
}

export { getAllCases, getCaseById, createCase, updateCase, deleteCase };
