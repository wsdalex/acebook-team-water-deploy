import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import sampleimage from "../../assets/image.png";
import GlobalNavBar from "../../components/Post/GlobalNavBar";


import { getPosts } from "../../services/posts";
import Post from "../../components/Post/Post";

export const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [noPostsMessage, setnoPostsMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getPosts(token)
        .then((data) => {
          if (data === null || !data.posts.length) {
            setnoPostsMessage("No posts to display");
          } else {
            setPosts(data.posts);
            localStorage.setItem("token", data.token);
          }
        })
        .catch((err) => {
          console.error(err);
          navigate("/login");
        });
    }
  }, [navigate]);

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }

  return (
    <>
      <GlobalNavBar></GlobalNavBar>
      <br></br>
      <div className="feed" role="feed">
        {posts.map((post) => (
          <Post post={post} key={post._id} filepath={sampleimage}/>
        ))}
      </div>
      <br></br>
      {noPostsMessage && <p style={{ color: "grey" }}>{noPostsMessage}</p>}
    </>
  );
};
