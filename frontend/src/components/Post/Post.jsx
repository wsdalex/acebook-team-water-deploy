import Toast from 'react-bootstrap/Toast';
import moment from 'moment';

const Post = (props) => {

  const formattedDate = moment(props.post.createdAt).fromNow();
  return (
  <div className="d-flex justify-content-center">
    <Toast style = {{width: "60%"}}>
    <Toast.Header>
    <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />

    <strong className="me-auto">{props.post.user_id.name}</strong> {/* Added user details in posts controller in backend to be used here */}
    <small>Posted {formattedDate}</small>

    </Toast.Header>
    <Toast.Body><article key={props.post._id}>{props.post.message}</article><br></br><img src={props.filepath}style={{
          width: "80%"}} ></img></Toast.Body><br></br>
</Toast>
</div>
);
};

export default Post;
