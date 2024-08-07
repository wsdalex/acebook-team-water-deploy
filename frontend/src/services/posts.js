// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getPosts = async (token) => {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(`${BACKEND_URL}/posts/all`, requestOptions);

  if (response.status !== 200) {
    throw new Error("Unable to fetch posts");
  }

  const data = await response.json();
  return data;
};

export const createPost = async (token, message, imageUrl) => {
  console.log("token being used ->", token);
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message, imageUrl }),
  };

  const response = await fetch(`${BACKEND_URL}/posts`, requestOptions);

  if (response.status !== 201) {
    throw new Error("Unable to create post");
  }

  const data = await response.json();
  return data;
};

export const getUserPosts = async (token) => {
  // readded token to be passed as an argument
  if (!token) {
    throw new Error("No token found");
  }
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(`${BACKEND_URL}/posts/user`, requestOptions); //post router changed to allow for two get requests

  if (response.status !== 200) {
    throw new Error("Unable to fetch posts");
  }

  const data = await response.json();
  return data.posts;
};

export const updatePost = async (token, message, imageUrl, post_id) => {
  console.log("token being used ->", token);
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message, imageUrl }),
  };

  const response = await fetch(
    `${BACKEND_URL}/posts/${post_id}`,
    requestOptions
  );

  if (response.status !== 200) {
    throw new Error("Unable to update post");
  }
    const data = await response.json();
  return data;
};

export const likePost = async (token, postId) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(`${BACKEND_URL}/posts/${postId}/like`, requestOptions);

  if (!response.ok) {
    throw new Error("Failed to update like");
  }

  const data = await response.json();
  return data;
};
