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
  createdAt?: string;
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

export interface EndUser {
  fullName: string;
  email: string;
  phone: string;
  message: string;
  propertyId?: string;
  sourcePage?: string;
}

export const fetchFeaturedProperties = async (): Promise<Property[]> => {
  try {
    const response = await axios.get<Property[]>(
      `${API_BASE_URL}/properties/featured`
    );
    return response.data;
  } catch (err) {
    let errorMessage = "Failed to fetch properties. Please try again later.";

    if (axios.isAxiosError(err)) {
      if (err.response) {
        errorMessage =
          err.response.data?.message ||
          `Server error: ${err.response.status} ${err.response.statusText}`;
      } else if (err.request) {
        errorMessage = "Network error. Please check your connection.";
      }
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }

    throw new Error(errorMessage);
  }
};

export const fetchAgents = async (): Promise<Agent[]> => {
  const response = await axios.get(`${API_BASE_URL}/agents`);
  return response.data;
};

export const fetchTestimonials = async (): Promise<Testimonial[]> => {
  const response = await axios.get(`${API_BASE_URL}/testimonials`);
  console.log(response);
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

export const fetchFavouriteProperties = async (
  userId: string
): Promise<Property[]> => {
  const response = await axios.get(
    `${API_BASE_URL}/users/${userId}/favourites`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const setFavouriteProperty = async (
  userId: string,
  propertyId: string
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/users/${userId}/favourites`,
      { propertyId },
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to set favourite property";
    throw new Error(errorMessage);
  }
};

export const deleteFavouriteProperty = async (
  userId: string,
  propertyId: string
) => {
  const response = await axios.delete(
    `${API_BASE_URL}/users/${userId}/favourites/${propertyId}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export async function submitUserMessage(data: {
  fullName: string;
  email: string;
  phone: string;
  message: string;
  propertyId?: string;
  sourcePage?: string;
  userId?: string;
  subject: string;
}) {
  try {
    const response = await axios.post(`${API_BASE_URL}/contact`, data, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // not "credentials"
    });

    return response.data;
  } catch (err: any) {
    console.error("Contact form error:", err);
    throw new Error(
      err.response?.data?.message || "Message submission failed."
    );
  }
}
