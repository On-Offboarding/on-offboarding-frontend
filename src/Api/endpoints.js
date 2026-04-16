/**
 * API Endpoints
 * Centralized definition of all API endpoints
 */

export const ENDPOINTS = {
  // Case endpoints
  CASES: {
    GET_ALL: '/Api/Case/GetAll',
    GET_ALL_BY_STATUS: (status) => `/Api/Case/GetAllByStatus?status=${status}`,
    GET_BY_ID: (id) => `/Api/Case/Get/${id}`,
    CREATE: '/Api/Case/Create',
    UPDATE: '/Api/Case/Update',
    EXPORT: (id) => `/Api/Case/Export/${id}`,
  },

  // System Access endpoints
  SYSTEM_ACCESS: {
    GET_ALL: '/Api/SystemAccess/GetAll',
    GET_ALL_PROFILES: '/Api/SystemAccess/Profiles/GetAll',
  },

  // Employee endpoints
  EMPLOYEE: {
    GET_ALL: '/Api/Employee/GetAll',
    GET_BY_ID: (id) => `/Api/Employee/Get/${id}`,
  },

  // User endpoints
  USER: {
    GET_ALL: '/Api/User/GetAll',
    GET_BY_ID: (id) => `/Api/User/Get/${id}`,
  },

  // Audit endpoints
  AUDIT: {
    GET_ALL: '/Api/Audit/GetAll',
  },
};

export default ENDPOINTS;
