import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import sampleimage from "../../assets/image.png";
import GlobalNavBar from "../../components/Post/GlobalNavBar";

import { getUserPosts } from "../../services/posts";
import Post from "../../components/Post/Post";

export const ProfilePage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const user = localStorage.getItem("user");
    const user_name = user.name;

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const userPosts = await getUserPosts();
                setPosts(userPosts);
            } catch (err) {
                setError(err.message);
                console.log(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchPosts();
    }, []);

    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/login");
        return;
    }

    if (loading) return <div>Loading ...</div>
    if (error) return <div>error:{error}</div>

    return (
        <>
        <GlobalNavBar user_name={user_name}></GlobalNavBar>
        <br></br>
        <div className="feed" role="feed">
            {posts.map((post) => (
            <Post post={post} key={post._id} filepath={sampleimage} />
            ))}
        </div>
        <br></br>
        </>
    );
};
