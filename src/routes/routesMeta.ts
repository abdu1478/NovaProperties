const siteUrl =
  import.meta.env.VITE_FRONTEND_URL ?? "https://nova-properties-rho.vercel.app";

export const routeMeta = {
  HOME: {
    title: "Nova Properties | Luxury Real Estate in Addis Ababa",
    description:
      "Find your dream home in Addis Ababa with Nova Properties. Explore premium apartments, houses, and commercial spaces tailored to your lifestyle.",
    canonical: siteUrl,
    ogImage: `${siteUrl}/og-home.jpg`,
  },

  PROPERTIES: {
    title: "Browse Properties for Sale & Rent | Nova Properties",
    description:
      "Discover curated listings of houses, apartments, and commercial real estate for sale and rent across Addis Ababa.",
    canonical: `${siteUrl}/properties/listings`,
  },

  PROPERTY_DETAIL: {
    title: "Property Details | Premium Homes by Nova Properties",
    description:
      "Explore full property details including photos, pricing, and amenities. Schedule a viewing with our real estate experts today.",
  },

  AGENTS: {
    title: "Top Real Estate Agents in Ethiopia | Nova Properties",
    description:
      "Meet Nova Properties' expert agents ready to guide you through buying, selling, or renting your next property in Ethiopia.",
    canonical: `${siteUrl}/agents`,
  },

  AGENT_DETAIL: {
    title: "Agent Profile | Trusted Property Advisors – Nova Properties",
    description:
      "Get to know our professional agents, view their specialties, and connect for personalized property advice.",
  },

  ABOUT: {
    title: "About Nova Properties | Ethiopia's Trusted Real Estate Firm",
    description:
      "Learn about Nova Properties' mission, team, and commitment to excellence in the Ethiopian real estate market.",
    canonical: `${siteUrl}/about`,
  },

  CONTACT: {
    title: "Contact Nova Properties | Speak with a Real Estate Expert",
    description:
      "Get in touch with Nova Properties for real estate inquiries, appointments, and consultations. We're here to help you find the perfect property.",
    canonical: `${siteUrl}/contact`,
    ogImage: `${siteUrl}/og-contact.jpg`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      name: "Nova Properties",
      image: `${siteUrl}/logo.png`,
      url: siteUrl,
      telephone: "+251974525193",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Airport Road",
        addressLocality: "Addis Ababa",
        addressRegion: "AA",
        postalCode: "1000",
        addressCountry: "ET",
      },
      geo: {
        "@type": "GeoCoordinates",

        latitude: 9.0054,
        longitude: 38.7636,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "08:30",
          closes: "17:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Saturday",
          opens: "10:00",
          closes: "13:00",
        },
      ],
      sameAs: [
        "https://facebook.com/novaproperties",
        "https://instagram.com/novaproperties",
        "https://linkedin.com/company/novaproperties",
      ],
    },
  },

  FAVORITES: {
    title: "Saved Properties | Your Favorites | Nova Properties",
    description:
      "View your favorited homes and listings. Compare, revisit, and shortlist the perfect property for your needs.",
    robots: "noindex, nofollow", // personal page — don't index
  },

  SIGNIN: {
    title: "Sign In | Nova Properties",
    description:
      "Sign in to access your saved listings and property preferences.",
    canonical: `${siteUrl}/signin`,
    robots: "noindex, nofollow",
  },

  SIGNUP: {
    title: "Create Your Account | Nova Properties",
    description:
      "Sign up to explore properties, save favorites, and receive tailored recommendations.",
    canonical: `${siteUrl}/signup`,
    robots: "noindex, nofollow",
  },

  NOT_FOUND: {
    title: "404 - Page Not Found | Nova Properties",
    description: "Sorry, the page you're looking for doesn't exist.",
    robots: "noindex, nofollow",
  },

  PRIVACY_POLICY: {
    title: "Privacy Policy | Nova Properties",
    description:
      "Read Nova Properties' privacy policy to understand how we collect, use, and protect your personal information.",
    canonical: `${siteUrl}/privacy-policy`,
  },

  TERMS_OF_SERVICE: {
    title: "Terms of Service | Nova Properties",
    description:
      "Review the terms and conditions for using Nova Properties' services.",
    canonical: `${siteUrl}/terms-of-service`,
  },

  FALLBACK: {
    title: "Nova Properties | Something Went Wrong",
    description:
      "An unexpected error occurred. Please try again later or contact support.",
    robots: "noindex, nofollow",
  },
};
