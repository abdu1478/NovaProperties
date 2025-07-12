import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface Property {
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
}

export interface Agent {
  name: string;
  _id: String;
  title: string;
  experience: string;
  languages: string[];
  phone: string;
  email: string;
  image: string;
}

export interface Testimonial {
  name: string;
  location: string;
  testimonial: string;
  rating: number;
  image?: string;
}

export const fetchFeaturedProperties = async (): Promise<Property[]> => {
  const response = await axios.get(`${API_BASE_URL}/properties/featured`);
  return response.data;
};

export const fetchAgents = async (): Promise<Agent[]> => {
  const response = await axios.get(`${API_BASE_URL}/agents`);
  return response.data;
};

export const fetchTestimonials = async (): Promise<Testimonial[]> => {
  const response = await axios.get(`${API_BASE_URL}/testimonials`);
  return response.data;
};
export const fetchIndividualProperty = async (
  id: string
): Promise<Property> => {
  const response = await axios.get(`${API_BASE_URL}/properties/${id}`);
  return response.data;
};

export const fetchAgentById = async (id: string): Promise<Agent> => {
  const response = await axios.get(`${API_BASE_URL}/agents/${id}`);
  return response.data;
};
