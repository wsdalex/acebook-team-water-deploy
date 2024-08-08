import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import sampleimage from "../../assets/image.png";
import GlobalNavBar from "../../components/Post/GlobalNavBar";

import { getUserPosts } from "../../services/posts";
import Post from "../../components/Post/Post";
import "./ProfilePage.css";

export const ProfilePage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(`user -> ${JSON.stringify(user)}`);
    const user_name = user.name;
    const profileImage = user.profileImage;

    useEffect(() => {
        const fetchPosts = async () => {

            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }   

            try {
                const userPosts = await getUserPosts(token);
                setPosts(userPosts.sort((a, b) => new Date(b.createdAt) - new Date (a.createdAt)));
            } catch (err) {
                setError(err.message);
                console.log(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchPosts();
    }, [navigate]);

    if (loading) return <div>Loading ...</div>
    if (error) return <div>error:{error}</div>

    return (
        <>
        <GlobalNavBar user_name={user_name}></GlobalNavBar>
        <br></br>
        <div className="profile-image-container">
            <img src={profileImage} className="profile-page-image" alt="Profile"/>
        </div>
        <div className="feed" role="feed">
            {posts && posts.length > 0 ? ( // added conditions to show message if no posts
                posts.map((post) => (
                    <Post post={post} key={post._id} filepath={sampleimage} />
                ))
            ) : ( //automatically renders comments as they are part of post component
                <p>No posts to display</p>
            )}
        </div>
        <br></br>
        </>
    );
};
