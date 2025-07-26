import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import axios from "@/lib/axios";
import type { Property } from "@/utils/api";

export const useFavoriteProperty = (
  property: Property,
  onFavoriteChange?: (id: string, state: boolean) => void,
  isFavoritePage = false
) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const loadFavoriteStatus = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await axios.get(`/users/${user.id}/favorites`);
      setIsFavorite(data.some((p: Property) => p._id === property._id));
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
    }
  }, [user, property._id]);

  useEffect(() => {
    loadFavoriteStatus();
  }, [loadFavoriteStatus]);

  const toggleFavorite = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!user || !isAuthenticated) {
      toast.warning("Please log in to save properties", {
        action: {
          label: "Login",
          onClick: () => navigate("/signin"),
        },
      });
      return;
    }

    const newState = !isFavorite;
    setIsFavorite(newState); // optimistic update
    setLoading(true);

    try {
      if (newState) {
        await axios.post(`/users/${user.id}/favorites`, {
          propertyId: property._id,
        });
        toast.success("Added to favorites");
      } else {
        await axios.delete(`/users/${user.id}/favorites/${property._id}`);
        toast.success("Removed from favorites");

        if (isFavoritePage && onFavoriteChange) {
          onFavoriteChange(property._id, false);
        }
      }
      if (onFavoriteChange) {
        onFavoriteChange(property._id, newState);
      }
    } catch (error) {
      console.error("Favorite toggle error:", error);
      setIsFavorite(!newState); // rollback
      toast.error("Failed to update favorite");
    } finally {
      setLoading(false);
    }
  };

  return {
    isFavorite,
    loading,
    toggleFavorite,
  };
};
