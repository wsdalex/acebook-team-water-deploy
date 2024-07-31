import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { signup } from "../../services/authentication";

export const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  

  

  const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  
    const handleSubmit = async (event) => {
      event.preventDefault();
      if (!isValidEmail(email)) {
        setErrorMessage("Invalid email address format");
        return;
      } else if (password != confirmPassword) {
        setErrorMessage("Passwords do not match")
      } else {
        try {
          await signup(name, email, password);
          console.log("redirecting...:");
          navigate("/login");
        } catch (err) {
          console.error(err);
          navigate("/signup");
        }

    }
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  return (
    <>
      <h2>Signup</h2>
      <div id="instructions">Enter your details to sign up:</div>
      <form onSubmit={handleSubmit}>
        <div className="label-input-container">
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={handleNameChange}
        />
        </div>
        <div className="label-input-container">
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={handleEmailChange}
        />
        </div>
        <div className="label-input-container">
        <label htmlFor="password">Password:</label>
        <input
          placeholder="Password"
          id="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
        </div>
        <div className="label-input-container">
        <label htmlFor="password">Confirm Password:</label>
        <input
          placeholder="Password"
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />
        </div>
        <input role="submit-button" id="submit" type="submit" value="Submit" />
      </form>
      <br />
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </>
  );
};

