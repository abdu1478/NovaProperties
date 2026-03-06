import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
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

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: {
    email: string;
    password: string;
  }) => Promise<{ message: string }>;
  logout: () => Promise<boolean>;
  signup: (credentials: {
    email: string;
    password: string;
    name: string;
  }) => Promise<SignupResponse>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen to supabase auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.name ?? "",
          email: session.user.email!,
          role: "user",
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setUser({
          id: data.user.id,
          name: data.user.user_metadata?.name ?? "",
          email: data.user.email!,
          role: "user",
        });
        return { message: "Welcome back" };
      } catch (error: any) {
        throw new Error(error.message ?? "Login failed");
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const signup = useCallback(
    async (credentials: {
      email: string;
      password: string;
      name: string;
    }): Promise<SignupResponse> => {
      setIsLoading(true);
      try {
        const { error } = await supabase.auth.signUp({
          email: credentials.email,
          password: credentials.password,
          options: { data: { name: credentials.name } },
        });
        if (error) throw error;
        return { message: "Check your email to verify your account" };
      } catch (error: any) {
        throw new Error(error.message ?? "Signup failed");
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    return true;
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
) => {
  return function WithAuthComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        navigate("/signin", {
          state: { from: location.pathname },
          replace: true,
        });
      }
    }, [isAuthenticated, isLoading]);

    if (isLoading)
      return (
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      );
    return isAuthenticated ? <Component {...props} /> : null;
  };
};

export const withoutAuth = <P extends object>(
  Component: React.ComponentType<P>,
) => {
  return function WithoutAuthComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
      if (!isLoading && isAuthenticated) {
        const from = location.state?.from || "/";
        navigate(from, { replace: true });
      }
    }, [isAuthenticated, isLoading]);

    if (isLoading)
      return (
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      );
    return !isAuthenticated ? <Component {...props} /> : null;
  };
};

export const withRole = <P extends object>(
  Component: React.ComponentType<P>,
  requiredRole: string,
) => {
  return function WithRoleComponent(props: P) {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading)
      return (
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      );
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

// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   useCallback,
//   type ReactNode,
// } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import LoadingSpinner from "@/components/LoadingSpinner";
// import { supabase } from "@/lib/supabase";

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
// }

// interface SignupResponse {
//   message: string;
// }
// interface LoginResponse {
//   message: string;
// }

// interface AuthContextType {
//   user: User | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   login: (credentials: {
//     email: string;
//     password: string;
//   }) => Promise<LoginResponse>;
//   logout: () => Promise<boolean>;
//   signup: (credentials: {
//     email: string;
//     password: string;
//     name: string;
//   }) => Promise<SignupResponse>;
//   redirectTo: string | null;
//   setRedirectTo: (path: string | null) => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [redirectTo, _setRedirectTo] = useState<string | null>(null);

//   const setRedirectTo = useCallback((path: string | null) => {
//     if (path) {
//       localStorage.setItem("redirectTo", path);
//     } else {
//       localStorage.removeItem("redirectTo");
//     }
//     _setRedirectTo(path);
//   }, []);

//   useEffect(() => {
//   const initSession = async () => {
//     const { data } = await supabase.auth.getSession();

//     if (data.session?.user) {
//       setUser({
//         id: data.session.user.id,
//         name: data.session.user.user_metadata?.full_name || "",
//         email: data.session.user.email!,
//         role: "user",
//       });
//     }

//     setIsLoading(false);
//   };

//   initSession();

//   const { data: listener } = supabase.auth.onAuthStateChange(
//     (_event, session) => {
//       if (session?.user) {
//         setUser({
//           id: session.user.id,
//           name: session.user.user_metadata?.full_name || "",
//           email: session.user.email!,
//           role: "user",
//         });
//       } else {
//         setUser(null);
//       }
//     }
//   );

//   return () => listener.subscription.unsubscribe();
// }, []);

//   const login = useCallback(
//     async ({ email, password }: { email: string; password: string }) => {
//       setIsLoading(true);

//       try {
//         const { data, error } = await supabase.auth.signInWithPassword({
//           email,
//           password,
//         });

//         if (error) throw error;

//         setUser({
//           id: data.user.id,
//           name: data.user.user_metadata?.name || "",
//           email: data.user.email!,
//           role: "user",
//         });

//         return { message: "Welcome back" };
//       } catch (error: any) {
//         throw new Error(error.message || "Login failed");
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [],
//   );

//   const signup = useCallback(
//     async (credentials: {
//       email: string;
//       password: string;
//       name: string;
//     }): Promise<SignupResponse> => {
//       setIsLoading(true);

//       try {
//         const { data, error } = await supabase.auth.signUp({
//           email: credentials.email,
//           password: credentials.password,
//           options: {
//             data: {
//               name: credentials.name,
//             },
//           },
//         });

//         if (error) throw error;

//         return { message: "Check your email to verify your account" };
//       } catch (error: any) {
//         throw new Error(error.message || "Signup failed");
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [],
//   );

//   const logout = useCallback(async () => {
//     await supabase.auth.signOut();
//     setUser(null);
//     return true;
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isAuthenticated: !!user,
//         isLoading,
//         login,
//         logout,
//         signup,
//         redirectTo,
//         setRedirectTo,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// export const withAuth = <P extends object>(
//   Component: React.ComponentType<P>,
// ) => {
//   return function WithAuthComponent(props: P) {
//     const { isAuthenticated, isLoading, setRedirectTo } = useAuth();
//     const location = useLocation();
//     const navigate = useNavigate();

//     useEffect(() => {
//       if (!isLoading && !isAuthenticated) {
//         setRedirectTo(location.pathname);
//         navigate("/signin");
//       }
//     }, [isAuthenticated, isLoading, location.pathname]);

//     if (isLoading) {
//       return (
//         <div className="min-h-screen flex items-center justify-center">
//           <LoadingSpinner />
//         </div>
//       );
//     }

//     return isAuthenticated ? <Component {...props} /> : null;
//   };
// };

// export const withoutAuth = <P extends object>(
//   Component: React.ComponentType<P>,
// ) => {
//   return function WithoutAuthComponent(props: P) {
//     const { isAuthenticated, isLoading, redirectTo } = useAuth();
//     const navigate = useNavigate();

//     useEffect(() => {
//       if (!isLoading && isAuthenticated) {
//         navigate(redirectTo || "/");
//       }
//     }, [isAuthenticated, isLoading, redirectTo]);

//     if (isLoading) {
//       return (
//         <div className="min-h-screen flex items-center justify-center">
//           <LoadingSpinner />
//         </div>
//       );
//     }

//     return !isAuthenticated ? <Component {...props} /> : null;
//   };
// };

// export const withRole = <P extends object>(
//   Component: React.ComponentType<P>,
//   requiredRole: string,
// ) => {
//   return function WithRoleComponent(props: P) {
//     const { user, isAuthenticated, isLoading } = useAuth();

//     if (isLoading) {
//       return (
//         <div className="min-h-screen flex items-center justify-center">
//           <LoadingSpinner />
//         </div>
//       );
//     }

//     if (!isAuthenticated || user?.role !== requiredRole) {
//       return (
//         <div className="min-h-screen flex items-center justify-center">
//           Unauthorized
//         </div>
//       );
//     }

//     return <Component {...props} />;
//   };
// };
