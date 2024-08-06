import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import sampleimage from "../../assets/image.png";
import GlobalNavBar from "../../components/Post/GlobalNavBar";
import "./FeedPage.css";


import { getPosts } from "../../services/posts";
import Post from "../../components/Post/Post";
import Search from "../../components/Search/Search";

export const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [noPostsMessage, setnoPostsMessage] = useState("");
  // set a boolean if searching is happening or not
  const [isSearching, setIsSearching] = useState(false);
  const user = localStorage.getItem("user");
  const user_name = JSON.parse(user).name

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getPosts(token)
        .then((data) => {
          if (data === null || !data.posts.length) {
            setnoPostsMessage("No posts to display");
          } else {
            setPosts(data.posts.sort((a, b) => new Date(b.createdAt) - new Date (a.createdAt)));
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
    <div className={`feed-page ${isSearching ? 'search-active' : ''}`}>
      <GlobalNavBar user_name={user_name} />
      <br></br>
      <Search 
        navigate={navigate} 
        token={token} 
        sampleImage={sampleimage}
        setIsSearching={setIsSearching}
      />
      <div className="feed" role="feed">
        {posts.map((post) => (
          <Post post={post} key={post._id} filepath={sampleimage}/>
        ))}
      </div>
      <br />
      {noPostsMessage && <p style={{ color: "grey" }}>{noPostsMessage}</p>}
      {/* changing classname to overlay which will darken the rest of the page when someone is using the searchbar */}
      {isSearching && <div className="overlay"></div>}
    </div>
  );
};
