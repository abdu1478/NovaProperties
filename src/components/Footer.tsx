import { ArrowRight, Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ROUTES } from "@/constants/routes";

// FIX #1: External links use href strings, not router paths
const socialLinks = [
  {
    name: "Facebook",
    icon: Facebook,
    href: "https://facebook.com/nova_properties",
  },
  {
    name: "Twitter",
    icon: Twitter,
    href: "https://twitter.com/nova_properties",
  },
  {
    name: "Instagram",
    icon: Instagram,
    href: "https://instagram.com/nova_properties",
  },
];

// FIX #6: Route map as a data array — no nested ternaries
const quickLinks = [
  { label: "Home", to: ROUTES.HOME },
  { label: "About Us", to: ROUTES.ABOUT },
  { label: "Properties", to: ROUTES.PROPERTIES },
  { label: "Agents", to: ROUTES.AGENTS },
  { label: "Contact", to: ROUTES.CONTACT },
];

// FIX #2 + #6: Service links with correct leading slash
const serviceLinks = [
  { label: "Buying", to: "/properties/listings?type=buy" },
  { label: "Renting", to: "/properties/listings?type=rent" },
  {
    label: "Property Management",
    to: "/properties/listings?type=property-management",
  },
  { label: "Investment", to: "/properties/listings?type=investment" },
];

// FIX #3: Unique gradient ID for the footer SVG (footerArchGrad, not archH)
// so it doesn't conflict with the Navbar's archH gradient
const Footer = () => {
  // FIX #5: Newsletter form state
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // TODO: wire up to your email service / Supabase edge function
    console.log("Subscribe:", email);
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer
      role="contentinfo"
      className="bg-primary text-primary-foreground py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 font-body">
          {/* Brand Column */}
          <div>
            <div className="flex items-center mb-3">
              <svg
                width="300"
                height="60"
                viewBox="0 0 300 120"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                focusable="false"
              >
                <defs>
                  <linearGradient
                    id="footerLogoGrad"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#2a548a" />
                    <stop offset="100%" stopColor="#0e1e36" />
                  </linearGradient>
                  <linearGradient
                    id="footerStarGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#c8a84b" />
                    <stop offset="100%" stopColor="#e8c97a" />
                  </linearGradient>
                </defs>

                {/* Building mark */}
                <g transform="translate(28, 8) scale(0.6)">
                  <polygon
                    points="60,0 120,28 0,28"
                    fill="url(#footerLogoGrad)"
                  />
                  <polygon
                    points="60,6 62.5,13.5 70.5,13.5 64.2,18.2 66.7,25.7 60,21 53.3,25.7 55.8,18.2 49.5,13.5 57.5,13.5"
                    fill="url(#footerStarGrad)"
                  />
                  <rect x="0" y="30" width="120" height="7" fill="#1a3560" />
                  <rect x="4" y="37" width="112" height="3" fill="#2a548a" />
                  <rect
                    x="5"
                    y="40"
                    width="14"
                    height="78"
                    fill="url(#footerLogoGrad)"
                  />
                  <rect x="3" y="40" width="18" height="5" fill="#1a3560" />
                  <rect x="3" y="113" width="18" height="5" fill="#1a3560" />
                  <rect
                    x="53"
                    y="40"
                    width="14"
                    height="78"
                    fill="url(#footerLogoGrad)"
                  />
                  <rect x="51" y="40" width="18" height="5" fill="#1a3560" />
                  <rect x="51" y="113" width="18" height="5" fill="#1a3560" />
                  <rect
                    x="101"
                    y="40"
                    width="14"
                    height="78"
                    fill="url(#footerLogoGrad)"
                  />
                  <rect x="99" y="40" width="18" height="5" fill="#1a3560" />
                  <rect x="99" y="113" width="18" height="5" fill="#1a3560" />
                  <rect x="-6" y="118" width="132" height="8" fill="#1a3560" />
                  <rect x="-12" y="126" width="144" height="6" fill="#0e2248" />
                  <rect x="-18" y="132" width="156" height="5" fill="#0a1a38" />
                </g>

                <text
                  x="110"
                  y="32"
                  fontFamily="Cinzel, serif"
                  fontSize="38"
                  fontWeight="700"
                  fill="white"
                  letterSpacing="2"
                >
                  NOVA
                </text>
                <text
                  x="110"
                  y="54"
                  fontFamily="Cinzel, serif"
                  fontSize="24"
                  fontWeight="400"
                  fill="rgba(255,255,255,0.75)"
                  letterSpacing="5"
                >
                  PROPERTIES
                </text>

                <line
                  x1="110"
                  y1="66"
                  x2="292"
                  y2="66"
                  stroke="#c8a84b"
                  strokeWidth="0.8"
                />

                <text
                  x="110"
                  y="82"
                  fontFamily="Montserrat, sans-serif"
                  fontSize="12"
                  fontWeight="300"
                  fill="#f5f4f3"
                  letterSpacing="3"
                >
                  TRUST · COMMITMENT · HERITAGE
                </text>
              </svg>
            </div>

            <p className="font-arima text-primary-foreground/80 mb-6 text-sm leading-relaxed">
              Helping you find your dream home since 1999. Trusted by thousands
              of families across the country.
            </p>

            <div className="flex space-x-3">
              {socialLinks.map(({ name, icon: Icon, href }) => (
                <a
                  key={name}
                  href={href}
                  aria-label={`${name} (opens in new tab)`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Footer quick links">
            <h3 className="text-base font-semibold mb-4 text-primary-foreground">
              Quick Links
            </h3>

            <ul className="space-y-2 text-sm font-medium">
              {quickLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="font-arima text-primary-foreground/75 hover:text-primary-foreground transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-label="Footer services">
            <h3 className="text-base font-semibold mb-4 text-primary-foreground">
              Services
            </h3>
            <ul className="space-y-2 text-sm font-medium">
              {serviceLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="font-arima text-primary-foreground/75 hover:text-primary-foreground transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Newsletter */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-primary-foreground">
              Newsletter
            </h3>
            <p className="text-primary-foreground/75 mb-4 text-sm font-arima leading-relaxed">
              Subscribe for the latest listings and market insights.
            </p>

            {subscribed ? (
              <p className="text-sm text-primary-foreground/90 bg-primary-foreground/10 rounded-md px-4 py-3">
                ✓ You're subscribed! Thanks for joining.
              </p>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex"
                aria-label="Newsletter signup"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Email address"
                  placeholder="Your email"
                  className="px-4 py-2.5 rounded-l-md w-full text-sm text-foreground border border-primary-foreground/20 bg-primary-foreground/10 placeholder:text-primary-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary-foreground/50"
                />

                <button
                  type="submit"
                  className="bg-gold hover:opacity-90 active:opacity-80 px-4 rounded-r-md transition-opacity duration-200 flex items-center justify-center"
                  aria-label="Subscribe to newsletter"
                  style={{ minWidth: "44px" }}
                >
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-6 text-center text-sm">
          <p className="text-primary-foreground/70">
            &copy; {new Date().getFullYear()} Nova Properties. All rights
            reserved.
          </p>

          <div className="mt-2 flex justify-center space-x-6">
            <Link
              to="/privacy-policy"
              className="text-primary-foreground/60 hover:text-primary-foreground transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-primary-foreground/60 hover:text-primary-foreground transition-colors duration-200"
            >
              Terms of Service
            </Link>
            <Link
              to="/sitemap"
              className="text-primary-foreground/60 hover:text-primary-foreground transition-colors duration-200"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
