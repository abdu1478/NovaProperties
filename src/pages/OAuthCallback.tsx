import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/Services/supabase";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (data?.session) {
          navigate("/", { replace: true });
        } else {
          navigate("/signin", { replace: true });
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        navigate("/", { replace: true });
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
