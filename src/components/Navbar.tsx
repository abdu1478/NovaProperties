import { useState, useEffect, useRef, useCallback } from "react";
import { ModeToggle } from "./mode-toggle";
import { Menu, X, User, Home, Heart, Key, CalendarDays } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import RefForwardedLink from "./RefForwardedLink";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/constants/routes";
import { toast } from "sonner";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [logoLoaded, setLogoLoaded] = useState<boolean>(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const { user, logout } = useAuth();

  const logoDimensions = scrolled
    ? { width: 32, height: 32 }
    : { width: 40, height: 40 };
  const logoSize = scrolled ? "w-8 h-8" : "w-10 h-10";
  const logoTextSize = scrolled ? "text-lg" : "text-xl";

  const navItems = [
    {
      name: "Home",
      href: ROUTES.HOME,
      icon: <Home size={16} aria-hidden="true" />,
    },
    {
      name: "Properties",
      href: ROUTES.PROPERTIES,
      icon: <Key size={16} aria-hidden="true" />,
    },
    {
      name: "About",
      href: ROUTES.ABOUT,
      icon: <CalendarDays size={16} aria-hidden="true" />,
    },
    {
      name: "Favorites",
      href: ROUTES.FAVORITES,
      icon: <Heart size={16} aria-hidden="true" />,
    },
    {
      name: "Agents",
      href: ROUTES.AGENTS,
      icon: <User size={16} aria-hidden="true" />,
    },
  ];

  const isActive = useCallback(
    (href: string) => {
      if (href === ROUTES.HOME) return location.pathname === ROUTES.HOME;
      return location.pathname.startsWith(href);
    },
    [location.pathname]
  );

  const handleLogout = useCallback(async () => {
    setMobileOpen(false);
    try {
      await logout();
      toast.success("You've been logged out successfully");
      navigate(ROUTES.HOME);
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  }, [logout, navigate]);

  // Load the actual logo after component mounts
  useEffect(() => {
    const img = new Image();
    img.src = "/logo-lazy.webp";
    img.onload = () => {
      // Set a small delay to allow the SVG to render first
      setTimeout(() => {
        setLogoLoaded(true);
      }, 50);
    };
    img.onerror = () => {
      console.error("Failed to load logo image");
    };
  }, []);

  // Optimized scroll effect with throttling
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      lastScrollY = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(lastScrollY > 10);
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close mobile menu when clicking outside or pressing escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        mobileMenuButtonRef.current &&
        !mobileMenuButtonRef.current.contains(event.target as Node)
      ) {
        setMobileOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mobileOpen]);

  return (
    <header
      role="banner"
      className={cn(
        "sticky top-0 z-50 w-full font-arima",
        "bg-background/80 backdrop-blur-md border-b border-border/50",
        "supports-[backdrop-filter]:bg-background/60",
        scrolled ? "py-1 max-sm:py-1" : "py-1 max-sm:py-1",
        "lg:py-4"
      )}
      data-testid="navbar"
    >
      <div className="mx-auto container px-2 sm:px-1 lg:px-6 max-w-7xl">
        <div className="flex items-center justify-between transition-all">
          {/* Logo */}
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-2 sm:gap-3 shrink-0 group"
            aria-label="Nova Pro Home"
            data-testid="navbar-logo"
          >
            <div className="relative">
              {logoLoaded ? (
                // Actual logo image
                <img
                  ref={imgRef}
                  src="/logo-lazy.webp"
                  alt="Nova Pro Logo"
                  className={cn(
                    "rounded-full ease-in-out object-cover",
                    "group-hover:scale-105",
                    logoSize,
                    "sm:w-10 sm:h-10 lg:w-12 lg:h-12"
                  )}
                  width={logoDimensions.width}
                  height={logoDimensions.height}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                // SVG placeholder
                <svg
                  className={cn(
                    "rounded-full ease-in-out",
                    "group-hover:scale-105",
                    logoSize,
                    "sm:w-10 sm:h-10 lg:w-12 lg:h-12"
                  )}
                  width={logoDimensions.width}
                  height={logoDimensions.height}
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <circle cx="20" cy="20" r="20" className="fill-primary" />
                  <path
                    d="M12 12V28M12 12L20 20M20 20V28"
                    className="stroke-white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 12V28M22 12H28C28 12 30 12 30 16C30 20 28 20 28 20H22"
                    className="stroke-white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="8"
                    y1="8"
                    x2="32"
                    y2="32"
                    className="stroke-accent"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </div>
            <div className="hidden sm:block">
              <h1
                className={cn(
                  "font-bold whitespace-nowrap",
                  logoTextSize,
                  "lg:text-xl"
                )}
              >
                Nova <span className="text-primary">Pro</span>
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden lg:flex items-center gap-1 xl:gap-2"
          >
            {navItems.map((item) => (
              <Button
                key={item.name}
                asChild
                variant="ghost"
                className={cn(
                  "font-medium px-3 py-2",
                  "hover:bg-accent hover:scale-105",
                  "text-sm lg:text-base",
                  isActive(item.href) && "bg-accent/80 font-semibold"
                )}
              >
                <RefForwardedLink
                  to={item.href}
                  className="flex items-center gap-2"
                  aria-current={isActive(item.href) ? "page" : undefined}
                  data-testid={`desktop-nav-${item.name.toLowerCase()}`}
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                  {isActive(item.href) && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      layoutId="activeIndicator"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </RefForwardedLink>
              </Button>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {!user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to={ROUTES.SIGNIN}
                  className="flex items-center gap-2 px-4 py-1.5 border-2 bg-primary text-sm lg:text-base rounded-md transition-all duration-200 hover:scale-[1.02] hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-primary text-sidebar"
                  data-testid="signin-button"
                  aria-label="Sign in"
                >
                  <User size={18} aria-hidden="true" />
                  <span>Sign In</span>
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center">
                <Button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-1.5 border-2 text-sidebar text-sm lg:text-base rounded-md transition-all cursor-pointer duration-200 hover:bg-accent/70 hover:text-white"
                  data-testid="logout-button"
                  aria-label="Log out"
                  type="button"
                >
                  <User size={18} aria-hidden="true" />
                  <span>Log out</span>
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              ref={mobileMenuButtonRef}
              variant="ghost"
              size="icon"
              className="lg:hidden h-7 w-7 sm:h-9 sm:w-9"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              data-testid="mobile-menu-button"
              type="button"
            >
              <motion.div
                animate={{ rotate: mobileOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {mobileOpen ? (
                  <X size={20} aria-hidden="true" />
                ) : (
                  <Menu size={20} aria-hidden="true" />
                )}
              </motion.div>
            </Button>

            <div className="hidden sm:block">
              <ModeToggle data-testid="theme-toggle" />
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              ref={mobileMenuRef}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden"
              aria-label="Mobile navigation"
              data-testid="mobile-menu"
            >
              <div className="border-t border-border/50 py-3 space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      asChild
                      variant="ghost"
                      className={cn(
                        "w-full justify-start px-4 py-3",
                        "transition-all duration-200 hover:bg-accent hover:translate-x-1",
                        "text-base sm:text-lg",
                        isActive(item.href) && "bg-accent/80 font-semibold"
                      )}
                      onClick={() => setMobileOpen(false)}
                    >
                      <RefForwardedLink
                        to={item.href}
                        className="flex items-center gap-3"
                        aria-current={isActive(item.href) ? "page" : undefined}
                        data-testid={`mobile-nav-${item.name.toLowerCase()}`}
                      >
                        {item.icon}
                        {item.name}
                      </RefForwardedLink>
                    </Button>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-3 pt-4 px-2"
                >
                  {!user ? (
                    <Link
                      to={ROUTES.SIGNIN}
                      onClick={() => setMobileOpen(false)}
                      className="md:hidden flex items-center justify-center bg-primary text-sidebar gap-2 px-4 py-2 w-full border-2 rounded-md transition-all cursor-pointer duration-200 hover:bg-accent/70 hover:text-white text-base sm:text-lg"
                      data-testid="mobile-signin-button"
                      aria-label="Sign in"
                    >
                      <User size={18} aria-hidden="true" />
                      <span>Sign In</span>
                    </Link>
                  ) : (
                    <Button
                      onClick={handleLogout}
                      className="md:hidden flex items-center justify-center  text-sidebar gap-2 px-4 py-2 w-full rounded-md transition-all duration-200 hover:text-background focus:outline-none focus:ring-2 focus:ring-primary text-base sm:text-lg"
                      data-testid="mobile-logout-button"
                      aria-label="Log out"
                      type="button"
                    >
                      <User size={18} aria-hidden="true" />
                      <span>Log out</span>
                    </Button>
                  )}

                  <div className="sm:hidden flex justify-center pt-2">
                    <ModeToggle data-testid="mobile-theme-toggle" />
                  </div>
                </motion.div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

export default Navbar;
