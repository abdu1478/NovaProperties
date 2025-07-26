import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import { withAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/constants/routes";

// pages
const Favourite = lazy(() => import("@/pages/Favourite"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const AgentsPage = lazy(() => import("@/pages/AgentsPage"));
const PropertiesPage = lazy(() => import("@/pages/PropertiesPage"));
const HomePage = lazy(() => import("@/pages/HomePage"));
const ListingsPage = lazy(() => import("@/pages/Listings"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const AgentDetailPage = lazy(() => import("@/pages/AgentDetailPage"));
const PropertyDetailPage = lazy(() => import("@/pages/PropertyDetailPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFound"));
const Login = lazy(() => import("@/pages/Login"));
const Signup = lazy(() => import("@/pages/Signup"));

const withSuspense = (element: React.ReactNode) => (
  <Suspense fallback={<LoadingSpinner fullScreen />}>{element}</Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: withSuspense(<HomePage />),
        handle: {
          title: "Nova Properties | Find Your Dream Home",
          description:
            "Discover premium real estate listings with Nova Properties.",
        },
      },
      {
        path: ROUTES.PROPERTIES,
        element: withSuspense(<PropertiesPage />),
        handle: {
          title: "Properties | Nova Properties",
          description:
            "Explore a wide range of properties available for sale and rent.",
        },
        children: [
          {
            path: "listings",
            element: withSuspense(<ListingsPage />),
            handle: {
              title: "All Listings | Nova Properties",
              description:
                "View all available property listings, both for sale and rent.",
            },
          },
        ],
      },
      {
        path: ROUTES.PROPERTY_DETAIL,
        element: withSuspense(<PropertyDetailPage />),
        handle: {
          title: "Property Details | Nova Properties",
          description:
            "View images, pricing, and full details for selected property.",
        },
      },
      {
        path: ROUTES.AGENTS,
        children: [
          {
            index: true,
            element: withSuspense(<AgentsPage />),
            handle: {
              title: "Meet Our Agents | Nova Properties",
              description: "Connect with top-rated real estate professionals.",
            },
          },
          {
            path: ROUTES.AGENT_DETAIL,
            element: withSuspense(<AgentDetailPage />),
            handle: {
              title: "Agent Profile | Nova Properties",
              description:
                "View detailed profiles and contact info for our agents.",
            },
          },
        ],
      },
      {
        path: ROUTES.ABOUT,
        element: withSuspense(<AboutPage />),
        handle: {
          title: "About Us | Nova Properties",
          description: "Learn more about Nova Properties and our mission.",
        },
      },
      {
        path: ROUTES.CONTACT,
        element: withSuspense(<ContactPage />),
        handle: {
          title: "Contact Us | Nova Properties",
          description: "Get in touch with our team for inquiries or support.",
        },
      },
      {
        path: ROUTES.FAVORITES,
        element: withSuspense(React.createElement(withAuth(Favourite))),
        handle: {
          title: "Favorites | Nova Properties",
        },
      },
    ],
  },
  {
    path: ROUTES.SIGNIN,
    element: withSuspense(<Login />),
    handle: {
      title: "Sign In | Nova Properties",
      description: "Sign in to access your account.",
    },
  },
  {
    path: ROUTES.SIGNUP,
    element: withSuspense(<Signup />),
    handle: {
      title: "Create Account | Nova Properties",
      description: "Sign up and start exploring properties.",
    },
  },
  {
    path: "*",
    element: <MainLayout>{withSuspense(<NotFoundPage />)}</MainLayout>,
    handle: {
      title: "Page Not Found | Nova Properties",
      description: "Sorry, the page you're looking for doesn't exist.",
    },
  },
]);

export default router;
