import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Store, Star, TrendingUp } from "lucide-react";

// Mock data for dashboard
const dashboardStats = {
  totalUsers: 1247,
  totalStores: 89,
  totalRatings: 3456,
  averageRating: 4.2
};

const recentActivity = [
  { type: 'rating', user: 'John Smith', store: 'Tech Paradise', rating: 5, time: '2 hours ago' },
  { type: 'user', user: 'Alice Johnson', action: 'joined', time: '4 hours ago' },
  { type: 'store', store: 'Fashion Hub', action: 'registered', time: '6 hours ago' },
  { type: 'rating', user: 'Mike Wilson', store: 'Book Corner', rating: 4, time: '8 hours ago' },
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">System Dashboard</h1>
        <p className="text-muted-foreground">Overview of platform activity and statistics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{dashboardStats.totalUsers}</div>
            <p className="text-xs text-success">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{dashboardStats.totalStores}</div>
            <p className="text-xs text-success">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ratings</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{dashboardStats.totalRatings}</div>
            <p className="text-xs text-success">+24% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{dashboardStats.averageRating}</div>
            <p className="text-xs text-success">+0.2 from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest platform activity and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${
                    activity.type === 'rating' ? 'bg-rating' :
                    activity.type === 'user' ? 'bg-primary' : 'bg-success'
                  }`} />
                  <div>
                    {activity.type === 'rating' ? (
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span> rated{' '}
                        <span className="font-medium">{activity.store}</span> {activity.rating} stars
                      </p>
                    ) : activity.type === 'user' ? (
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span> {activity.action} the platform
                      </p>
                    ) : (
                      <p className="text-sm">
                        <span className="font-medium">{activity.store}</span> {activity.action} as a new store
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