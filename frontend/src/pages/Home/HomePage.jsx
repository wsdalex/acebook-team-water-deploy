import { Link } from "react-router-dom";
import GlobalNavBar from "../../components/Post/GlobalNavBar";
import "./HomePage.css";

export const HomePage = () => {
  return (
    <>
      <GlobalNavBar></GlobalNavBar>
      <br></br>
      <div className="home">
        <h1>Welcome to Acebook!</h1>
        <Link to="/signup">Sign Up</Link>
        <Link to="/login">Log In</Link>
      </div>
    </>
  );
};
