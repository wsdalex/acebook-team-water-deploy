import Toast from 'react-bootstrap/Toast';
import moment from 'moment';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import "./Post.css";

const Post = (props) => {

  const navigate = useNavigate()

  const handleAddComment = () => {
    localStorage.setItem("post_id", props.post._id)
    navigate("/addcomment")

  }
  const userName = props.post.user_id.name
  const profileImage = props.post.user_id.profileImage
  const formattedDate = moment(props.post.createdAt).fromNow();
  const image = props.post.imageUrl;

  return (
  <div className="d-flex justify-content-center">
    <Toast style = {{width: "60%"}}>
    <Toast.Header>
    <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />

    <img src={profileImage ? profileImage : "holder.js/20x20?text=%20"} className="rounded me-2 profile-image" alt="Profile" />
    <strong className="me-auto">{userName ? userName : ""}</strong> {/* Added user details in posts controller in backend to be used here */}
    <small>Posted {formattedDate}</small>

    </Toast.Header>
    <Toast.Body><article key={props.post._id}>{props.post.message}</article><br></br><img src={image ? image : props.filepath}style={{
          width: "80%"}} ></img></Toast.Body><br></br>
          <Button onClick={handleAddComment}>Add a comment</Button>
</Toast>
</div>
);
};

export default Post;
