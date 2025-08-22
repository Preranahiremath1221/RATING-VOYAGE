import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Star, Users, TrendingUp, Eye, DollarSign } from "lucide-react";

// Mock store data
const storeData = {
  name: "Tech Paradise",
  category: "Electronics",
  totalRatings: 456,
  averageRating: 4.8,
  totalVisitors: 1247,
  revenue: 12500,
  monthlyGrowth: 12.5
};

const recentActivity = [
  { type: 'rating', user: 'John Smith', rating: 5, comment: 'Excellent products!', time: '2 hours ago' },
  { type: 'visit', user: 'Alice Johnson', action: 'browsed', time: '4 hours ago' },
  { type: 'purchase', user: 'Mike Wilson', amount: 249.99, time: '6 hours ago' },
  { type: 'rating', user: 'Sarah Brown', rating: 4, comment: 'Good service', time: '8 hours ago' },
];

export default function StoreDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Store Dashboard</h1>
        <p className="text-muted-foreground">Manage your store performance and analytics</p>
      </div>

      {/* Store Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ratings</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{storeData.totalRatings}</div>
            <p className="text-xs text-success">+24% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{storeData.averageRating}</div>
            <p className="text-xs text-success">+0.2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{storeData.totalVisitors}</div>
            <p className="text-xs text-success">+15% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${storeData.revenue}</div>
            <p className="text-xs text-success">+{storeData.monthlyGrowth}% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Store Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
            <CardDescription>Basic details about your store</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Store className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold">{storeData.name}</h3>
                <p className="text-sm text-muted-foreground">{storeData.category}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Store ID</span>
                <span className="font-medium">ST-001</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="font-medium text-success">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Registration Date</span>
                <span className="font-medium">2023-03-15</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your store operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted transition-colors">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="font-medium">View Store Page</h4>
                  <p className="text-sm text-muted-foreground">See how customers view your store</p>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted transition-colors">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="font-medium">Update Products</h4>
                  <p className="text-sm text-muted-foreground">Add or modify your product catalog</p>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted transition-colors">
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="font-medium">Respond to Reviews</h4>
                  <p className="text-sm text-muted-foreground">Engage with customer feedback</p>
                </div>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest interactions with your store</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${
                    activity.type === 'rating' ? 'bg-yellow-400' :
                    activity.type === 'visit' ? 'bg-blue-400' : 'bg-green-400'
                  }`} />
                  <div>
                    {activity.type === 'rating' ? (
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span> rated your store {activity.rating} stars
                        {activity.comment && `: "${activity.comment}"`}
                      </p>
                    ) : activity.type === 'visit' ? (
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span> {activity.action} your store
                      </p>
                    ) : (
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span> made a purchase of ${activity.amount}
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
