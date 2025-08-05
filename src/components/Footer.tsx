import { ArrowRight, Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
const socialLinks = [
  {
    name: "Facebook",
    icon: Facebook,
    url: "https://facebook.com/nova_properties",
  },
  {
    name: "Twitter",
    icon: Twitter,
    url: "https://twitter.com/nova_properties",
  },
  {
    name: "Instagram",
    icon: Instagram,
    url: "https://instagram.com/nova_properties",
  },
];

const Footer = () => {
  return (
    <footer
      role="contentinfo"
      className="bg-primary text-primary-foreground py-5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 font-arima">
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-accent w-12 h-8 rounded-full flex items-center justify-center">
                <img
                  src="/logo.webp"
                  alt="nova properties logo"
                  arial-label="logo"
                  className="w-14 h-10 rounded-full"
                />
              </div>
              <span className="text-xl font-bold ml-3">
                Nova{" "}
                <span className="text-accent-foreground/90">Properties</span>
              </span>
            </div>
            <p className="text-foreground font-semibold mb-6 text-sm text-wrap">
              Helping you find your dream home since 1999. Trusted by thousands
              of families across the country.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map(({ name, icon: Icon, url }) => (
                <Link
                  key={name}
                  to={url}
                  aria-label={name}
                  className="bg-background hover:bg-secondary-foreground text-primary w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          <nav aria-label="Footer Navigation">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm font-arima font-semibold">
              {["Home", "About Us", "Properties", "Agents", "Contact"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      to={`${
                        item === "Home"
                          ? "/"
                          : item === "About Us"
                          ? "/about-us"
                          : item === "Properties"
                          ? "/properties/listings"
                          : item === "Agents"
                          ? "/agents"
                          : "/contact"
                      }`}
                      className="text-foreground/95 hover:text-primary-foreground transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </nav>

          <nav aria-label="Footer Services">
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm font-semibold">
              {["Buying", "Renting", "Property Management", "Investment"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      to={`properties/listings?type=${
                        item === "Buying"
                          ? "buy"
                          : item === "Renting"
                          ? "rent"
                          : item.toLowerCase()
                      }`}
                      className="text-foreground hover:text-primary-foreground transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </nav>

          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-foreground mb-4 text-sm font-semibold">
              Subscribe for the latest listings and insights.
            </p>
            <form className="flex" aria-label="Newsletter Signup">
              <input
                type="email"
                required
                aria-label="Email address"
                placeholder="Your email"
                className="px-4 py-3 rounded-l-md w-full text-sm text-primary border border-input bg-background"
              />
              <button
                type="submit"
                className="bg-secondary hover:bg-accent-foreground px-4 rounded-r-md"
                aria-label="Subscribe"
              >
                <ArrowRight className="text-background" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-border mt-12 pt-6 text-center text-foreground font-semibold text-sm">
          <p>
            &copy; {new Date().getFullYear()} Nova Properties. All rights
            reserved.
          </p>
          <div className="mt-2 flex justify-center space-x-6">
            <Link to="#" className="hover:text-primary-foreground">
              Privacy Policy
            </Link>
            <Link to="#" className="hover:text-primary-foreground">
              Terms of Service
            </Link>
            <Link to="#" className="hover:text-primary-foreground">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
