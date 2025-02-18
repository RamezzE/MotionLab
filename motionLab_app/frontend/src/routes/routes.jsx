import { createBrowserRouter } from "react-router-dom";
import App from "../App";

import NotFoundPage from "../pages/404";

import UserLayout from "../layouts/UserLayout";
import AuthLayout from "../layouts/AuthLayout"
import LandingPage from "../pages/User/LandingPage";

import LoginPage from "../pages/User/Auth/Login";
import SignUpPage from "../pages/User/Auth/SignUp";

import UploadPage from "../pages/User/Upload/Upload"
import AboutPage from  "../pages/User/About"
import ContactPage from "../pages/User/Contact"

import FeaturesPage from "../pages/User/Features"
import BVHScene from "../pages/User/Upload/BVHScene";

import Projects from "../pages/User/Profile/Projects/Projects";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <UserLayout />,
        children: [
          {
            path: "",
            element: <LandingPage />,
          },
          {
            path: "*",
            element: <NotFoundPage />,
          },
          {
            path: "upload",
            element: <UploadPage />,
          },
          {
            path: "bvh-viewer",
            element: <BVHScene />, // Add the BVHViewer route here
          },
          {
            path: "about",
            element: <AboutPage />,
          },
          {
            path: "contact",
            element: <ContactPage />,
          },
          {
            path: "features",
            element: <FeaturesPage />,
          },
          {
            path: "login",
            element: <LoginPage />,
          },
          {
            path: "signup",
            element: <SignUpPage />,
          },
          {
            path: "profile",
            children: [
              {
                path: "projects",
                element: <Projects />,
              }
            ]
          },
          {
            path: "project/:projectId",  // Dynamic route with projectId
            element: <BVHScene /> 
        }
        ],
      },
    ],
  },
]);

export default router;