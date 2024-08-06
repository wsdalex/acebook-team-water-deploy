import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../../services/posts";
import GlobalNavBar from "../../components/Post/GlobalNavBar";

const fakePost = {
    message: "test message",
    user_id: "test id",
    imageUrl: "test image",
    comments: []
}

export const UpdatePostForm = () => {
    const [message, setMessage] = useState(fakePost.message); // Update when backend created
    const [imageUrl, setImageUrl] = useState(fakePost.imageUrl);
    // const navigate = useNavigate();

    const handleSubmit = async (event) => {

        event.preventDefault();
        const token = localStorage.getItem("token")

        if (!token) {
            console.error("no token found");
            navigate("/login");
            return;
        }

        try {
            // await createPost(token, message, imageUrl); Update when backend is complete 
            navigate("/posts");
        } catch (err) {
            console.error(err);
            navigate("/login");
        }
    };

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    const handleImageUrlChange = (event) => {
        setImageUrl(event.target.value)
    }

    return (
        <>
        <GlobalNavBar />
            <h2>Update Post</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor='message'>Message:</label>
                <input
                    id='message'
                    type='text'
                    value={message}
                    onChange={handleMessageChange}
                />
                <label htmlFor='imageUrl'>Image Url:</label>

                <input
                    id='imageUrl'
                    type='text'
                    value={imageUrl}
                    onChange={handleImageUrlChange}
                />
                <input
                    id='submit'
                    type='submit'
                    value='Update Post'
                />
            </form>
        </>
    );
};