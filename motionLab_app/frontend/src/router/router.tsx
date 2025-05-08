import { createBrowserRouter } from "react-router-dom";
import App from "@/App";

import NotFoundPage from "@/pages/404";
import Unauthorized from "@/pages/Unauthorized";

import UserLayout from "@/layouts/UserLayout";
import LandingPage from "@/pages/User/LandingPage";

import LoginPage from "@/pages/User/Auth/Login";
import SignUpPage from "@/pages/User/Auth/SignUp";

import ForgetPasswordPage from "@/pages/User/Auth/ForgetPassword";
import ResetPasswordPage from "@/pages/User/Auth/ResetPassword";
import VerifyEmailPage from "@/pages/User/Auth/VerifyEmail";

import UploadPage from "@/pages/User/Upload/Upload"
import AboutPage from "@/pages/User/About"
import ContactPage from "@/pages/User/Contact"

import FeaturesPage from "@/pages/User/Features"
import BVHScene from "@/pages/User/Upload/BVHScene";

import Projects from "@/pages/User/Profile/Projects/Projects";
import Dashboard from "@/pages/Admin/dashboard";
import UserManagement from "@/pages/Admin/userManage";
import ProjectsOverview from "@/pages/Admin/projects";
import SystemMetrics from "@/pages/Admin/metrics";
import LogsViewer from "@/pages/Admin/logs";
import AdminProfile from "@/pages/Admin/profile";
import AdminLayout from "@/layouts/AdminLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";


import AvatarCreation from "@/pages/User/Character/AvatarCreation";
import CharactersPage from "@/pages/User/Profile/Characters";

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
                        path: "unauthorized",
                        element: <Unauthorized />,
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
                        path: "forget-password",
                        element: <ForgetPasswordPage />,
                    },
                    {
                        path: "reset-password",
                        element: <ResetPasswordPage />,
                    },
                    {
                        path: "verify-email",
                        element: <VerifyEmailPage />,
                    },
                    {
                        path: "profile",
                        children: [
                            {
                                path: "projects",
                                element: <Projects />,
                            },
                            {
                                path: "characters",
                                element: <CharactersPage />,
                            }
                        ]
                    },
                    {
                        path: "project/:projectId",  // Dynamic route with projectId
                        element: <BVHScene />
                    },
                    {
                        path: "avatar",
                        children: [
                            {
                                path: "create",
                                element: <AvatarCreation />,
                            },
                            {
                                path: "edit/:avatarId",
                                element: <AvatarCreation />,
                            },
                        ]
                    }
                ],
            },
            {
                path: "admin",
                element: <ProtectedRoute requireAdmin={true} />,
                children: [
                    {
                        path: "",
                        element: <AdminLayout />,
                        children: [
                            {
                                path: "dashboard",
                                element: <Dashboard />
                            },
                            {
                                path: "userManage",
                                element: <UserManagement />
                            },
                            {
                                path: "projects",
                                element: <ProjectsOverview />
                            },
                            {
                                path: "metrics",
                                element: <SystemMetrics />
                            },
                            {
                                path: "logs",
                                element: <LogsViewer />
                            },
                            {
                                path: "profile",
                                element: <AdminProfile />
                            }
                        ],
                    }
                ],
            },
        ],
    },
]);

export default router;