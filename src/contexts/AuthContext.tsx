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
import { type CredentialResponse } from "@react-oauth/google";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}
interface SignupResponse {
  message: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<boolean>;
  signup: (credentials: {
    email: string;
    password: string;
    name: string;
  }) => Promise<SignupResponse>;
  redirectTo: string | null;
  setRedirectTo: (path: string | null) => void;
  googleLogin: (res: CredentialResponse) => Promise<void>;
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

  // Check initial auth status
  useEffect(() => {
    const initialAuth = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/auth/me`, {
          withCredentials: true,
        });

        if (response.status === 200) {
          setUser({
            id: response.data._id,
            name: response.data.name,
            email: response.data.email,
            role: response.data.role,
          });
        }
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initialAuth();
  }, []);

  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      setIsLoading(true);
      try {
        await axios.post(`${API_BASE_URL}/auth/login`, credentials, {
          withCredentials: true,
        });

        const userResponse = await axios.get(`${API_BASE_URL}/auth/me`, {
          withCredentials: true,
        });

        setUser({
          id: userResponse.data._id,
          name: userResponse.data.name,
          email: userResponse.data.email,
          role: userResponse.data.role,
        });
      } catch (error) {
        setUser(null);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const googleLogin = async (response: CredentialResponse) => {
    try {
      const result = await axios.post(
        `${API_BASE_URL}/auth/google`,
        { token: response.credential },
        { withCredentials: true }
      );

      const { user } = result.data;
      setUser({
        id: user._id || user.id, // Handle both _id and id
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (err) {
      console.error("Google login failed:", err);
      setUser(null);
    }
  };

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
      return true; // Indicate success
    } catch (error) {
      console.error("Logout error:", error);
      return false; // Indicate failure
    }
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    signup,
    redirectTo,
    setRedirectTo,
    googleLogin,
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

// HOC for protected routes
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
    }, [isAuthenticated, isLoading, location]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      );
    }

    return isAuthenticated ? <Component {...props} /> : null;
  };
};

// HOC for public-only routes
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
          Loading...
        </div>
      );
    }

    return !isAuthenticated ? <Component {...props} /> : null;
  };
};

// HOC for role-based access
export const withRole = <P extends object>(
  Component: React.ComponentType<P>,
  requiredRole: string
) => {
  return function WithRoleComponent(props: P) {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          Loading...
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
