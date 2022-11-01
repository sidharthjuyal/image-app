import * as api from '../api';
import { COMMENT, CREATE, DELETE, END_LOADING, FETCH_ALL, FETCH_BY_SEARCH, FETCH_POST, START_LOADING, UPDATE } from '../constants/actionTypes';

export const getPost = (id) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.fetchPost(id);
    dispatch({ type: FETCH_POST, payload: data });
  } catch (error) {
    console.error(error);
  } finally {
    dispatch({ type: END_LOADING });
  }
};

export const getPosts = (page) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.fetchPosts(page);
    dispatch({ type: FETCH_ALL, payload: data });
  } catch (error) {
    console.error(error);
  } finally {
    dispatch({ type: END_LOADING });
  }
};

export const getPostsBySearch = (searchQuery) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.fetchPostsBySearch(searchQuery);
    dispatch({ type: FETCH_BY_SEARCH, payload: data });
  } catch (error) {
    console.error(error);
  } finally {
    dispatch({ type: END_LOADING });
  }
};

export const createPost = (newPost, history) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.createPost(newPost);
    history.push(`/posts/${data._id}`);
    dispatch({ type: CREATE, payload: data });
  } catch (error) {
    console.error(error);
  } finally {
    dispatch({ type: END_LOADING });
  }
};

export const updatePost = (id, post) => async (dispatch) => {
  try {
    const { data } = await api.updatePost(id, post);
    dispatch({ type: UPDATE, payload: data });
  } catch (error) {
    console.error(error);
  }
};

export const deletePost = (id) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    await api.deletePost(id);
    dispatch({ type: DELETE, payload: id });
  } catch (error) {
    console.error(error);
  } finally {
    dispatch({ type: END_LOADING });
  }
};

export const likePost = (id) => async (dispatch) => {
  try {
    const { data } = await api.likePost(id);
    dispatch({ type: UPDATE, payload: data });
  } catch (error) {
    console.error(error);
  }
};

export const commentPost = (comment, id) => async (dispatch) => {
  try {
    const { data } = await api.comment(comment, id);
    dispatch({ type: COMMENT, payload: data });
    return data.comments;
  } catch (error) {
    console.error(error);
  }
};
