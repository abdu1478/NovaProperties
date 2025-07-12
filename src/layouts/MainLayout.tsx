import DocumentHead from "@/components/DocumentHead";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Toaster } from "sonner";

type MainLayoutProps = {
  children?: ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const hideLayout = ["/login", "/register"].includes(location.pathname);
  return (
    <>
      <DocumentHead />
      {!hideLayout && <Navbar />}
      <main role="main" tabIndex={-1}>
        {children || <Outlet />}
      </main>
      <Toaster />
      {!hideLayout && <Footer />}
    </>
  );
};

// function MainLayout() {
//   return (
//     <>
//       <DocumentHead />
//       <Navbar />
//       <main role="main" tabIndex={-1}>
//         <Outlet />
//       </main>
//       <Footer />
//     </>
//   );
// }

export default MainLayout;
