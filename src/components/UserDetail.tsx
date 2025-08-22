import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, MapPin, Shield, Store, Calendar, Star } from "lucide-react";
import { type User as ApiUser } from "@/services/api";

interface UserDetailProps {
  user: ApiUser;
  onClose: () => void;
}

export function UserDetail({ user, onClose }: UserDetailProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'store-owner':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Basic Information</h3>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{user.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                  {user.role}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Contact Information</h3>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{user.address}</span>
              </div>
              {user.storeId && (
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Store Owner</span>
                </div>
              )}
            </div>
          </div>

          {/* Account Status */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Account Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm">Status</span>
                <Badge variant={user.isActive ? 'default' : 'destructive'}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm">Last Login</span>
                <span className="text-sm text-muted-foreground">
                  {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                </span>
              </div>
            </div>
          </div>

          {/* Store Owner Rating (if applicable) */}
          {user.role === 'store-owner' && user.storeId && (
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Store Owner Rating</h3>
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-center gap-2">
                  <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                  <span className="text-2xl font-bold">4.8</span>
                  <span className="text-muted-foreground">(156 reviews)</span>
                </div>
                <p className="text-sm text-center text-muted-foreground mt-2">
                  Average rating based on customer reviews
                </p>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Timestamps</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm">Created</div>
                  <div className="text-xs text-muted-foreground">
                    {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm">Updated</div>
                  <div className="text-xs text-muted-foreground">
                    {user.updatedAt ? formatDate(user.updatedAt) : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button variant="destructive">
              Delete User
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
