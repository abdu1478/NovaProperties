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
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const { user, logout } = useAuth();

  const navItems = [
    { name: "Home",       href: ROUTES.HOME,       icon: <Home       size={16} aria-hidden="true" /> },
    { name: "Properties", href: ROUTES.PROPERTIES, icon: <Key        size={16} aria-hidden="true" /> },
    { name: "About",      href: ROUTES.ABOUT,      icon: <CalendarDays size={16} aria-hidden="true" /> },
    { name: "Favorites",  href: ROUTES.FAVORITES,  icon: <Heart      size={16} aria-hidden="true" /> },
    { name: "Agents",     href: ROUTES.AGENTS,     icon: <User       size={16} aria-hidden="true" /> },
  ];

  // FIX #11: Plain function — no useCallback needed for a derived computation
  const isActive = (href: string) => {
    if (href === ROUTES.HOME) return location.pathname === ROUTES.HOME;
    return location.pathname.startsWith(href);
  };

  const handleLogout = useCallback(async () => {
    setMobileOpen(false);
    try {
      await logout();
      toast.success("You've been logged out successfully");
      navigate(ROUTES.HOME);
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  }, [logout, navigate]);

  // FIX #4: Scroll effect now actually changes padding
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 10);
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

  // Close mobile menu on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        mobileOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node) &&
        mobileMenuButtonRef.current &&
        !mobileMenuButtonRef.current.contains(e.target as Node)
      ) {
        setMobileOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) setMobileOpen(false);
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
        "sticky top-0 z-50 w-full",
        // FIX #5: use font-body (DM Sans / Jost) not legacy font-arima
        "font-body",
        "bg-background/80 backdrop-blur-md border-b border-border/50",
        // FIX #10: correct Tailwind supports-[] syntax
        "supports-backdrop-filter:bg-background/60",
        // FIX #4: scroll state now actually does something
        scrolled ? "py-1 lg:py-2" : "py-2 lg:py-4",
        "transition-[padding] duration-200",
      )}
      data-testid="navbar"
    >
      <div className="mx-auto container px-4 sm:px-6 lg:px-6 max-w-7xl">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-2 sm:gap-3 shrink-0 group"
            aria-label="Nova Properties Home"
            data-testid="navbar-logo"
          >
            {/*
              FIX #1: SVG attributes converted to valid JSX camelCase.
              FIX #2: Text fills use CSS variables so they respond to dark mode.
              The building icon keeps its literal fills (they look good on any bg).
              Only the text labels (NOVA, PROPERTIES) use theme-aware fills.
            */}
            <svg
              width="320"
              height="56"
              viewBox="0 0 320 56"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              focusable="false"
            >
              <defs>
                <linearGradient id="archH" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#2a548a" />
                  <stop offset="100%" stopColor="#0e1e36" />
                </linearGradient>
              </defs>

              {/* Building mark — literal fills intentional, looks fine on any bg */}
              <g transform="translate(4,2) scale(0.36)">
                <polygon points="60,0 120,28 0,28"          fill="url(#archH)" />
                <polygon
                  points="60,6 62.5,13.5 70.5,13.5 64.2,18.2 66.7,25.7 60,21 53.3,25.7 55.8,18.2 49.5,13.5 57.5,13.5"
                  fill="#c8a84b"
                />
                <rect x="0"   y="30" width="120" height="7"  fill="#1a3560" />
                <rect x="5"   y="40" width="14"  height="78" fill="url(#archH)" />
                <rect x="53"  y="40" width="14"  height="78" fill="url(#archH)" />
                <rect x="101" y="40" width="14"  height="78" fill="url(#archH)" />
                <rect x="-6"  y="118" width="132" height="14" fill="#1a3560" />
              </g>

              {/* Divider line */}
              <line x1="58" y1="8" x2="58" y2="48" stroke="var(--border)" strokeWidth="0.6" />

              {/*
                FIX #2: Text uses currentColor so it inherits text-foreground
                from the parent <Link>, which correctly flips in dark mode.
              */}
              <text
                x="68" y="26"
                fontFamily="Cinzel, serif"
                fontSize="22"
                fontWeight="700"
                fill="var(--foreground)"
                letterSpacing="2"
              >
                NOVA
              </text>
              <text
                x="68" y="41"
                fontFamily="Cinzel, serif"
                fontSize="9.5"
                fontWeight="400"
                fill="var(--primary)"
                letterSpacing="5"
              >
                PROPERTIES
              </text>
            </svg>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden lg:flex items-center gap-1 xl:gap-2"
          >
            {navItems.map((item) => (
              // FIX #6: added `relative` so the absolute underline indicator positions correctly
              <div key={item.name} className="relative">
                <Button
                  asChild
                  variant="ghost"
                  className={cn(
                    "font-medium px-3 py-2",
                    "hover:bg-accent hover:scale-105",
                    "text-sm lg:text-base",
                    isActive(item.href) && "bg-accent/80 font-bold",
                  )}
                >
                  <RefForwardedLink
                    to={item.href}
                    className="flex items-center gap-2"
                    aria-current={isActive(item.href) ? "page" : undefined}
                    data-testid={`desktop-nav-${item.name.toLowerCase()}`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </RefForwardedLink>
                </Button>

                {/* Active indicator — outside Button so `absolute` is relative to the wrapper div */}
                {isActive(item.href) && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    layoutId="activeIndicator"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </div>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {!user ? (
              <div className="rounded-lg hidden md:flex items-center bg-primary text-primary-foreground">
                <Link
                  to={ROUTES.SIGNIN}
                  className="flex items-center gap-2 px-2 py-1.5 font-display font-semibold text-[16px] lg:text-base rounded-md transition-all duration-200 hover:scale-[1.02] hover:opacity-90 focus:outline-none "
                  data-testid="signin-button"
                  aria-label="Sign in"
                >
                  <User size={18} aria-hidden="true" />
                  <span>LOGIN IN</span>
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center">
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  
                  className="flex items-center gap-2 px-4 py-1.5 text-foreground text-sm lg:text-base rounded-md transition-all cursor-pointer duration-200 hover:bg-accent"
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
              className="lg:hidden h-8 w-8 sm:h-9 sm:w-9"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              data-testid="mobile-menu-button"
              type="button"
            >
              <motion.div
                animate={{ rotate: mobileOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {mobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
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
              id="mobile-menu"
              ref={mobileMenuRef}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              // FIX #12: removed overflow-hidden so box-shadows on children aren't clipped
              className="lg:hidden"
              aria-label="Mobile navigation"
              data-testid="mobile-menu"
            >
              <div className="border-t border-border/50 py-3 space-y-1">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.07 }}
                  >
                    <Button
                      asChild
                      variant="ghost"
                      className={cn(
                        "w-full justify-start px-4 py-3",
                        "transition-all duration-200 hover:bg-accent hover:translate-x-1",
                        "text-base sm:text-lg",
                        isActive(item.href) && "bg-accent/80 font-semibold",
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="flex flex-col sm:flex-row gap-3 pt-4 px-2"
                >
                  {!user ? (
                    <Link
                      to={ROUTES.SIGNIN}
                      onClick={() => setMobileOpen(false)}
                      // FIX #9: text-primary-foreground instead of text-sidebar
                      className="md:hidden flex items-center justify-center bg-primary text-primary-foreground gap-2 px-4 py-2 w-full rounded-md transition-all duration-200 hover:opacity-90 text-base sm:text-lg"
                      data-testid="mobile-signin-button"
                      aria-label="Sign in"
                    >
                      <User size={18} aria-hidden="true" />
                      <span>Sign In</span>
                    </Link>
                  ) : (
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      // FIX #8: text-foreground, not text-sidebar
                      className="md:hidden flex items-center justify-center text-foreground gap-2 px-4 py-2 w-full rounded-md transition-all duration-200 hover:bg-accent text-base sm:text-lg"
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