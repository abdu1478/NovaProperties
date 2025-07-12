import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  getAccessToken: () => string | null;
  redirectTo: string | null;
  setRedirectTo: (path: string | null) => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Token storage with encryption (simplified)
const secureStorage = {
  getItem: (key: string): string | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? atob(item) : null;
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    localStorage.setItem(key, btoa(value));
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [redirectTo, _setRedirectTo] = useState<string | null>(
    localStorage.getItem("redirectTo") || null
  );

  const setRedirectTo = useCallback((path: string | null) => {
    if (path) {
      localStorage.setItem("redirectTo", path);
    } else {
      localStorage.removeItem("redirectTo");
    }
    _setRedirectTo(path);
  }, []);
  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = secureStorage.getItem("user");
        const accessToken = secureStorage.getItem("accessToken");

        if (storedUser && accessToken) {
          // Validate token on initialization
          const isValid = await validateToken(accessToken);

          if (isValid) {
            setUser(JSON.parse(storedUser));
          } else {
            // Attempt to refresh token if invalid
            await refreshToken();
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Token validation (simulated)
  const validateToken = async (token: string): Promise<boolean> => {
    // In a real app, this would make an API call to validate the token
    return new Promise((resolve) => {
      // Simulate API call
      setTimeout(() => {
        // Simple expiration check (not secure in real-world)
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          resolve(payload.exp * 1000 > Date.now());
        } catch {
          resolve(false);
        }
      }, 500);
    });
  };

  // Refresh token functionality
  const refreshToken = useCallback(async (): Promise<void> => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      const refreshToken = secureStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token available");

      // Simulated API call to refresh token
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) throw new Error("Token refresh failed");

      const { accessToken, refreshToken: newRefreshToken } =
        await response.json();

      secureStorage.setItem("accessToken", accessToken);
      secureStorage.setItem("refreshToken", newRefreshToken);
    } catch (error) {
      console.error("Token refresh error:", error);
      logout();
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  const login = useCallback(
    async (credentials: { email: string; password: string }): Promise<void> => {
      const { email, password } = credentials;
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/auth/signin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          const message =
            response.status === 401
              ? "Invalid credentials"
              : errorData.message || "Login failed";
          const error = new Error(message);
          console.error("Login error:", error);
          throw error;
        }

        const { user, accessToken, refreshToken } = await response.json();

        secureStorage.setItem("accessToken", accessToken);
        secureStorage.setItem("refreshToken", refreshToken);
        secureStorage.setItem("user", JSON.stringify(user));

        setUser(user);
        setRedirectTo(null);
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback((): void => {
    secureStorage.removeItem("accessToken");
    secureStorage.removeItem("refreshToken");
    secureStorage.removeItem("user");

    setUser(null);

    fetch(`${API_BASE_URL}/auth/logout`, { method: "POST" }).catch(console.error);
  }, []);

  const getAccessToken = useCallback((): string | null => {
    return secureStorage.getItem("accessToken");
  }, []);

  useEffect(() => {
    const checkTokenExpiration = async () => {
      const accessToken = getAccessToken();
      if (!accessToken) return;

      try {
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        const expiresIn = payload.exp * 1000 - Date.now();

        if (expiresIn < 300000) {
          await refreshToken();
        }
      } catch (error) {
        console.error("Token expiration check error:", error);
      }
    };

    const interval = setInterval(checkTokenExpiration, 60000);
    return () => clearInterval(interval);
  }, [getAccessToken, refreshToken]);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshToken,
    getAccessToken,
    redirectTo,
    setRedirectTo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

import { useLocation, useNavigate } from "react-router-dom";

export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  const AuthenticatedComponent: React.FC<P> = (props) => {
    const { isAuthenticated, isLoading, setRedirectTo } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        setRedirectTo(location.pathname);
        navigate("/signin", { replace: true });
      }
    }, [isAuthenticated, isLoading]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          Redirecting to sign in...
        </div>
      );
    }

    return <Component {...props} />;
  };

  return AuthenticatedComponent;
};

// Higher-order component for role-based access
export const withRole = <P extends object>(
  Component: React.ComponentType<P>,
  requiredRole: string
): React.FC<P> => {
  const AuthorizedComponent: React.FC<P> = (props) => {
    const { user, isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
      if (!isLoading && isAuthenticated && user?.role !== requiredRole) {
        window.location.href = "/unauthorized";
      }
    }, [isAuthenticated, isLoading, user]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          Redirecting to login...
        </div>
      );
    }

    if (user?.role !== requiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          Checking permissions...
        </div>
      );
    }

    return <Component {...props} />;
  };

  return AuthorizedComponent;
};
