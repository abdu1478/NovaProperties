import axios from "axios";
import type {
  PropertyHandler,
  AgentHandler,
  TestimonialHandler,
} from "Handlers";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchFeaturedProperties = async (): Promise<PropertyHandler[]> => {
  try {
    const response = await axios.get<PropertyHandler[]>(
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

export const fetchAllProperties = async (): Promise<{
  data: PropertyHandler[];
  total: number;
}> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/properties`, {});
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

export const fetchAgents = async (): Promise<AgentHandler[]> => {
  const response = await axios.get(`${API_BASE_URL}/agents`);
  return response.data;
};

export const fetchTestimonials = async (): Promise<TestimonialHandler[]> => {
  const response = await axios.get(`${API_BASE_URL}/testimonials`);

  return response.data;
};
export const fetchIndividualProperty = async (
  id: string
): Promise<PropertyHandler> => {
  const response = await axios.get(`${API_BASE_URL}/properties/${id}`);
  return response.data;
};

export const fetchAgentById = async (id: string): Promise<AgentHandler> => {
  const response = await axios.get(`${API_BASE_URL}/agents/${id}`);
  return response.data;
};

export const fetchFavouriteProperties = async (
  userId: string
): Promise<PropertyHandler[]> => {
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
