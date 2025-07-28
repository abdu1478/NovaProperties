import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import MainLayout from "@/layouts/MainLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import { withAuth } from "@/contexts/AuthContext";
import { routeMeta } from "./routesMeta";

const withSuspense = (component: React.ReactNode) => (
  <Suspense fallback={<LoadingSpinner fullScreen />}>{component}</Suspense>
);

// Lazy-loaded pages
const HomePage = lazy(() => import("@/pages/HomePage"));
const PropertiesPage = lazy(() => import("@/pages/PropertiesPage"));
const PropertyDetailPage = lazy(() => import("@/pages/PropertyDetailPage"));
const AgentsPage = lazy(() => import("@/pages/AgentsPage"));
const AgentDetailPage = lazy(() => import("@/pages/AgentDetailPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const Favourite = lazy(() => import("@/pages/Favourite"));
const Login = lazy(() => import("@/pages/Login"));
const Signup = lazy(() => import("@/pages/Signup"));
const NotFoundPage = lazy(() => import("@/pages/NotFound"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: withSuspense(<HomePage />),
        handle: routeMeta.HOME,
      },
      {
        path: ROUTES.PROPERTIES,
        element: withSuspense(<PropertiesPage />),
        handle: routeMeta.PROPERTIES,
      },
      {
        path: ROUTES.PROPERTY_DETAIL,
        element: withSuspense(<PropertyDetailPage />),
        handle: routeMeta.PROPERTY_DETAIL,
      },
      {
        path: ROUTES.AGENTS,
        children: [
          {
            index: true,
            element: withSuspense(<AgentsPage />),
            handle: routeMeta.AGENTS,
          },
          {
            path: ROUTES.AGENT_DETAIL,
            element: withSuspense(<AgentDetailPage />),
            handle: routeMeta.AGENT_DETAIL,
          },
        ],
      },
      {
        path: ROUTES.ABOUT,
        element: withSuspense(<AboutPage />),
        handle: routeMeta.ABOUT,
      },
      {
        path: ROUTES.CONTACT,
        element: withSuspense(<ContactPage />),
        handle: routeMeta.CONTACT,
      },
      {
        path: ROUTES.FAVORITES,
        element: withSuspense(React.createElement(withAuth(Favourite))),
        handle: routeMeta.FAVORITES,
      },
    ],
  },
  {
    path: ROUTES.SIGNIN,
    element: withSuspense(<Login />),
    handle: routeMeta.SIGNIN,
  },
  {
    path: ROUTES.SIGNUP,
    element: withSuspense(<Signup />),
    handle: routeMeta.SIGNUP,
  },
  {
    path: "*",
    element: withSuspense(<NotFoundPage />),
    handle: routeMeta.NOT_FOUND,
  },
]);

export default router;
