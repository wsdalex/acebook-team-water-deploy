import Toast from "react-bootstrap/Toast";
import moment from "moment";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useState } from "react";
import { likePost } from "../../services/posts";
import "./Post.css";

const Post = (props) => {
    const navigate = useNavigate();
    const [liked, setLiked] = useState(props.post.isLikedByUser);
    const [numberOfLikes, setNumberOfLikes] = useState(
        props.post.numberOfLikes
    );

    const handleAddComment = () => {
        localStorage.setItem("post_id", props.post._id);
        navigate("/addcomment");
    };

    const handleLike = async () => {
        try {
            const token = localStorage.getItem("token");
            const data = await likePost(token, props.post._id);
              setLiked(!liked);
              setNumberOfLikes(data.numberOfLikes);
        } catch (error) {
            console.log(error);
        }
    };

    const userName = props.post.user_id.name;
    const formattedDate = moment(props.post.createdAt).fromNow();
    const image = props.post.imageUrl;
    const comments = props.post.comments;
    const profileImage = props.post.user_id.profileImage
    return (
        <div className='d-flex justify-content-center'>
            <Toast style={{ width: "60%" }}>
                <Toast.Header>
                    <img
                        src='holder.js/20x20?text=%20'
                        className='rounded me-2'
                        alt=''
                    />
                    <img src={profileImage ? profileImage : "holder.js/20x20?text=%20"} className="rounded me-2 profile-image" alt="Profile" />
                    <strong className='me-auto'>
                        {userName ? userName : ""}
                    </strong>{" "}
                    {/* Added user details in posts controller in backend to be used here */}
                    <Button variant='link' onClick={handleLike}>
                        {liked ? <FaHeart color='red' data-testid="filled-heart-icon" /> : <FaRegHeart />}
                        <span>{numberOfLikes}</span>
                    </Button>
                    <small>Posted {formattedDate}</small>
                </Toast.Header>
                <Toast.Body>
                    <article key={props.post._id}>{props.post.message}</article>
                    <br></br>
                    <img
                        src={image ? image : props.filepath}
                        style={{
                            width: "80%",
                        }}
                    ></img>
                </Toast.Body>
                <br></br>
                <Button onClick={handleAddComment}>Add a comment</Button>
                          <br />
          <br /> 
          <div className="comments-section">
            <h5>Comments</h5>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="comment">
                  <p><strong>{comment.user_id.name}</strong>: {comment.comment}</p>
                  </div>
              ))
            ) : (
              <p>No comments yet. Be the first to comment!</p>
            )}
          </div>
            </Toast>
        </div>
    );

};
//line 37 is where comments added to post starts
export default Post;
