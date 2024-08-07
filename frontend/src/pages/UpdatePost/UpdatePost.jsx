import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updatePost } from "../../services/posts";
import GlobalNavBar from "../../components/Post/GlobalNavBar";


export const UpdatePostForm = () => {
    const oldMessage = localStorage.getItem("message")
    const oldImageUrl = localStorage.getItem("imageUrl")
    const [message, setMessage] = useState(oldMessage); // Update when backend created
    const [imageUrl, setImageUrl] = useState(oldImageUrl);
    const navigate = useNavigate();
    const handleSubmit = async (event) => {

        event.preventDefault();
        const token = localStorage.getItem("token")
        const post_id = localStorage.getItem("post_id")

        if (!token) {
            console.error("no token found");
            navigate("/login");
            return;
        }

        try {
            await updatePost(token, message, imageUrl, post_id);
            console.log("post has been updated")
            navigate("/profile");
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

