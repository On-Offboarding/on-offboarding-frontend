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
  return httpClient.put(ENDPOINTS.CASES.UPDATE, { ...caseData });
}

async function exportCaseToPdf(id) {
  const blob = await httpClient.getBlob(ENDPOINTS.CASES.EXPORT(id));
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Behörighetsrapport.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export { getAllCases, getCaseById, createCase, updateCase, exportCaseToPdf };
