import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./components/theme-provider";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import { AuthProvider } from "./contexts/AuthContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <GoogleOAuthProvider clientId={clientId}>
          <AuthProvider>
            <FavoritesProvider>
              <RouterProvider router={router} />
            </FavoritesProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
