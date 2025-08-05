import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

interface ErrorFallbackProps {
  error?: Error | any;
  onRetry?: () => void;
  message?: string;
  compact?: boolean;
  className?: string;
  type?: "component" | "route" | "500";
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  onRetry,
  message = "Oops! Something went wrong.",
  compact = false,
  className = "",
  type = "component",
}) => {
  const navigate = useNavigate();
  const [isPerformingAction, setIsPerformingAction] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  let errorMessage = message;
  let actionLabel = "Try Again";
  let performingActionLabel = "Fixing things...";
  let actionIcon = <RefreshCw size={compact ? 14 : 16} />;

  if (type === "route") {
    errorMessage = "Page not found";
    actionLabel = "Go Home";
    performingActionLabel = "Redirecting...";
    actionIcon = <Home size={compact ? 14 : 16} />;
  } else if (type === "500") {
    errorMessage = "Server error";
    actionLabel = "Retry";
    performingActionLabel = "Reconnecting...";
  }

  const handleAction = async () => {
    setIsPerformingAction(true);

    if (type === "route") {
      setTimeout(() => {
        navigate(ROUTES.HOME);
        setIsPerformingAction(false);
      }, 500);
    } else if (onRetry) {
      setTimeout(async () => {
        try {
          await onRetry();
        } catch (error) {
          console.error("Action failed:", error);
        } finally {
          setIsPerformingAction(false);
        }
      }, 500);
    } else {
      setTimeout(() => {
        window.location.reload();
        setIsPerformingAction(false);
      }, 500);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as const,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const },
    },
  };

  const yetiVariants = {
    idle: {
      y: [0, -8, 0],
      rotate: [0, 2, -2, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: [0.4, 0, 0.6, 1] as const,
      },
    },
    working: {
      rotate: [0, -5, 5, -5, 5, 0],
      scale: [1, 1.05, 1],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: [0.4, 0, 0.6, 1] as const,
      },
    },
  };

  return (
    <motion.section
      className={`flex flex-col items-center justify-center p-6 text-center space-y-6 ${
        compact ? "min-h-[300px]" : "min-h-[400px]"
      } ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      role="alert"
      aria-live="polite"
      aria-labelledby="error-title"
      aria-describedby="error-description"
    >
      <motion.div
        className="relative"
        variants={yetiVariants}
        animate={isPerformingAction ? "working" : "idle"}
      >
        {!imageError ? (
          <img
            src={"logo.webp"}
            alt="Friendly yeti helper character"
            className={`${
              compact ? "w-20 h-20" : "w-24 h-24"
            } object-contain drop-shadow-lg`}
            onError={() => setImageError(true)}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div
            className={`${
              compact ? "text-4xl" : "text-5xl"
            } animate-bounce-gentle`}
            role="img"
            aria-label="Friendly helper"
          >
            🧊
          </div>
        )}
      </motion.div>

      <motion.div className="space-y-2" variants={itemVariants}>
        <h2
          id="error-title"
          className={`font-semibold text-foreground ${
            compact ? "text-lg" : "text-xl"
          }`}
        >
          {errorMessage}
        </h2>
        <p
          id="error-description"
          className={`text-muted-foreground ${
            compact ? "text-sm" : "text-base"
          } max-w-md mx-auto leading-relaxed`}
        >
          {type === "500"
            ? "Our servers are having trouble. Our yeti team is working to resolve this."
            : "Don't worry! Our yeti friend is here to help get things back on track."}
        </p>

        {process.env.NODE_ENV === "development" && error && (
          <details className="mt-4 text-left text-sm text-muted-foreground">
            <summary>Error details</summary>
            <pre className="mt-2 p-2 bg-muted/50 rounded overflow-auto max-h-40">
              {error.toString()}
            </pre>
          </details>
        )}
      </motion.div>

      <motion.div variants={itemVariants}>
        <Button
          onClick={handleAction}
          disabled={isPerformingAction}
          variant="default"
          size={compact ? "sm" : "default"}
          className="relative overflow-hidden group bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all duration-300 text-white"
        >
          <motion.div
            className="flex items-center gap-2"
            animate={isPerformingAction ? { x: [0, -2, 2, 0] } : {}}
            transition={{
              duration: 0.3,
              repeat: isPerformingAction ? Infinity : 0,
            }}
          >
            {actionIcon}
            {isPerformingAction ? performingActionLabel : actionLabel}
          </motion.div>

          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
            initial={false}
          />
        </Button>
      </motion.div>

      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-secondary/5 to-primary/5 rounded-full blur-3xl" />
      </div>
    </motion.section>
  );
};

export default ErrorFallback;
