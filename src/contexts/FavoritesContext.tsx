import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchFavouriteProperties,
  setFavouriteProperty,
  deleteFavouriteProperty,
} from "@/utils/api";
import type { PropertyHandler } from "Handlers";
import { toast } from "sonner";

interface FavoritesContextType {
  favorites: PropertyHandler[];
  loading: boolean;
  error: string | null;
  isFavorite: (propertyId: string) => boolean;
  toggleFavorite: (propertyId: string) => Promise<void>;
  removeFavorite: (propertyId: string) => Promise<void>;
  refetchFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<PropertyHandler[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mutatingIds, setMutatingIds] = useState<string[]>([]);
  const { user, isAuthenticated } = useAuth();

  const fetchFavorites = useCallback(async () => {
    if (!user) return;

    const controller = new AbortController();

    try {
      setLoading(true);
      const data = await fetchFavouriteProperties();

      if (!controller.signal.aborted) {
        setFavorites(data);
        setError(null);
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        setError("Failed to load favorites");
        console.error(err);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }

    return () => controller.abort();
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchFavorites();
    } else {
      setFavorites([]);
      setLoading(false);
    }
  }, [isAuthenticated, user, fetchFavorites]);

  const isFavorite = useCallback(
    (propertyId: string): boolean => {
      return favorites.some((p) => p._id === propertyId);
    },
    [favorites],
  );

  const toggleFavorite = useCallback(
    async (propertyId: string) => {
      if (!user || !isAuthenticated) {
        toast.warning("Please log in to save properties", {
          description: "You need to be logged in to manage favorites.",
          action: {
            label: "Login",
            onClick: () => {
              window.location.href = "/signin";
            },
          },
        });
        return;
      }

      if (mutatingIds.includes(propertyId)) return;
      setMutatingIds((prev) => [...prev, propertyId]);

      try {
        const isCurrentlyFavorite = favorites.some((p) => p._id === propertyId);

        if (isCurrentlyFavorite) {
          await deleteFavouriteProperty(user.id, propertyId);
          setFavorites((prev) => prev.filter((p) => p._id !== propertyId));
          toast.info("Removed from favorites", {
            action: {
              label: "Undo",
              onClick: () => {
                setFavorites((prev) => [
                  ...prev,
                  { _id: propertyId } as PropertyHandler,
                ]);
                toast.success("Added back to favorites", {
                  closeButton: true,
                });
              },
            },
          });
        } else {
          if (!favorites.some((p) => p._id === propertyId)) {
            await setFavouriteProperty(user.id, propertyId);
            setFavorites((prev) => [
              ...prev,
              { _id: propertyId } as PropertyHandler,
            ]);
            toast.success("Added to favorites", {
              closeButton: true,
            });
          } else {
            toast.warning("Property is already in your favorites");
          }
        }
      } catch (err) {
        toast.error("Failed to update favorites", {
          closeButton: true,
        });
        console.error(err);
        fetchFavorites();
      } finally {
        setMutatingIds((prev) => prev.filter((id) => id !== propertyId));
      }
    },
    [user, isAuthenticated, favorites, fetchFavorites],
  );
  const removeFavorite = useCallback(
    async (propertyId: string) => {
      if (!user || !isAuthenticated) {
        toast.warning("Please log in to manage favorites");
        return;
      }

      if (mutatingIds.includes(propertyId)) return;
      setMutatingIds((prev) => [...prev, propertyId]);

      try {
        await deleteFavouriteProperty(user.id, propertyId);
        setFavorites((prev) => prev.filter((p) => p._id !== propertyId));
        toast.success("Removed from favorites", {
          action: {
            label: "Undo",
            onClick: () => {
              setFavorites((prev) => [
                ...prev,
                { _id: propertyId } as PropertyHandler,
              ]);
              toast.success("Added back to favorites");
            },
          },
        });
      } catch (err) {
        toast.error("Failed to remove favorite", {
          closeButton: true,
        });
        console.error(err);
        fetchFavorites();
      } finally {
        setMutatingIds((prev) => prev.filter((id) => id !== propertyId));
      }
    },
    [user, isAuthenticated, fetchFavorites],
  );

  const refetchFavorites = useCallback(async () => {
    await fetchFavorites();
  }, [fetchFavorites]);

  const value = {
    favorites,
    loading,
    error,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    refetchFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
