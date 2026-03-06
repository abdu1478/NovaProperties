import { Outlet } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import MainLayout from "@/layouts/MainLayout";
import { FavoritesProvider } from "@/contexts/FavoritesContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <MainLayout>
        <FavoritesProvider>
          <Outlet />
        </FavoritesProvider>
      </MainLayout>
    </AuthProvider>
  );
}
