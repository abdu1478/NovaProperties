import { useState, useEffect, useRef } from "react";
import { ModeToggle } from "./mode-toggle";
import {
  Menu,
  X,
  Search,
  User,
  Home,
  Heart,
  Key,
  CalendarDays,
} from "lucide-react";
import { Button } from "./ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
// import { useDebounce } from "use-debounce";
import { motion, AnimatePresence } from "framer-motion";
import RefForwardedLink from "./RefForwardedLink";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/constants/routes";
import { toast } from "sonner";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [logoSrc, setLogoSrc] = useState<string>("/logo.png");
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [showMobileSearch, setShowMobileSearch] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  // const [debouncedQuery] = useDebounce(searchQuery, 300);

  const imgRef = useRef<HTMLImageElement>(null);
  const desktopSearchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    setMobileOpen(false);
    const success = await logout();

    if (success) {
      toast.success("You've been logged out successfully");
      setTimeout(() => navigate("/"), 1000);
    } else {
      toast.error("Logout failed. Please try again.");
    }
  };

  // Lazy load logo
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const highResImg = new Image();
        highResImg.src = "logo.png";
        highResImg.onload = () => {
          if (imgRef.current) setLogoSrc("logo-lazy.png");
        };
        observer.disconnect();
      }
    });

    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Focus search input when mobile search is shown
  useEffect(() => {
    if (showMobileSearch && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  }, [showMobileSearch]);

  // Keyboard shortcut for search (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (desktopSearchInputRef.current && !showMobileSearch) {
          desktopSearchInputRef.current.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showMobileSearch]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setShowMobileSearch(false);
  }, [location.pathname]);

  // Close mobile menu when clicking outside
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileOpen]);

  // Nav items
  const navItems = [
    { name: "Home", href: "/", icon: <Home size={16} /> },
    {
      name: "Properties",
      href: ROUTES.PROPERTIES,
      icon: <Key size={16} />,
    },
    { name: "About", href: ROUTES.ABOUT, icon: <CalendarDays size={16} /> },
    { name: "Favorites", href: ROUTES.FAVORITES, icon: <Heart size={16} /> },
    { name: "Agents", href: ROUTES.AGENTS, icon: <User size={16} /> },
  ];

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  const performSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setShowMobileSearch(false);
      setMobileOpen(false);
    }
  };

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href) || location.pathname === href;
  };

  return (
    <header
      role="banner"
      className={cn(
        "sticky top-0 z-50 w-full",
        "bg-background/80 backdrop-blur-md border-b border-border/50",
        "supports-[backdrop-filter]:bg-background/60",
        scrolled ? "py-1 max-sm:py-1" : "py-1 max-sm:py-1",
        "lg:py-4"
      )}
    >
      <div className="mx-auto px-2 sm:px-4 lg:px-6 max-w-7xl">
        {/* Mobile Search */}
        <AnimatePresence>
          {showMobileSearch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden flex items-center gap-2 py-2 border-b border-border/50"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileSearch(false)}
                className="shrink-0 h-8 w-8"
              >
                <X size={18} />
              </Button>
              <form
                onSubmit={handleSearch}
                className="flex-1 flex items-center bg-muted/50 rounded-full px-3 py-1.5"
              >
                <Search size={16} className="text-muted-foreground mr-2" />
                <input
                  ref={mobileSearchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search properties..."
                  className="w-full max-w-[calc(100vw-120px)] text-sm placeholder:text-muted-foreground truncate"
                />
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className={cn(
            "flex items-center justify-between transition-all",
            showMobileSearch ? "hidden lg:flex" : "flex"
          )}
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 shrink-0 group"
          >
            <div className="relative">
              <img
                ref={imgRef}
                src={logoSrc}
                alt="Nova Pro Logo"
                className={cn(
                  "rounded-full ease-in-out",
                  "group-hover:scale-105",
                  scrolled
                    ? "w-6 h-6 sm:w-8 sm:h-8"
                    : "w-8 h-8 sm:w-10 sm:h-10",
                  "sm:w-10 sm:h-10 lg:w-12 lg:h-12"
                )}
                loading="lazy"
              />
            </div>
            <div className="hidden sm:block">
              <span
                className={cn(
                  "font-bold whitespace-nowrap ",
                  scrolled ? "text-lg" : "text-xl",
                  "lg:text-xl"
                )}
              >
                Nova <span className="text-primary">Pro</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
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
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                  {/* Active indicator bar */}
                  {isActive(item.href) && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary hidden"
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

          {/* Search & Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Trigger (Mobile/Tablet) */}
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden h-8 w-8 sm:h-9 sm:w-9"
              onClick={() => setShowMobileSearch(true)}
            >
              <Search size={16} className="sm:hidden" />
              <Search size={18} className="hidden sm:block" />
            </Button>

            {/* Search Bar (Desktop) */}
            <form
              onSubmit={handleSearch}
              className="hidden lg:flex items-center bg-muted/50 rounded-full px-3 py-1.5 transition-all duration-200 hover:bg-muted/80 focus-within:bg-muted/80 focus-within:ring-2 focus-within:ring-ring/20"
            >
              <Search size={16} className="text-muted-foreground mr-2" />
              <input
                ref={desktopSearchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search properties... (Ctrl+K)"
                className="bg-transparent border-0 focus:outline-none w-40 xl:w-56 2xl:w-64 text-sm placeholder:text-muted-foreground"
              />
            </form>

            {/* User Actions */}
            {!user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/signin"
                  className="flex items-center gap-2 px-4 py-1.5 border-2 text-sm lg:text-base rounded-md transition-all duration-200 hover:scale-[1.02] hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <User size={18} />
                  <span>Sign In</span>
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-1.5 border-2 text-sm lg:text-base rounded-md transition-all cursor-pointer duration-200 hover:bg-accent/70 hover:text-white"
                >
                  <User size={18} />
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
            >
              <motion.div
                animate={{ rotate: mobileOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.div>
            </Button>

            <div className="hidden sm:block">
              <ModeToggle />
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
            >
              <div className="border-t border-border/50 pt-4 pb-4 space-y-2">
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
                  {/* Fixed: Removed hidden class from mobile auth buttons */}
                  {!user ? (
                    <div className="md:hidden flex items-center w-1/2">
                      <Link
                        to="/signin"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center gap-2 px-3 py-0.5 w-full border-2 rounded-md transition-all cursor-pointer duration-200 hover:bg-accent/70 hover:text-white text-base sm:text-lg"
                      >
                        <User size={18} />
                        <span>Sign In</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 w-full md:hidden">
                      <Button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 px-4 py-3 w-full rounded-md transition-all duration-200 hover:text-background focus:outline-none focus:ring-2 focus:ring-primary text-base sm:text-lg"
                      >
                        <User size={18} />
                        <span>Log out</span>
                      </Button>
                    </div>
                  )}

                  <Button
                    variant="secondary"
                    className="bg-primary flex-1 py-3 transition-all duration-200 hover:scale-105 text-base sm:text-lg cursor-pointer text-background"
                  >
                    List Property
                  </Button>

                  <div className="sm:hidden flex justify-center pt-2">
                    <ModeToggle />
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
