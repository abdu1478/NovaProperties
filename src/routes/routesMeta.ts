export const routeMeta = {
  HOME: {
    title: "Nova Properties | Luxury Real Estate in Addis Ababa",
    description:
      "Find your dream home in Addis Ababa with Nova Properties. Explore premium apartments, houses, and commercial spaces tailored to your lifestyle.",
    keywords: [
      "real estate Addis Ababa",
      "luxury homes Ethiopia",
      "apartments for sale",
      "nova properties home",
    ],
    canonical: `${import.meta.env.VITE_FRONTEND_URL}`,
  },
  PROPERTIES: {
    title: "Browse Properties for Sale & Rent | Nova Properties",
    description:
      "Discover curated listings of houses, apartments, and commercial real estate for sale and rent across Addis Ababa.",
    keywords: [
      "properties for sale in Addis Ababa",
      "houses for rent Ethiopia",
      "apartments Addis",
      "buy property nova",
    ],
    canonical: `${import.meta.env.VITE_FRONTEND_URL}/properties`,
  },
  PROPERTY_DETAIL: {
    title: "Property Details | Premium Homes by Nova Properties",
    description:
      "Explore full property details including photos, pricing, and amenities. Schedule a viewing with our real estate experts today.",
    keywords: [
      "property details",
      "real estate listings",
      "house features",
      "view property",
    ],
  },
  AGENTS: {
    title: "Top Real Estate Agents in Ethiopia | Nova Properties",
    description:
      "Meet Nova Properties’ expert agents ready to guide you through buying, selling, or renting your next property in Ethiopia.",
    keywords: [
      "real estate agents Addis Ababa",
      "property consultants Ethiopia",
      "find agents nova",
    ],
    canonical: `${import.meta.env.VITE_FRONTEND_URL}/agents`,
  },
  AGENT_DETAIL: {
    title: "Agent Profile | Trusted Property Advisors – Nova Properties",
    description:
      "Get to know our professional agents, view their specialties, and connect for personalized property advice.",
    keywords: [
      "agent profile",
      "real estate advisors",
      "housing consultant Ethiopia",
    ],
  },
  ABOUT: {
    title: "About Nova Properties | Ethiopia’s Trusted Real Estate Firm",
    description:
      "Learn about Nova Properties' mission, team, and commitment to excellence in the Ethiopian real estate market.",
    keywords: [
      "about nova",
      "real estate company Ethiopia",
      "property management Addis",
    ],
    canonical: `${import.meta.env.VITE_FRONTEND_URL}/about`,
  },
  CONTACT: {
    title: "Contact Nova Properties | Speak with a Real Estate Expert",
    description:
      "Get in touch with Nova Properties for real estate inquiries, appointments, and consultations. We're here to help you find the perfect property.",
    keywords: [
      "contact real estate agency",
      "reach nova properties",
      "property inquiry Addis",
    ],
    canonical: `${import.meta.env.VITE_FRONTEND_URL}/contact`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      name: "Nova Properties",
      image: `${import.meta.env.VITE_FRONTEND_URL}/logo.png`,
      url: `${import.meta.env.VITE_FRONTEND_URL}`,
      telephone: "+251974525193",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Airport Road",
        addressLocality: "Addis Ababa",
        addressRegion: "AD",
        postalCode: "1000",
        addressCountry: "ET",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 49.062492,
        longitude: 38.720605,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "08:30",
          closes: "14:00",
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
    keywords: ["saved listings", "favorite properties", "compare real estate"],
  },
  SIGNIN: {
    title: "Sign In to Nova Properties | Personalized Real Estate Experience",
    description:
      "Access your saved listings, inquiries, and property preferences by signing into your Nova Properties account.",
    keywords: ["login nova real estate", "signin nova", "nova account access"],
    canonical: `${import.meta.env.VITE_FRONTEND_URL}/signin`,
    robots: "noindex, nofollow",
  },
  SIGNUP: {
    title: "Create Your Nova Properties Account",
    description:
      "Sign up to explore properties, save favorites, and receive tailored recommendations.",
    keywords: ["register nova real estate", "create account", "signup nova"],
    canonical: `${import.meta.env.VITE_FRONTEND_URL}/signup`,
    robots: "noindex, nofollow",
  },
  NOT_FOUND: {
    title: "404 - Page Not Found | Nova Properties",
    description:
      "Sorry, the page you're looking for doesn’t exist. Go back to browse properties or contact our team for help.",
    keywords: ["page not found", "404 nova", "missing page real estate"],
  },
  PRIVACY_POLICY: {
    title: "Privacy Policy | Nova Properties",
    description:
      "Read Nova Properties' privacy policy to understand how we collect, use, and protect your personal information.",
    keywords: ["privacy policy", "data protection", "nova properties privacy"],
    canonical: `${import.meta.env.VITE_FRONTEND_URL}/privacy-policy`,
  },
  TERMS_OF_SERVICE: {
    title: "Terms of Service | Nova Properties",
    description:
      "Review the terms and conditions for using Nova Properties' services, including property listings and agent consultations.",
    keywords: ["terms of service", "user agreement", "nova properties terms"],
    canonical: `${import.meta.env.VITE_FRONTEND_URL}/terms-of-service`,
  },
  FALLBACK: {
    title: "Nova Properties | Something Went Wrong",
    description:
      "An unexpected error occurred. Please try again later or contact support.",
    canonical: `${import.meta.env.VITE_FRONTEND_URL}/`,
  },
};
