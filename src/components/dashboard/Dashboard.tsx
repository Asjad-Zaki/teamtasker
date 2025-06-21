
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, LogOut, Plus, Search, Settings, Users, Shield, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import KanbanBoard from "./KanbanBoard";
import UserManagement from "./UserManagement";
import ProjectOverview from "./ProjectOverview";
import NotificationPanel from "./NotificationPanel";
import AddTaskDialog from "./AddTaskDialog";
import AdminDashboard from "./AdminDashboard";

interface DashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar: string;
  };
  onLogout: () => void;
}

const Dashboard = ({ user }: DashboardProps) => {
  const { signOut } = useAuth();
  const { unreadCount } = useNotifications();
  const [activeTab, setActiveTab] = useState("tasks");
  const [showNotifications, setShowNotifications] = useState(false);

  const getRoleColor = (role: string) => {
    const colors = {
      admin: "bg-red-500",
      project_manager: "bg-blue-500", 
      developer: "bg-green-500",
      tester: "bg-yellow-500",
      viewer: "bg-gray-500"
    };
    return colors[role as keyof typeof colors] || "bg-gray-500";
  };

  const getRoleDisplayName = (role: string) => {
    const names = {
      admin: "Admin",
      project_manager: "Project Manager",
      developer: "Developer",
      tester: "Tester",
      viewer: "Viewer"
    };
    return names[role as keyof typeof names] || role;
  };

  // Role-based permissions
  const permissions = {
    canManageUsers: user.role === "admin",
    canCreateProjects: user.role === "admin" || user.role === "project_manager",
    canDeleteProjects: user.role === "admin",
    canCreateTasks: user.role === "admin" || user.role === "project_manager" || user.role === "developer",
    canDeleteTasks: user.role === "admin" || user.role === "project_manager",
    canEditTasks: user.role === "admin" || user.role === "project_manager" || user.role === "developer" || user.role === "tester",
    canViewOnly: user.role === "viewer",
    canComment: user.role !== "viewer",
    canMarkTested: user.role === "tester" || user.role === "admin" || user.role === "project_manager"
  };

  const handleLogout = async () => {
    await signOut();
  };

  // For Admin and Project Manager users, show the AdminDashboard
  if (user.role === "admin" || user.role === "project_manager") {
    return <AdminDashboard user={user} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TT</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">TeamTasker</h1>
            </div>
            
            {!permissions.canViewOnly && (
              <div className="hidden md:flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search tasks, projects..." 
                  className="w-64 border-gray-200"
                />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                  {unreadCount}
                </Badge>
              )}
            </Button>

            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">{user.name}</span>
                  <Badge className={`${getRoleColor(user.role)} text-white text-xs`}>
                    {getRoleDisplayName(user.role)}
                  </Badge>
                </div>
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back, {user.name.split(' ')[0]}!
            </h2>
            <p className="text-gray-600">
              {permissions.canViewOnly 
                ? "Here's your read-only view of the projects and tasks."
                : "Here's what's happening with your projects today."
              }
            </p>
            {permissions.canViewOnly && (
              <div className="mt-2 flex items-center space-x-2 text-amber-600">
                <Eye className="h-4 w-4" />
                <span className="text-sm">You have view-only access</span>
              </div>
            )}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white border">
              <TabsTrigger value="tasks" className="data-[state=active]:bg-blue-50">
                Task Board
              </TabsTrigger>
              <TabsTrigger value="projects" className="data-[state=active]:bg-blue-50">
                Projects
              </TabsTrigger>
              {permissions.canManageUsers && (
                <TabsTrigger value="users" className="data-[state=active]:bg-blue-50">
                  <Users className="h-4 w-4 mr-2" />
                  Users
                </TabsTrigger>
              )}
              <TabsTrigger value="settings" className="data-[state=active]:bg-blue-50">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tasks" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Task Board</h3>
                {permissions.canCreateTasks && (
                  <AddTaskDialog 
                    trigger={
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        <Plus className="h-4 w-4 mr-2" />
                        New Task
                      </Button>
                    }
                  />
                )}
              </div>
              <KanbanBoard user={user} />
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <ProjectOverview user={user} />
            </TabsContent>

            {permissions.canManageUsers && (
              <TabsContent value="users" className="space-y-6">
                <UserManagement user={user} />
              </TabsContent>
            )}

            <TabsContent value="settings" className="space-y-6">
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Your Role</h4>
                      <p className="text-sm text-gray-600">
                        Current access level: {getRoleDisplayName(user.role)}
                      </p>
                    </div>
                    <Badge className={`${getRoleColor(user.role)} text-white`}>
                      {getRoleDisplayName(user.role)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Permissions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${permissions.canCreateTasks ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span>Create Tasks</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${permissions.canEditTasks ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span>Edit Tasks</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${permissions.canDeleteTasks ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span>Delete Tasks</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${permissions.canCreateProjects ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span>Create Projects</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${permissions.canComment ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span>Add Comments</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${permissions.canMarkTested ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span>Mark as Tested</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>

        {/* Notification Panel */}
        {showNotifications && (
          <NotificationPanel onClose={() => setShowNotifications(false)} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
