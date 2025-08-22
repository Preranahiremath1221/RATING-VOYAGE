import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "./StarRating";
import { MapPin, Edit, Star } from "lucide-react";
import { useState } from "react";

export interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  averageRating: number;
  totalRatings: number;
  userRating?: number; // Current user's rating for this store
}

interface StoreCardProps {
  store: Store;
  onRate?: (storeId: string, rating: number) => void;
  showUserRating?: boolean;
  isOwner?: boolean;
}

export function StoreCard({ store, onRate, showUserRating = true, isOwner = false }: StoreCardProps) {
  const [isRating, setIsRating] = useState(false);
  const [tempRating, setTempRating] = useState(store.userRating || 0);

  const handleRateClick = () => {
    setIsRating(true);
  };

  const handleRatingSubmit = (rating: number) => {
    setTempRating(rating);
    if (onRate) {
      onRate(store.id, rating);
    }
    setIsRating(false);
  };

  const handleCancelRating = () => {
    setTempRating(store.userRating || 0);
    setIsRating(false);
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">
            {store.name}
          </CardTitle>
          {isOwner && (
            <Badge variant="secondary" className="ml-2">
              Your Store
            </Badge>
          )}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="truncate">{store.address}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Overall Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StarRating rating={store.averageRating} readonly size="sm" />
            <span className="text-sm font-medium">{store.averageRating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">
              ({store.totalRatings} reviews)
            </span>
          </div>
        </div>

        {/* User Rating Section */}
        {showUserRating && !isOwner && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Your Rating</p>
                {store.userRating ? (
                  <div className="flex items-center gap-2">
                    <StarRating rating={store.userRating} readonly size="sm" />
                    <span className="text-sm text-muted-foreground">
                      You rated {store.userRating} star{store.userRating !== 1 ? 's' : ''}
                    </span>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Not rated yet</p>
                )}
              </div>

              {!isRating ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRateClick}
                  className="ml-4"
                >
                  {store.userRating ? (
                    <>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit Rating
                    </>
                  ) : (
                    <>
                      <Star className="h-4 w-4 mr-1" />
                      Rate Store
                    </>
                  )}
                </Button>
              ) : (
                <div className="flex flex-col gap-2">
                  <StarRating 
                    rating={tempRating} 
                    onRatingChange={setTempRating}
                    size="md"
                  />
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleRatingSubmit(tempRating)}
                      disabled={tempRating === 0}
                    >
                      Submit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleCancelRating}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}