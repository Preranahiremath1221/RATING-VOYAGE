import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Store, Calendar } from "lucide-react";

// Mock data for user ratings
const userRatings = [
  { 
    store: "Tech Paradise", 
    rating: 5, 
    comment: "Excellent service and great products!", 
    date: "2024-01-15",
    category: "Electronics"
  },
  { 
    store: "Fashion Hub", 
    rating: 4, 
    comment: "Good quality clothes, but a bit expensive", 
    date: "2024-01-10",
    category: "Fashion"
  },
  { 
    store: "Book Corner", 
    rating: 3, 
    comment: "Average selection, could be better", 
    date: "2024-01-05",
    category: "Books"
  },
  { 
    store: "Food Market", 
    rating: 5, 
    comment: "Fresh produce and friendly staff", 
    date: "2023-12-28",
    category: "Food"
  },
];

export default function MyRatings() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Ratings</h1>
        <p className="text-muted-foreground">Your rating history and reviews</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ratings</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{userRatings.length}</div>
            <p className="text-xs text-muted-foreground">All time ratings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">4.3</div>
            <p className="text-xs text-muted-foreground">Your average score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rated Stores</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">4</div>
            <p className="text-xs text-muted-foreground">Different stores rated</p>
          </CardContent>
        </Card>
      </div>

      {/* Ratings List */}
      <Card>
        <CardHeader>
          <CardTitle>Rating History</CardTitle>
          <CardDescription>All your ratings and reviews</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userRatings.map((rating, index) => (
              <div key={index} className="flex items-start justify-between p-4 border border-border rounded-lg">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{rating.store}</h3>
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                      {rating.category}
                    </span>
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
                    <span className="ml-2 text-sm font-medium">{rating.rating}.0</span>
                  </div>
                  
                  {rating.comment && (
                    <p className="text-sm text-muted-foreground">{rating.comment}</p>
                  )}
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Rated on {rating.date}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button className="text-sm text-primary hover:underline">
                    Edit
                  </button>
                  <button className="text-sm text-destructive hover:underline">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
