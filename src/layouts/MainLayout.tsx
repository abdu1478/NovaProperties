import { Outlet, useLocation } from "react-router-dom";
import { type ReactNode } from "react";

import DocumentHead from "@/components/DocumentHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { ROUTES } from "@/constants/routes";

type MainLayoutProps = {
  children?: ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const hideLayout = [ROUTES.SIGNIN, ROUTES.SIGNUP].includes(location.pathname);

  return (
    <>
      <DocumentHead />
      {!hideLayout && <Navbar />}

      <main
        role="main"
        tabIndex={-1}
        className="min-h-screen flex flex-col justify-between"
      >
        <Toaster position="bottom-right" richColors />
        {children || <Outlet />}
      </main>

      <Analytics />

      {!hideLayout && <Footer />}
    </>
  );
};

export default MainLayout;
