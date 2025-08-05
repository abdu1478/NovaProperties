import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface SignupResponse {
  message: string;
}
interface LoginResponse {
  message: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: {
    email: string;
    password: string;
  }) => Promise<LoginResponse>;
  logout: () => Promise<boolean>;
  signup: (credentials: {
    email: string;
    password: string;
    name: string;
  }) => Promise<SignupResponse>;
  redirectTo: string | null;
  setRedirectTo: (path: string | null) => void;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [redirectTo, _setRedirectTo] = useState<string | null>(null);

  const setRedirectTo = useCallback((path: string | null) => {
    if (path) {
      localStorage.setItem("redirectTo", path);
    } else {
      localStorage.removeItem("redirectTo");
    }
    _setRedirectTo(path);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/auth/me`, {
          withCredentials: true,
        });

        setUser({
          id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
        });
      } catch (err: unknown) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      setIsLoading(true);
      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/login`,
          { email, password },
          { withCredentials: true }
        );

        const res = await axios.get(`${API_BASE_URL}/auth/me`, {
          withCredentials: true,
        });

        setUser({
          id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
        });

        return response.data || "Wellcome back";
      } catch (error: unknown) {
        let message = "Login failed";

        if (axios.isAxiosError(error)) {
          message = error.response?.data?.message || error.message;
        } else if (error instanceof Error) {
          message = error.message;
        }

        throw new Error(message);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const signup = useCallback(
    async (credentials: {
      email: string;
      password: string;
      name: string;
    }): Promise<SignupResponse> => {
      setIsLoading(true);
      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/register`,
          credentials,
          {
            withCredentials: true,
          }
        );
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 409) {
            throw new Error("Email already registered");
          }
        }
        throw new Error("Signup failed");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await axios.get(`${API_BASE_URL}/auth/logout`, {
        withCredentials: true,
      });
      setUser(null);
      return true;
    } catch (err) {
      console.error("Logout failed", err);
      return false;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        signup,
        redirectTo,
        setRedirectTo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return function WithAuthComponent(props: P) {
    const { isAuthenticated, isLoading, setRedirectTo } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        setRedirectTo(location.pathname);
        navigate("/signin");
      }
    }, [isAuthenticated, isLoading, location.pathname]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      );
    }

    return isAuthenticated ? <Component {...props} /> : null;
  };
};

export const withoutAuth = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return function WithoutAuthComponent(props: P) {
    const { isAuthenticated, isLoading, redirectTo } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!isLoading && isAuthenticated) {
        navigate(redirectTo || "/");
      }
    }, [isAuthenticated, isLoading, redirectTo]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      );
    }

    return !isAuthenticated ? <Component {...props} /> : null;
  };
};

export const withRole = <P extends object>(
  Component: React.ComponentType<P>,
  requiredRole: string
) => {
  return function WithRoleComponent(props: P) {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      );
    }

    if (!isAuthenticated || user?.role !== requiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          Unauthorized
        </div>
      );
    }

    return <Component {...props} />;
  };
};
