import React, { lazy, Suspense } from "react";
import { createBrowserRouter, useRouteError } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import MainLayout from "@/layouts/MainLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import { withAuth } from "@/contexts/AuthContext";
import { routeMeta } from "./routesMeta";
import { ErrorFallback } from "@/components/Shared/ErrorFallback";

const RouteErrorBoundary = () => {
  const error = useRouteError();
  console.error("Route Error:", error);

  return <ErrorFallback error={error} type="route" className="min-h-screen" />;
};

const ServerErrorBoundary = () => {
  const error = useRouteError();
  console.error("Server Error:", error);

  return <ErrorFallback error={error} type="500" className="min-h-screen" />;
};

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
    element: <MainLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: withSuspense(<HomePage />),
        handle: routeMeta.HOME,
        errorElement: <ServerErrorBoundary />,
      },
      {
        path: ROUTES.PROPERTIES,
        element: withSuspense(<PropertiesPage />),
        handle: routeMeta.PROPERTIES,
        errorElement: <ServerErrorBoundary />,
      },
      {
        path: ROUTES.PROPERTY_DETAIL,
        element: withSuspense(<PropertyDetailPage />),
        handle: routeMeta.PROPERTY_DETAIL,
        errorElement: <ServerErrorBoundary />,
      },
      {
        path: ROUTES.AGENTS,
        children: [
          {
            index: true,
            element: withSuspense(<AgentsPage />),
            handle: routeMeta.AGENTS,
            errorElement: <ServerErrorBoundary />,
          },
          {
            path: ROUTES.AGENT_DETAIL,
            element: withSuspense(<AgentDetailPage />),
            handle: routeMeta.AGENT_DETAIL,
            errorElement: <ServerErrorBoundary />,
          },
        ],
      },
      {
        path: ROUTES.ABOUT,
        element: withSuspense(<AboutPage />),
        handle: routeMeta.ABOUT,
        errorElement: <ServerErrorBoundary />,
      },
      {
        path: ROUTES.CONTACT,
        element: withSuspense(<ContactPage />),
        handle: routeMeta.CONTACT,
        errorElement: <ServerErrorBoundary />,
      },
      {
        path: ROUTES.FAVORITES,
        element: withSuspense(React.createElement(withAuth(Favourite))),
        handle: routeMeta.FAVORITES,
        errorElement: <ServerErrorBoundary />,
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
        errorElement: <ServerErrorBoundary />,
      },
    ],
  },

  {
    path: "*",
    element: withSuspense(<NotFoundPage />),
    handle: routeMeta.NOT_FOUND,
  },
]);

export default router;
