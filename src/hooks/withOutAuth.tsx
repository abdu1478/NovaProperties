import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const withoutAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  const UnauthenticatedComponent: React.FC<P> = (props) => {
    const { isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!isLoading && isAuthenticated) {
        navigate("/", { replace: true });
      }
    }, [isAuthenticated, isLoading, navigate]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      );
    }

    return !isAuthenticated ? <Component {...props} /> : null;
  };

  return UnauthenticatedComponent;
};
