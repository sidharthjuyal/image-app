import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_SERVER_BASE_URL
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('profile');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const fetchPost = (id) => API.get(`/posts/${id}`);
export const fetchPosts = (page) => API.get(`/posts?page=${page}`);
export const fetchPostsBySearch = (searchQuery) => API.get(`/posts/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags}`);
export const createPost = (newPost) => API.post('/posts', newPost);
export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const likePost = (id) => API.patch(`/posts/${id}/likepost`);
export const comment = (comment, id) => API.post(`/posts/${id}/commentpost`, { comment });

export const signIn = (formData) => API.post('/users/signin', formData);
export const signUp = (formData) => API.post('/users/signup', formData);
