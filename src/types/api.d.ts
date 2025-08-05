declare module "Handlers" {
  interface PropertyHandler {
    _id: string;
    images: string[];
    price: number;
    location: string;
    bedrooms: number;
    bathrooms: number;
    area: string;
    type: string;
    yearBuilt?: number;
    description?: string;
    features?: string[];
    address?: string;
    category?: string;
    agentId?: string | Object;
    parking?: string;
    interiorDescription?: string;
    propertyType: string;
    createdAt?: string;
  }

  interface AgentHandler {
    name: string;
    _id: String;
    title: string;
    experience: string;
    languages: string[];
    phone: string;
    email: string;
    image: string;
  }

  interface TestimonialHandler {
    name: string;
    location: string;
    testimonial: string;
    rating: number;
    image?: string;
  }

  interface EndUserHandler {
    fullName: string;
    email: string;
    phone: string;
    message: string;
    propertyId?: string;
    sourcePage?: string;
    subject: string;
  }
}
