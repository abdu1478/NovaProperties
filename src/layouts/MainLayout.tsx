import DocumentHead from "@/components/DocumentHead";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
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
      <Analytics />
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
