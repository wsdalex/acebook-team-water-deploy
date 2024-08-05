const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const createComment = async (token, comment, post_id) => {
  console.log("token being used ->", token);
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ comment, post_id }),
  };

  const response = await fetch(`${BACKEND_URL}/comments`, requestOptions);

  if (response.status !== 201) {
    throw new Error("Unable to create comment");
  }

  const data = await response.json();
  return data;
};
