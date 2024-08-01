import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../../services/posts";
import GlobalNavBar from "../../components/Post/GlobalNavBar";

export const CreatePostForm = () => {
    const [message, setMessage] = useState("");
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
            await createPost(token, message);
            navigate("/posts");
        } catch (err) {
            console.error(err);
            navigate("/login");
        }
    };

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

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
                <input
                    id='submit'
                    type='submit'
                    value='Create Post'
                />
            </form>
        </>
    );
};
