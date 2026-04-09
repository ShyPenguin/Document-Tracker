import axios from "axios";

const url = "https://moresco1-api.onrender.com";

const API = axios.create({ baseURL: url });
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      throw new Error(
        `${error.response.data.msg}. Status Code (${error.response.status})`
      );
    }
    throw new Error("Network Error");
  }
);

export const loggedIn = (data) => API.post(`auth/login`, data);

// Offices
export const fetchOffice = (id, token) =>
  API.get(`admin/offices/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const fetchOffices = (page, token) =>
  API.get(`admin/offices?page=${page}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const createOffice = (name, token) =>
  API.post("admin/offices", name, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const updateOffice = (id, name, token) =>
  API.put(`admin/offices/${id}`, name, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const deleteOffice = (id, token) =>
  API.delete(`admin/offices/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Types
export const fetchTypes = (page, token) =>
  API.get(`admin/types?page=${page}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const createType = (name, token) =>
  API.post("admin/types", name, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const fetchType = (id, token) =>
  API.get(`admin/types/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const updateType = (id, name, token) =>
  API.put(`admin/types/${id}`, name, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const deleteType = (id, token) =>
  API.delete(`admin/types/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Users
export const fetchUsers = (page, token) =>
  API.get(`admin/users?page=${page}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const createUser = (data, token) =>
  API.post("admin/users", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const fetchUser = (id, token) =>
  API.get(`admin/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const deleteUser = (id, token) =>
  API.delete(`admin/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Documents
export const fetchDocuments = (page, token) =>
  API.get(`admin/documents?page=${page}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const createDocument = (data, token) =>
  API.post("admin/documents", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const fetchDocument = (id, token) =>
  API.get(`admin/documents/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const updateDocument = (id, data, token) =>
  API.put(`admin/documents/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const deleteDocument = (id, token) =>
  API.delete(`admin/documents/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const searchDocument = (page, endDate, startDate, text, token) =>
  API.get(
    `admin/documents/search?page=${page}&${
      endDate ? `endDate=${endDate}` : `endDate=`
    }&${startDate ? `startDate=${startDate}` : `startDate=`}&${
      text ? `text=${text}` : `text=`
    }`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

// Track
export const getDocumentTrack = (id, token) =>
  API.get(`admin/track/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const createDocumentTrack = (id, data, token) =>
  API.post(`admin/track/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const deleteDocumentTrack = (id, token) =>
  API.delete(`admin/track/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

//Department Actions

// Department Documents
export const deptSearchDocument = (
  page,
  endDate,
  startDate,
  text,
  token,
  department
) =>
  API.get(
    `departments/${department}/documents/search?page=${page}&${
      endDate ? `endDate=${endDate}` : `endDate=`
    }&${startDate ? `startDate=${startDate}` : `startDate=`}&${
      text ? `text=${text}` : `text=`
    }`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
export const deptFetchDocument = (id, token, department) =>
  API.get(`departments/${department}/documents/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deptUpdateDocument = (id, data, token, department) =>
  API.put(`departments/${department}/documents/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deptDeleteDocument = (id, token, department) =>
  API.delete(`departments/${department}/documents/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deptCreateDocument = (data, token, department) =>
  API.post(`departments/${department}/documents`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Department Track
export const deptGetDocumentTrack = (id, token, department) =>
  API.get(`departments/${department}/track/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Department Document Statuses
export const deptGetNumberOfDocumentStatuses = (token, department) =>
  API.get(`departments/${department}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deptFilterDocumentStatus = (
  page,
  endDate,
  startDate,
  token,
  department,
  status
) =>
  API.get(
    `departments/${department}/${status}/filter?page=${page}&${
      endDate ? `endDate=${endDate}` : `endDate=`
    }&${startDate ? `startDate=${startDate}` : `startDate=`}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const deptConfirmDocument = (data, token, department, id) =>
  API.post(`departments/${department}/${id}/confirm`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deptSendDocument = (data, token, department, id) =>
  API.post(`departments/${department}/${id}/send`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deptRevertDocument = (token, department, id) =>
  API.delete(`departments/${department}/${id}/revert`, {
    headers: { Authorization: `Bearer ${token}` },
  });
