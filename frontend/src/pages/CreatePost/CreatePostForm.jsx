import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../../services/posts";
import GlobalNavBar from "../../components/Post/GlobalNavBar";

export const CreatePostForm = () => {
    const [message, setMessage] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {

        event.preventDefault();
        const token = localStorage.getItem("token")

        if (!token) {
            console.error("no token found");
            navigate("/login");
            return;
        }

        try {
            await createPost(token, message, imageUrl);
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
            <h2>Create Post</h2>
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
                    value='Create Post'
                />
            </form>
        </>
    );
};
