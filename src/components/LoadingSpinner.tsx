const LoadingSpinner = ({
  size = "md",
  variant = "primary",
  fullScreen = false,
  className = "",
  text = "",
  ariaLabel = "Loading",
}) => {
  const sizeClasses: Record<string, string> = {
    xs: "h-4 w-4",
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const variantClasses: Record<string, string> = {
    primary: "text-blue-600",
    secondary: "text-gray-600",
    light: "text-white",
    success: "text-green-500",
    danger: "text-red-500",
  };

  const renderSpinner = () => (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${variantClasses[variant]}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 z-50 bg-white dark:bg-gray-900 backdrop-blur-sm flex flex-col items-center justify-center"
        role="status"
        aria-label={ariaLabel}
      >
        <div className="flex flex-col items-center">
          {renderSpinner()}
          {text && (
            <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium max-w-xs text-center">
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex flex-col items-center ${className}`}
      role="status"
      aria-label={ariaLabel}
    >
      {renderSpinner()}
      {text && (
        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
