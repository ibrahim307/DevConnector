import axios from "axios";
import {
  ADD_POST,
  GET_POSTS,
  GET_ERRORS,
  GET_POST,
  POST_LOADING,
  DELETE_POST,
  CLEAR_ERRORS
} from "./Types";

// Add post
export const addPost = (postData) => (dispatch) => {
  dispatch(clearErrors())
  axios
    .post("/routes/api/posts", postData)
    .then((res) =>
      dispatch({
        type: ADD_POST,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
       payload:err.response.data
      })
    );
};

// GET Posts
export const getPosts = () => (dispatch) => {
  dispatch(setPostLoading());
  axios
    .get("/routes/api/posts")
    .then((res) =>
      dispatch({
        type: GET_POSTS,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_POSTS,
        payload: null,
      })
    );
};
// GET Post
export const getPost = (id) => (dispatch) => {
  dispatch(setPostLoading());
  axios
    .get(`/routes/api/posts/${id}`)
    .then((res) =>
      dispatch({
        type: GET_POST,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_POSTS,
        payload: null,
      })
    );
};
// Delete Post
export const deletePost = (id) => (dispatch) => {
  axios
    .delete(`/routes/api/posts/${id}`)
    .then((res) =>
      dispatch({
        type: DELETE_POST,
        payload: id,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};
// Add like
export const likePost = (id) => (dispatch) => {
  axios
    .post(`/routes/api/posts/like/${id}`)
    .then(res => dispatch(getPosts()))
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};
// Remove like
export const removeLike = (id) => (dispatch) => {
  axios
    .post(`/routes/api/posts/unlike/${id}`)
    .then((res) => dispatch(getPosts()))
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};
// Add comment
export const addComment = (postId, commentData) => (dispatch) => {
  dispatch(clearErrors())
  axios
    .post(`/routes/api/posts/comment/${postId}`, commentData)
    .then((res) =>
      dispatch({
        type: GET_POST,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
       payload:err.response.data
      })
    );
};
// delete Comment
export const deleteComment = (postId, commentId) => (dispatch) => {
  axios
    .delete(`/routes/api/posts/comment/${postId}/${commentId}`)
    .then((res) =>
      dispatch({
        type: GET_POST,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
       payload:err.response.data
      })
    );
};
// SET loading state
export const setPostLoading = () => {
  return {
    type: POST_LOADING,
  };
};

//Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS,
  };
};
