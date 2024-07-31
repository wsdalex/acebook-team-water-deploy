import Toast from 'react-bootstrap/Toast';

const Post = (props) => {
  return (
  <div className="d-flex justify-content-center">
    <Toast style = {{width: "60%"}}>
    <Toast.Header>
    <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
    <strong className="me-auto">*Insert User ID*</strong>
    <small>Posted on {props.post.message.substr(-20)}</small>
    </Toast.Header>
    <Toast.Body><article key={props.post._id}>{props.post.message}</article><br></br><img src={props.filepath}style={{
          width: "80%"}} ></img></Toast.Body><br></br>
</Toast>
</div>
);
};

export default Post;
