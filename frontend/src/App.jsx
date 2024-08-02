import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import "./GlobalNavBar.css";
import { HomePage } from "./pages/Home/HomePage";
import { LoginPage } from "./pages/Login/LoginPage";
import { SignupPage } from "./pages/Signup/SignupPage";
import { FeedPage } from "./pages/Feed/FeedPage";
import { ProfilePage } from "./pages/ProfilePage/ProfilePage";

import "bootstrap/dist/css/bootstrap.min.css";
import { CreatePostForm } from "./pages/CreatePost/CreatePostForm";


// docs: https://reactrouter.com/en/main/start/overview
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/posts",
    element: <FeedPage />,
  },
  {
    path: "/createpost",
    element: <CreatePostForm />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  }
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
