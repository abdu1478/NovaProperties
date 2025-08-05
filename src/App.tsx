import { ThemeProvider } from "./components/theme-provider";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import { AuthProvider } from "./contexts/AuthContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "@/components/Shared/ErrorFallback";
import { CounterProvider } from "@/contexts/CounterContext";

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <AuthProvider>
          <FavoritesProvider>
            <CounterProvider>
              <RouterProvider router={router} />
            </CounterProvider>
          </FavoritesProvider>
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
