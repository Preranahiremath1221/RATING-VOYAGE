import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { StoreCard, type Store } from "@/components/StoreCard";
import { useToast } from "@/hooks/use-toast";
import { useStores } from "@/services/api";
import { useCreateRating, useUpdateRating, useUserRatings } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

export default function BrowseStores() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Fetch stores from API
  const { data: stores = [], isLoading, error, refetch } = useStores();
  const { data: userRatings = [] } = useUserRatings();
  const createRatingMutation = useCreateRating();
  const updateRatingMutation = useUpdateRating();

  // Filter stores based on search term
  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = () => {
    setIsSearching(true);
    refetch().finally(() => setIsSearching(false));
  };

  const handleRate = async (storeId: string, rating: number) => {
    try {
      // Check if user has already rated this store
      const userRating = userRatings.find(r => r.store === storeId);
      
      if (userRating) {
        // Update existing rating
        await updateRatingMutation.mutateAsync({
          id: userRating.id,
          rating: rating
        });
      } else {
        // Create new rating
        await createRatingMutation.mutateAsync({
          store: storeId,
          rating: rating,
          user: user?.id || ''
        });
      }

      toast({
        title: "Rating Submitted",
        description: `You rated ${stores.find(s => s.id === storeId)?.name} ${rating} star${rating !== 1 ? 's' : ''}!`,
      });

      // Refetch stores to get updated ratings
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Add user ratings to stores
  const storesWithUserRatings = stores.map(store => ({
    ...store,
    userRating: userRatings.find(r => r.store === store.id)?.rating
  }));

  const filteredStoresWithRatings = filteredStores.map(store => ({
    ...store,
    userRating: userRatings.find(r => r.store === store.id)?.rating
  }));

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading stores...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-lg text-destructive">Error loading stores</p>
          <p className="text-sm text-muted-foreground mt-2">
            {error instanceof Error ? error.message : 'Please try again later.'}
          </p>
          <Button onClick={() => refetch()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Browse Stores</h1>
        <p className="text-muted-foreground">Discover and rate amazing stores in your area</p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by store name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10"
          />
        </div>
        <Button 
          onClick={handleSearch} 
          className="shrink-0"
          disabled={isSearching}
        >
          <Filter className="h-4 w-4 mr-2" />
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {/* Store Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStoresWithRatings.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            onRate={handleRate}
            showUserRating={true}
          />
        ))}
      </div>

      {filteredStoresWithRatings.length === 0 && stores.length > 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No stores found matching your search.</p>
          <p className="text-sm text-muted-foreground mt-2">Try adjusting your search terms.</p>
        </div>
      )}

      {stores.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No stores available yet.</p>
          <p className="text-sm text-muted-foreground mt-2">Check back later for new stores.</p>
        </div>
      )}
    </div>
  );
}
