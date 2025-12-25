import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// Post APIs
export const postAPI = {
  create: (data) => api.post('/posts', data),
  getAll: (page = 1, limit = 20) => api.get(`/posts?page=${page}&limit=${limit}`),
  delete: (id) => api.delete(`/posts/${id}`),
};

// Comment APIs
export const commentAPI = {
  create: (data) => api.post('/comments', data),
  getByPost: (postId) => api.get(`/comments/post/${postId}`),
  delete: (id) => api.delete(`/comments/${id}`),
};

// Like APIs
export const likeAPI = {
  toggle: (postId) => api.post(`/likes/${postId}`),
  check: (postId) => api.get(`/likes/${postId}/check`),
  getUsers: (postId) => api.get(`/likes/${postId}/users`),
};

export default api;
