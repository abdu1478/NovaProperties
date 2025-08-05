import { useState, useCallback } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast, Toaster } from "sonner";
import { withoutAuth } from "@/hooks/withOutAuth";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
// import axios from "axios";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname || "/";

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Client-side validation
      if (!formData.email.trim() || !formData.password.trim()) {
        toast.error("Validation Error", {
          description: "Please fill in all required fields",
        });
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        toast.error("Invalid Email", {
          description: "Please enter a valid email address",
        });
        return;
      }

      setIsSubmitting(true);

      try {
        const response = await login({
          email: formData.email,
          password: formData.password,
        });
        toast.success("Login Successful", {
          description: response || "Welcome back!",
        });
        setTimeout(() => {
          navigate(redirectPath, {
            replace: true,
          });
        }, 1500);
        return;
      } catch (error: any) {
        console.error("Login error:", error);
        let errorMessage = "Login failed. Please try again.";

        if (error?.message) {
          errorMessage = error.message;
        }

        if (errorMessage == "Request failed with status code 401") {
          errorMessage = "Invalid email or password. Please try again.";
        }

        toast.error("Login failed", {
          description: errorMessage,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, login, navigate, redirectPath]
  );

  // useEffect(() => {
  //   toast.promise(Promise.resolve(), {
  //     loading: "Loading...",
  //     success: "Login page loaded successfully!",
  //     error: "Failed to load login page",
  //   });
  // }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <>
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30 p-6 relative">
        <div className="absolute top-4 right-4 z-10">
          <ModeToggle />
        </div>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md bg-card rounded-xl shadow-lg border"
          aria-labelledby="login-heading"
        >
          <header className="text-center p-6 pb-2">
            <div className="mx-auto mb-4" aria-hidden="true">
              <div className="bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <div className="bg-primary w-10 h-10 rounded-full animate-pulse" />
              </div>
            </div>
            <h1
              id="login-heading"
              className="text-2xl font-bold text-foreground"
            >
              Welcome back
            </h1>
            <p className="text-muted-foreground mt-2">
              Sign in to continue to your account
            </p>
          </header>

          <section className="px-6 pb-6">
            <form onSubmit={handleSubmit} noValidate>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="font-medium flex items-center"
                  >
                    Email Address{" "}
                    <span className="text-destructive ml-1">*</span>
                  </Label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="your.email@example.com"
                      className="pl-10 h-11 focus:bg-primary"
                      value={formData.email}
                      required
                      disabled={isSubmitting}
                      onChange={handleInputChange}
                      autoComplete="email"
                      aria-required="true"
                      data-testid="email-input"
                      onBlur={(e) => {
                        if (
                          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value)
                        ) {
                          toast.error("Please enter a valid email address");
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label
                      htmlFor="password"
                      className="font-medium flex items-center"
                    >
                      Password <span className="text-destructive ml-1">*</span>
                    </Label>
                  </div>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-11"
                      required
                      value={formData.password}
                      disabled={isSubmitting}
                      onChange={handleInputChange}
                      autoComplete="current-password"
                      minLength={8}
                      aria-required="true"
                      data-testid="password-input"
                      onBlur={(e) => {
                        if (e.target.value.length < 8) {
                          toast.error("Password must be at least 8 characters");
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7"
                      onClick={togglePasswordVisibility}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      data-testid="toggle-password"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center">
                    <Checkbox
                      id="remember"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          rememberMe: !!checked,
                        }))
                      }
                      className="mr-2"
                      data-testid="remember-checkbox"
                    />
                    <Label htmlFor="remember">Remember me</Label>
                  </div>
                  <Button
                    asChild
                    variant="link"
                    size="sm"
                    className="px-0 text-sm *:hover:underline text-blue-700/95"
                  >
                    <Link to="/forgot-password">Forgot password?</Link>
                  </Button>
                </div>

                <Button
                  type="submit"
                  disabled={
                    isSubmitting || !formData.email || !formData.password
                  }
                  className="w-full bg-primary hover:bg-primary/90 h-11 rounded-lg cursor-pointer text-accent-foreground font-medium transition-colors duration-300"
                  data-testid="login-button"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">
                Don't have an account?{" "}
              </span>
              <Button
                asChild
                variant="link"
                size="sm"
                className="px-1 font-medium text-blue-700/95 hover:underline"
              >
                <Link
                  to="/signup"
                  aria-label="Sign up for a new account"
                  data-testid="signup-link"
                >
                  Create account
                </Link>
              </Button>
            </div>

            <div className="relative my-4">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card px-3 text-sm text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="gap-2 h-10"
                onClick={() => toast.info("Google login coming soon")}
                type="button"
                data-testid="google-login"
              >
                <GoogleIcon />
                <span>Google</span>
              </Button>
              <Button
                variant="outline"
                className="gap-2 h-10"
                onClick={() => toast.info("GitHub login coming soon")}
                type="button"
                data-testid="github-login"
              >
                <GitHubIcon />
                <span>GitHub</span>
              </Button>
            </div>
          </section>
        </motion.article>

        <Toaster position="top-center" richColors />
      </section>
    </>
  );
};

// Optimized SVG components
const GoogleIcon = () => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.7 0 4.96-.89 6.61-2.42l-3.57-2.77c-.99.66-2.26 1.05-3.64 1.05-2.8 0-5.17-1.89-6.02-4.42H2.7v2.78C4.35 20.98 7.92 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.98 14.44A6.996 6.996 0 0 1 5.5 12c0-.85.15-1.67.41-2.44V6.78H2.7A11.987 11.987 0 0 0 1 12c0 1.96.47 3.82 1.7 5.22l3.28-2.78z"
    />
    <path
      fill="#EA4335"
      d="M12 4.8c1.47 0 2.78.51 3.82 1.5l2.87-2.87C16.95 1.88 14.7 1 12 1 7.92 1 4.35 3.02 2.7 6.78l3.21 2.78C6.83 6.69 9.2 4.8 12 4.8z"
    />
  </svg>
);

const GitHubIcon = () => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
  </svg>
);

export default withoutAuth(LoginPage);
