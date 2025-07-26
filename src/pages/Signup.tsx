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

interface SignUpForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
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

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    try {
      const response = await signup({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      // Show success toast immediately
      toast.success("Signup successful!", {
        description: response.message || "Redirecting to login in 2 seconds...",
      });

      // Delay navigation and form reset by 2 seconds
      setTimeout(() => {
        navigate("/signin", { replace: false });
        setForm({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      }, 2000);
    } catch (error: any) {
      // For errors, show toast for 2 seconds
      if (error.message === "Email already registered") {
        toast.error("This email is already registered", { duration: 2000 });
      } else {
        toast.error("Signup failed. Please try again later.", {
          duration: 2000,
        });
      }
    }
  };

  return (
    <>
      <section
        id="signup"
        className="min-h-screen flex items-center justify-center bg-background p-2 relative"
        aria-labelledby="signup-heading"
      >
        <Toaster position="bottom-right" richColors />

        <div className="absolute top-4 right-4">
          <ModeToggle />
        </div>

        {/* ✅ Animate the container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="mx-auto mb-4">
              <div className="bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <div className="bg-primary w-10 h-10 rounded-full animate-pulse delay-200" />
              </div>
            </div>
            <h1
              id="signup-heading"
              className="text-2xl font-bold text-foreground"
            >
              Create your account
            </h1>
            <p className="text-muted-foreground mt-2">Join our community</p>
          </div>

          <div className="bg-card rounded-xl shadow-sm border p-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-10"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    className="pl-10"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    required
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
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
                    {showPassword ? <Eye /> : <EyeOff />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={"password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    required
                    aria-label="confirm password"
                    value={form.confirmPassword}
                    onChange={(e) =>
                      setForm({ ...form, confirmPassword: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <Checkbox id="terms" required />
                <label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground"
                >
                  I agree to the{" "}
                  <Link
                    to="#"
                    className="text-blue-600 hover:underline font-medium transition-colors"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="#"
                    className="text-blue-600 hover:underline font-medium transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button type="submit" className="w-full mt-2">
                Create Account
              </Button>
            </form>

            <div className="w-full mt-2">
              <Link
                to="/signin"
                className="text-center text-sm text-muted-foreground"
              >
                Already have an account?{" "}
                <span className="font-medium text-blue-600 visited:text-purple-700 hover:underline">
                  Sign in
                </span>
              </Link>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or Continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="gap-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24">
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
                Google
              </Button>
              <Button variant="outline" className="gap-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"
                    fill="currentColor"
                  />
                </svg>
                GitHub
              </Button>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default SignUpPage;
