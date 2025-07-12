import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import { withAuth } from "@/contexts/AuthContext";

const lazyLoad = (path: string) =>
  lazy(() =>
    import(`@/pages/${path}.tsx`).catch(() => {
      const fullPath = `@/pages/${path}`;
      console.error(`Failed to load component at ${fullPath}`);
      console.error(`Failed to load page: ${path}`);
      return import("@/pages/NotFound");
    })
  );

const Favourite = lazyLoad("Favourite");
const PropertiesPage = lazyLoad("PropertiesPage");
const HomePage = lazyLoad("HomePage");
const ListingsPage = lazyLoad("Listings");
const AboutPage = lazyLoad("AboutPage");
const ContactPage = lazyLoad("ContactPage");
const AgentsPage = lazyLoad("AgentsPage");
const AgentDetailPage = lazyLoad("AgentDetailPage");
const PropertyDetailPage = lazyLoad("PropertyDetailPage");
const NotFoundPage = lazyLoad("NotFound");
const Login = lazyLoad("Login");
const Signup = lazyLoad("Signup");

// Reusable suspense wrapper
const withSuspense = (element: React.ReactNode) => (
  <Suspense fallback={<LoadingSpinner fullScreen />}>{element}</Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: withSuspense(<NotFoundPage />),
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
      // Sign in route
      {
        index: true,
        element: withSuspense(<Login />),
      },

      // Property listing routes
      {
        path: "properties",
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
        path: "properties/:id",
        element: withSuspense(<PropertyDetailPage />),
        handle: {
          title: "Property Details | Nova Properties",
          description:
            "View images, pricing, and full details for selected property.",
        },
      },

      // Agent routes
      {
        path: "agents",
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
            path: ":id",
            element: withSuspense(<AgentDetailPage />),
            handle: {
              title: "Agent Profile | Nova Properties",
              description:
                "View detailed profiles and contact info for our agents.",
            },
          },
        ],
      },

      // Static pages
      {
        path: "about-us",
        element: withSuspense(<AboutPage />),
        handle: {
          title: "About Us | Nova Properties",
          description: "Learn more about Nova Properties and our mission.",
        },
      },
      {
        path: "contact",
        element: withSuspense(<ContactPage />),
        handle: {
          title: "Contact Us | Nova Properties",
          description: "Get in touch with our team for inquiries or support.",
        },
      },
      {
        path: "favorite",
        element: withSuspense(React.createElement(withAuth(Favourite))),
        handle: {
          title: "Favorites | Nova Properties",
        },
      },
    ],
  },
  // Auth route
  {
    path: "/signin",
    element: withSuspense(<Login />),
    handle: {
      title: "Sign In | Nova Properties",
      description: "Sign in to access your account.",
    },
  },
  {
    path: "/signup",
    element: withSuspense(<Signup />),
    handle: {
      title: "Create Account | Nova Properties",
      description: "Sign up and start exploring properties.",
    },
  },

  // 404 handling
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
