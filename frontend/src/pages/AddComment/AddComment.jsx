import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createComment } from "../../services/comments";
import GlobalNavBar from "../../components/Post/GlobalNavBar";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export const AddComment = () => {
  const navigate = useNavigate()

  const [comment, setComment] = useState("");

  const handleCommentChange = (event) => {
      setComment(event.target.value);
  };

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
        await createComment(token, comment, post_id); 
        navigate("/posts");
      } catch (err) {
        console.error(err);
        navigate("/posts");
    }
  };

return (
  <Form onSubmit={handleSubmit}>
    <Form.Group className="mb-3" controlId="formComment">
      <Form.Label>Add a comment:</Form.Label>
      <Form.Control type="comment" placeholder="Add comment..." 
      onChange={handleCommentChange}/>
    </Form.Group>
    <Button variant="primary" type="submit">
      Submit
    </Button>
  </Form>
  )
};




