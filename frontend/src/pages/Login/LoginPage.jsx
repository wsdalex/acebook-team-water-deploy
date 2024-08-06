import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GlobalNavBar from "../../components/Post/GlobalNavBar";
import { login } from "../../services/authentication";
import "./loginPage.css";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const session = await login(email, password);
      const token = session.token;
      const user = session.user;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      console.log("logged in user's token -> " + token);
      navigate("/posts");
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message);
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <>
      <GlobalNavBar></GlobalNavBar>
      <br></br>
      <h2>Login</h2>
      <div id="instructions">Enter your login details:</div>
      <form onSubmit={handleSubmit}>
        <div className="label-input-container">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className="label-input-container">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <input role="submit-button" id="submit" type="submit" value="Submit" />
      </form>
      <br />
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </>
  );
};
