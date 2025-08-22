import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Store as StoreIcon, Mail, MapPin, Star } from "lucide-react";
import { useStores, useDeleteStore, type Store } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

export default function AdminStores() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const { data: stores = [], isLoading, error } = useStores();
  const deleteStoreMutation = useDeleteStore();
  const { toast } = useToast();

  // Filter stores based on search term and category
  const filteredStores = useMemo(() => {
    return stores.filter(store => {
      const matchesSearch = 
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || store.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [stores, searchTerm, categoryFilter]);

  const handleDeleteStore = async (storeId: string, storeName: string) => {
    if (window.confirm(`Are you sure you want to delete store "${storeName}"?`)) {
      try {
        await deleteStoreMutation.mutateAsync(storeId);
        toast({
          title: "Store Deleted",
          description: `Store "${storeName}" has been deleted successfully.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete store. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Get unique categories for filter
  const categories = useMemo(() => {
    const uniqueCategories = new Set(stores.map(store => store.category).filter(Boolean));
    return Array.from(uniqueCategories).sort();
  }, [stores]);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading stores...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <p>Failed to load stores. Please try again later.</p>
              <p className="text-sm mt-2">{error.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Manage Stores</h1>
        <p className="text-muted-foreground">View and manage all system stores</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name, email, or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full h-10 px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <Button onClick={() => { setSearchTerm(''); setCategoryFilter('all'); }}>
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stores List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Stores ({filteredStores.length})</span>
            <Badge variant="outline" className="ml-2">
              Total: {stores.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredStores.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No stores found matching your criteria.</p>
              <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStores.map((store) => (
                <div key={store.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <StoreIcon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-foreground truncate">{store.name}</h3>
                        {store.category && (
                          <Badge variant="outline" className="text-xs">
                            {store.category}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          <span className="truncate">{store.email}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="truncate">{store.address}</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 mr-1 text-yellow-500" />
                          <span>{store.averageRating.toFixed(1)}</span>
                          <span className="text-muted-foreground ml-1">
                            ({store.totalRatings})
                          </span>
                        </div>
                      </div>
                      {store.owner && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Owner: {store.owner.name} ({store.owner.email})
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteStore(store.id, store.name)}
                      disabled={deleteStoreMutation.isPending}
                    >
                      {deleteStoreMutation.isPending ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
