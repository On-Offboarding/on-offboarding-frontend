import httpClient from '../httpClient.js';
import { ENDPOINTS } from '../endpoints.js';

async function getAllEmployees() {
  return httpClient.get(ENDPOINTS.EMPLOYEE.GET_ALL);
}

async function getEmployeeById(id) {
  return httpClient.get(ENDPOINTS.EMPLOYEE.GET_BY_ID(id));
}

export { getAllEmployees, getEmployeeById };
