import { 
  LayoutDashboard, 
  Store, 
  Users, 
  Star, 
  Settings,
  LogOut,
  Search,
  UserPlus,
  BarChart3
} from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth, type UserRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const menuItems: Record<UserRole, Array<{ title: string; url: string; icon: any }>> = {
  admin: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Manage Users", url: "/users", icon: Users },
    { title: "Manage Stores", url: "/stores", icon: Store },
    { title: "Add User", url: "/add-user", icon: UserPlus },
    { title: "Analytics", url: "/analytics", icon: BarChart3 },
  ],
  user: [
    { title: "Browse Stores", url: "/browse", icon: Search },
    { title: "My Ratings", url: "/my-ratings", icon: Star },
    { title: "Profile", url: "/profile", icon: Settings },
  ],
  "store-owner": [
    { title: "My Dashboard", url: "/store-dashboard", icon: LayoutDashboard },
    { title: "Store Ratings", url: "/store-ratings", icon: Star },
    { title: "Profile", url: "/profile", icon: Settings },
  ],
};

export function AppSidebar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const items = menuItems[user.role] || [];

  return (
    <Sidebar className="border-r border-border" collapsible="none">
      <SidebarHeader className="p-6 border-b border-border">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-primary">Rating Voyage</h2>
          <p className="text-sm text-muted-foreground">
            Welcome, {user.name.split(' ')[0]}
          </p>
          <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
            {user.role === 'admin' ? 'System Admin' : 
             user.role === 'store-owner' ? 'Store Owner' : 'User'}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) =>
                        isActive 
                          ? "bg-primary text-primary-foreground font-medium" 
                          : "hover:bg-muted text-foreground"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border">
        <Button 
          variant="ghost" 
          onClick={logout}
          className="justify-start text-foreground hover:text-foreground w-full"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}