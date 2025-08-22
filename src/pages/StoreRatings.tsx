import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, User, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock store ratings data
const storeRatings = [
  { 
    id: 1,
    user: "John Smith", 
    rating: 5, 
    comment: "Excellent service and great products! The staff was very helpful and knowledgeable.", 
    date: "2024-01-15",
    helpful: 12,
    verified: true
  },
  { 
    id: 2,
    user: "Alice Johnson", 
    rating: 4, 
    comment: "Good quality products, but the prices are a bit high compared to competitors.", 
    date: "2024-01-14",
    helpful: 8,
    verified: true
  },
  { 
    id: 3,
    user: "Mike Wilson", 
    rating: 3, 
    comment: "Average experience. Products are okay but nothing special.", 
    date: "2024-01-13",
    helpful: 3,
    verified: false
  },
  { 
    id: 4,
    user: "Sarah Brown", 
    rating: 5, 
    comment: "Amazing customer service! They went above and beyond to help me.", 
    date: "2024-01-12",
    helpful: 15,
    verified: true
  },
  { 
    id: 5,
    user: "David Lee", 
    rating: 2, 
    comment: "Disappointing experience. Product didn't work as described.", 
    date: "2024-01-11",
    helpful: 2,
    verified: true
  },
];

export default function StoreRatings() {
  const averageRating = storeRatings.reduce((sum, rating) => sum + rating.rating, 0) / storeRatings.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: storeRatings.filter(r => r.rating === stars).length,
    percentage: (storeRatings.filter(r => r.rating === stars).length / storeRatings.length) * 100
  }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Store Ratings</h1>
        <p className="text-muted-foreground">Customer reviews and feedback for your store</p>
      </div>

      {/* Rating Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Based on {storeRatings.length} reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">5-Star Ratings</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {ratingDistribution.find(r => r.stars === 5)?.count || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {ratingDistribution.find(r => r.stars === 5)?.percentage.toFixed(0)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Reviews</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {storeRatings.filter(r => r.verified).length}
            </div>
            <p className="text-xs text-muted-foreground">Authentic customer feedback</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">78%</div>
            <p className="text-xs text-muted-foreground">Of reviews responded to</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Reviews</CardTitle>
          <CardDescription>Find specific customer feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input placeholder="Search reviews..." className="flex-1" />
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline">All Ratings</Button>
              <Button variant="outline">Verified Only</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
          <CardDescription>Breakdown of ratings by star count</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ratingDistribution.map(({ stars, count, percentage }) => (
              <div key={stars} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium">{stars}</span>
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                </div>
                <div className="flex-1">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                <div className="w-16 text-right">
                  <span className="text-sm text-muted-foreground">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
          <CardDescription>All ratings and feedback from customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {storeRatings.map((rating) => (
              <div key={rating.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{rating.user}</h4>
                      {rating.verified && (
                        <span className="text-xs text-success bg-success/10 px-2 py-1 rounded">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < rating.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {rating.comment && (
                  <p className="text-sm text-muted-foreground mb-3">{rating.comment}</p>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {rating.date}
                    </span>
                    <span>{rating.helpful} people found this helpful</span>
                  </div>
                  
                  <div className="flex gap-3">
                    <button className="text-primary hover:underline text-sm">
                      Respond
                    </button>
                    <button className="text-primary hover:underline text-sm">
                      Helpful
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
