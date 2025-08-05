import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { toast, Toaster } from "sonner";
import { Helmet } from "react-helmet-async";

interface SignUpForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState<SignUpForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Client-side validation
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      toast.error("Validation Error", {
        description: "Please fill in all required fields",
      });
      setIsSubmitting(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Password Mismatch", {
        description: "Your passwords do not match",
      });
      setIsSubmitting(false);
      return;
    }

    if (form.password.length < 8) {
      toast.error("Password Too Short", {
        description: "Password must be at least 8 characters",
      });
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Invalid Email", {
        description: "Please enter a valid email address",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await signup({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      toast.success("Account Created", {
        description:
          response.message || "Your account has been successfully created",
      });

      // Delay navigation to allow toast to be visible
      setTimeout(() => {
        navigate("/signin", { replace: true });
        setForm({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      }, 2000);
    } catch (error: any) {
      let errorMessage = "Signup failed. Please try again later.";

      if (error.message === "Email already registered") {
        errorMessage = "This email is already registered";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error("Registration Error", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Helmet>
        <title>Sign Up | Your Application</title>
        <meta
          name="description"
          content="Create a new account to access our services. Sign up with your email and password."
        />
        <link rel="canonical" href="/signup" />
      </Helmet>

      <section
        id="signup"
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4 relative"
        aria-labelledby="signup-heading"
      >
        <Toaster position="top-center" richColors expand={true} offset="20px" />

        <div className="absolute top-4 right-4 z-10">
          <ModeToggle />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="mx-auto mb-4" aria-hidden="true">
              <div className="bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <div className="bg-primary w-10 h-10 rounded-full animate-pulse" />
              </div>
            </div>
            <h1
              id="signup-heading"
              className="text-2xl font-bold text-foreground"
            >
              Create your account
            </h1>
            <p className="text-muted-foreground mt-2">
              Join our community today
            </p>
          </div>

          <div className="bg-card rounded-xl shadow-lg border p-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name" className="font-medium flex items-center">
                  Full Name <span className="text-destructive ml-1">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-10 h-11"
                    required
                    value={form.name}
                    disabled={isSubmitting}
                    onChange={handleInputChange}
                    autoComplete="name"
                    aria-required="true"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="font-medium flex items-center"
                >
                  Email <span className="text-destructive ml-1">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email@example.com"
                    className="pl-10 h-11"
                    required
                    value={form.email}
                    disabled={isSubmitting}
                    onChange={handleInputChange}
                    autoComplete="email"
                    aria-required="true"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="font-medium flex items-center"
                >
                  Password <span className="text-destructive ml-1">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-11"
                    required
                    value={form.password}
                    disabled={isSubmitting}
                    onChange={handleInputChange}
                    autoComplete="new-password"
                    minLength={8}
                    aria-required="true"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="font-medium flex items-center"
                >
                  Confirm Password{" "}
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-11"
                    required
                    value={form.confirmPassword}
                    disabled={isSubmitting}
                    onChange={handleInputChange}
                    autoComplete="new-password"
                    minLength={8}
                    aria-required="true"
                    aria-invalid={form.password !== form.confirmPassword}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {form.password &&
                  form.confirmPassword &&
                  form.password !== form.confirmPassword && (
                    <p className="text-xs text-destructive">
                      Passwords do not match
                    </p>
                  )}
              </div>

              <div className="flex items-center gap-3 mt-4">
                <Checkbox id="terms" required disabled={isSubmitting} />
                <Label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground"
                >
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-blue-700/90 hover:underline font-medium transition-colors"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-blue-700/90 hover:underline font-medium transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 bg-primary hover:bg-primary/90 h-11"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                Already have an account?{" "}
              </span>
              <Button
                asChild
                variant="link"
                size="sm"
                className="px-1 text-blue-700/90 font-medium"
              >
                <Link to="/signin" aria-label="Sign in to your account">
                  Sign in
                </Link>
              </Button>
            </div>

            <div className="relative my-6">
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
                onClick={() => toast.info("Google sign-up coming soon")}
                type="button"
                disabled={isSubmitting}
              >
                <GoogleIcon />
                <span>Google</span>
              </Button>
              <Button
                variant="outline"
                className="gap-2 h-10"
                onClick={() => toast.info("GitHub sign-up coming soon")}
                type="button"
                disabled={isSubmitting}
              >
                <GitHubIcon />
                <span>GitHub</span>
              </Button>
            </div>
          </div>
        </motion.div>
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

export default SignUpPage;
