
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  UserPlus, 
  Activity, 
  TrendingUp, 
  Shield, 
  User, 
  Code, 
  TestTube, 
  Eye,
  Search,
  Filter,
  MoreHorizontal,
  FolderOpen,
  Settings,
  Bell,
  Zap
} from "lucide-react";
import { useAdminData } from "@/hooks/useAdminData";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { toast } from "@/hooks/use-toast";
import AdminUserManagement from "./AdminUserManagement";
import AdminTaskManagement from "./AdminTaskManagement";
import AdminProjectManagement from "./AdminProjectManagement";
import AdminStats from "./AdminStats";

interface AdminDashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar: string;
  };
}

const AdminDashboard = ({ user }: AdminDashboardProps) => {
  const { 
    users, 
    tasks, 
    loading, 
    refreshData,
    createUser,
    updateUser,
    deleteUser,
    createTask,
    updateTask,
    deleteTask
  } = useAdminData();
  const { createNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const isAdmin = user.role === 'admin';
  const isProjectManager = user.role === 'project_manager';

  // Enhanced user creation with notifications
  const handleCreateUser = async (userData: {
    first_name: string;
    last_name: string;
    role: string;
    email: string;
  }) => {
    const result = await createUser(userData);
    
    if (!result.error) {
      // Notify all users about new user
      const allUsers = users.filter(u => u.id !== user.id);
      allUsers.forEach(async (notifyUser) => {
        await createNotification({
          user_id: notifyUser.id,
          type: 'user_added',
          title: 'New Team Member Added',
          message: `${userData.first_name} ${userData.last_name} has been added as ${userData.role}`,
          read: false
        });
      });
      
      toast({
        title: "User Created",
        description: `${userData.first_name} ${userData.last_name} has been added to the team.`,
      });
    }
    
    return result;
  };

  // Enhanced user update with notifications
  const handleUpdateUser = async (userId: string, updates: any) => {
    const result = await updateUser(userId, updates);
    
    if (!result.error && updates.role) {
      // Find the updated user
      const updatedUser = users.find(u => u.id === userId);
      if (updatedUser) {
        // Notify all users about role change
        const allUsers = users.filter(u => u.id !== user.id && u.id !== userId);
        allUsers.forEach(async (notifyUser) => {
          await createNotification({
            user_id: notifyUser.id,
            type: 'user_added',
            title: 'User Role Updated',
            message: `${updatedUser.first_name} ${updatedUser.last_name}'s role has been changed to ${updates.role}`,
            read: false
          });
        });
      }
    }
    
    return result;
  };

  if (!isAdmin && !isProjectManager) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <Card className="p-8 shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Access Denied</h3>
            <p className="text-gray-600">
              Admin or Project Manager role required to access this dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Enhanced Header with 3D effect */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {isAdmin ? 'Admin Control Center' : 'Project Management Hub'}
                  </h1>
                  <p className="text-gray-600">
                    Manage users, tasks, projects, and monitor system activity in real-time
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                className="bg-white/80 backdrop-blur-sm border-white/30 hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Activity className="h-4 w-4 mr-2" />
                <span>Refresh Data</span>
              </Button>
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                <Avatar className="h-8 w-8 ring-2 ring-white/50">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                  {isAdmin ? 'Admin' : 'PM'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Enhanced Tabs with 3D design */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-white/80 backdrop-blur-sm border border-white/30 shadow-xl rounded-xl p-2">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Dashboard Overview
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger 
                value="users" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300"
              >
                <Users className="h-4 w-4 mr-2" />
                User Management
              </TabsTrigger>
            )}
            <TabsTrigger 
              value="projects" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300"
            >
              <FolderOpen className="h-4 w-4 mr-2" />
              Project Hub
            </TabsTrigger>
            <TabsTrigger 
              value="tasks" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300"
            >
              <Zap className="h-4 w-4 mr-2" />
              Task Control
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <AdminStats 
              users={users} 
              tasks={tasks} 
              loading={loading}
              canViewUsers={isAdmin}
            />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="users" className="space-y-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-2xl p-8">
                <AdminUserManagement 
                  users={users}
                  loading={loading}
                  onRefresh={refreshData}
                  createUser={handleCreateUser}
                  updateUser={handleUpdateUser}
                  deleteUser={deleteUser}
                />
              </div>
            </TabsContent>
          )}

          <TabsContent value="projects" className="space-y-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-2xl p-8">
              <AdminProjectManagement 
                canManageAll={isAdmin}
              />
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-2xl p-8">
              <AdminTaskManagement 
                tasks={tasks}
                loading={loading}
                onRefresh={refreshData}
                canManageAll={isAdmin}
                createTask={createTask}
                updateTask={updateTask}
                deleteTask={deleteTask}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
