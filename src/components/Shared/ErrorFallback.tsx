import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home, ArrowLeft, AlertTriangle, ServerCrash } from "lucide-react";
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



const Particle: React.FC<{ delay: number; x: number; size: number; opacity: number }> = ({
  delay,
  x,
  size,
  opacity,
}) => (
  <motion.span
    aria-hidden="true"
    style={{
      position: "absolute",
      left: `${x}%`,
      bottom: "-10px",
      width: size,
      height: size,
      borderRadius: "50%",
      background: "oklch(55% 0.12 220 / 0.25)",
      pointerEvents: "none",
    }}
    animate={{
      y: [0, -420],
      opacity: [0, opacity, 0],
      scale: [0.6, 1.1, 0.4],
    }}
    transition={{
      duration: 7 + delay * 1.4,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
  />
);



const Ring: React.FC<{ size: number; delay: number; className?: string }> = ({
  size,
  delay,
  className = "",
}) => (
  <motion.div
    aria-hidden="true"
    className={className}
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      border: "1px solid oklch(55% 0.12 220 / 0.18)",
    }}
    animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.15, 0.6] }}
    transition={{ duration: 4, repeat: Infinity, delay, ease: "easeInOut" }}
  />
);



const errorMeta = {
  component: { code: "ERR", color: "oklch(55% 0.18 30)", label: "Component Error" },
  route: { code: "404", color: "oklch(55% 0.14 260)", label: "Page Not Found" },
  "500": { code: "500", color: "oklch(50% 0.20 15)", label: "Server Error" },
} as const;

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  onRetry,
  message,
  compact = false,
  className = "",
  type = "component",
}) => {
  const navigate = useNavigate();
  const [isActing, setIsActing] = React.useState(false);
  const [showDetails, setShowDetails] = React.useState(false);

  const meta = errorMeta[type];

  const defaultMessages: Record<typeof type, string> = {
    component: "Something went wrong",
    route: "Page not found",
    "500": "Server unavailable",
  };
  const displayMessage = message ?? defaultMessages[type];

  const subtitles: Record<typeof type, string> = {
    component:
      "An unexpected error interrupted this view. Try refreshing or returning home.",
    route:
      "The property you're looking for may have been moved, sold, or the URL is incorrect.",
    "500":
      "Our servers are momentarily unavailable. Our team has been alerted and is working on it.",
  };

  const actionLabel =
    type === "route" ? "Return Home" : type === "500" ? "Retry" : "Try Again";
  const actingLabel =
    type === "route" ? "Redirecting…" : type === "500" ? "Reconnecting…" : "Refreshing…";
  const ActionIcon = type === "route" ? Home : RefreshCw;

  const handleAction = async () => {
    setIsActing(true);
    await new Promise((r) => setTimeout(r, 500));
    if (type === "route") {
      navigate(ROUTES.HOME);
      setIsActing(false);
    } else if (onRetry) {
      try { await onRetry(); } catch (e) { console.error(e); } finally { setIsActing(false); }
    } else {
      window.location.reload();
    }
  };

  const handleBack = () => navigate(-1);

  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };
  const item = {
    hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const particles = React.useMemo(
    () =>
      Array.from({ length: compact ? 5 : 9 }, (_, i) => ({
        delay: i * 0.9,
        x: 8 + i * 10,
        size: 4 + (i % 3) * 3,
        opacity: 0.25 + (i % 4) * 0.1,
      })),
    [compact]
  );

  return (
    <motion.section
      role="alert"
      aria-live="polite"
      aria-labelledby="err-title"
      aria-describedby="err-desc"
      className={`relative flex flex-col items-center justify-center overflow-hidden text-center
        ${compact ? "min-h-[320px] p-6" : "min-h-[520px] p-10"}
        ${className}`}
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(22% 0.04 220 / 0.6), transparent 70%), oklch(10% 0.015 220)",
        fontFamily: "'Cormorant Garamond', 'Palatino Linotype', Georgia, serif",
      }}
      variants={container}
      initial="hidden"
      animate="show"
    >
      
      

      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        {particles.map((p, i) => (
          <Particle key={i} {...p} />
        ))}
      </div>


      {!compact && (
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        >
          <Ring size={320} delay={0} />
          <Ring size={220} delay={1.2} className="absolute top-[50px] left-[50px]" />
          <Ring size={120} delay={2.4} className="absolute top-[100px] left-[100px]" />
        </div>
      )}


      <motion.div
        aria-hidden="true"
        variants={item}
        style={{ width: compact ? 40 : 56, height: 1, background: "oklch(55% 0.12 220 / 0.5)" }}
        className="mb-6"
      />


      <motion.div variants={item} className="relative mb-4 select-none" aria-hidden="true">
        <span
          style={{
            fontSize: compact ? "5rem" : "8rem",
            fontWeight: 300,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            color: "transparent",
            WebkitTextStroke: `1px ${meta.color}`,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            opacity: 0.9,
          }}
        >
          {meta.code}
        </span>
        
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            fontSize: compact ? "5rem" : "8rem",
            fontWeight: 300,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            color: meta.color,
            opacity: 0.08,
            filter: "blur(18px)",
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            pointerEvents: "none",
          }}
        >
          {meta.code}
        </span>
      </motion.div>


      <motion.div variants={item} className="mb-5">
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.6rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: meta.color,
            padding: "4px 14px",
            border: `1px solid ${meta.color}55`,
            borderRadius: "2px",
          }}
        >
          {meta.label}
        </span>
      </motion.div>


      <motion.h1
        id="err-title"
        variants={item}
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontWeight: 300,
          fontSize: compact ? "1.4rem" : "2rem",
          letterSpacing: "-0.01em",
          lineHeight: 1.25,
          color: "oklch(95% 0.01 220)",
          maxWidth: "28ch",
          margin: "0 auto 0.75rem",
        }}
      >
        {displayMessage}
      </motion.h1>


      <motion.p
        id="err-desc"
        variants={item}
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 300,
          fontSize: compact ? "0.78rem" : "0.875rem",
          lineHeight: 1.7,
          color: "oklch(70% 0.03 220)",
          maxWidth: "40ch",
          margin: "0 auto 2.5rem",
        }}
      >
        {subtitles[type]}
      </motion.p>

      {/* ── CTA cluster ── */}
      <motion.div variants={item} className="flex items-center gap-3 flex-wrap justify-center">
        {/* Primary action */}
        <motion.button
          onClick={handleAction}
          disabled={isActing}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          aria-label={isActing ? actingLabel : actionLabel}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: compact ? "8px 20px" : "11px 28px",
            fontSize: compact ? "0.75rem" : "0.8rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            color: "oklch(10% 0.015 220)",
            background: isActing
              ? "oklch(72% 0.10 220)"
              : "oklch(80% 0.12 220)",
            border: "none",
            borderRadius: "2px",
            cursor: isActing ? "not-allowed" : "pointer",
            transition: "background 0.2s",
            boxShadow: "0 4px 24px oklch(55% 0.14 220 / 0.3)",
          }}
        >
          <motion.span
            animate={isActing ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 1, repeat: isActing ? Infinity : 0, ease: "linear" }}
            style={{ display: "inline-flex" }}
          >
            <ActionIcon size={compact ? 13 : 15} strokeWidth={2} />
          </motion.span>
          {isActing ? actingLabel : actionLabel}
        </motion.button>

        {/* Secondary: go back */}
        {type !== "route" && (
          <motion.button
            onClick={handleBack}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            aria-label="Go back to the previous page"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: compact ? "8px 18px" : "11px 24px",
              fontSize: compact ? "0.75rem" : "0.8rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              color: "oklch(70% 0.05 220)",
              background: "transparent",
              border: "1px solid oklch(55% 0.05 220 / 0.4)",
              borderRadius: "2px",
              cursor: "pointer",
              transition: "border-color 0.2s, color 0.2s",
            }}
          >
            <ArrowLeft size={compact ? 13 : 15} strokeWidth={1.5} />
            Go Back
          </motion.button>
        )}
      </motion.div>


      <AnimatePresence>
        {process.env.NODE_ENV === "development" && error && (
          <motion.div
            variants={item}
            initial="hidden"
            animate="show"
            className="mt-6 w-full max-w-lg text-left"
          >
            <button
              onClick={() => setShowDetails((v) => !v)}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.7rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "oklch(55% 0.08 220)",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
              aria-expanded={showDetails}
              aria-controls="err-details"
            >
              <AlertTriangle size={11} />
              {showDetails ? "Hide" : "Show"} error details
            </button>
            <AnimatePresence>
              {showDetails && (
                <motion.pre
                  id="err-details"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    overflow: "auto",
                    maxHeight: 160,
                    marginTop: 8,
                    padding: "12px 14px",
                    background: "oklch(14% 0.02 220)",
                    border: "1px solid oklch(30% 0.04 220)",
                    borderRadius: 4,
                    fontSize: "0.7rem",
                    color: "oklch(65% 0.08 30)",
                    fontFamily: "monospace",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-all",
                  }}
                >
                  {error?.stack ?? error?.toString() ?? "Unknown error"}
                </motion.pre>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>


      <motion.div
        aria-hidden="true"
        variants={item}
        style={{ width: compact ? 40 : 56, height: 1, background: "oklch(55% 0.12 220 / 0.5)" }}
        className="mt-8"
      />
    </motion.section>
  );
};

export default ErrorFallback;