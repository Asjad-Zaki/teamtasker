import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Search,
  Filter,
  MoreHorizontal,
  Shield,
  User,
  Code,
  TestTube,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { AdminUser } from "@/hooks/useAdminData";
import { toast } from "@/hooks/use-toast";
import AddUserDialog from "./AddUserDialog";

type AppRole = 'admin' | 'project_manager' | 'developer' | 'tester' | 'viewer';

interface AdminUserManagementProps {
  users: AdminUser[];
  loading: boolean;
  onRefresh: () => void;
  createUser: (userData: {
    first_name: string;
    last_name: string;
    role: string;
    email: string;
  }) => Promise<{ data: any; error: any }>;
  updateUser: (userId: string, updates: Partial<AdminUser>) => Promise<{ data: any; error: any }>;
  deleteUser: (userId: string) => Promise<{ error: any }>;
}

const AdminUserManagement = ({ 
  users, 
  loading, 
  onRefresh, 
  createUser, 
  updateUser, 
  deleteUser 
}: AdminUserManagementProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role: string) => {
    const icons = {
      admin: <Shield className="h-4 w-4" />,
      project_manager: <User className="h-4 w-4" />,
      developer: <Code className="h-4 w-4" />,
      tester: <TestTube className="h-4 w-4" />,
      viewer: <Eye className="h-4 w-4" />
    };
    return icons[role as keyof typeof icons] || <User className="h-4 w-4" />;
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: "bg-red-500 text-white",
      project_manager: "bg-blue-500 text-white",
      developer: "bg-green-500 text-white",
      tester: "bg-yellow-500 text-white",
      viewer: "bg-gray-500 text-white"
    };
    return colors[role as keyof typeof colors] || "bg-gray-500 text-white";
  };

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      const { error } = await updateUser(userId, { role: newRole as AppRole });
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to update user role.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Role Updated",
          description: "User role has been updated successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const { error } = await deleteUser(userId);
        
        if (error) {
          toast({
            title: "Error",
            description: "Failed to delete user.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "User Deleted",
            description: "User has been deleted successfully.",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete user.",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse flex items-center space-x-4">
                <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="project_manager">Project Manager</SelectItem>
              <SelectItem value="developer">Developer</SelectItem>
              <SelectItem value="tester">Tester</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <AddUserDialog onAddUser={createUser} />
      </div>

      {/* Users List */}
      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar_url || ''} alt={user.first_name || ''} />
                    <AvatarFallback>
                      {user.first_name?.[0]}{user.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {user.first_name} {user.last_name}
                    </h3>
                    <p className="text-gray-600">{user.email}</p>
                    <div className="flex items-center mt-2">
                      <Badge className={`${getRoleColor(user.role)} text-xs`}>
                        {getRoleIcon(user.role)}
                        <span className="ml-1 capitalize">
                          {user.role.replace('_', ' ')}
                        </span>
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Select 
                    value={user.role} 
                    onValueChange={(value) => handleRoleUpdate(user.id, value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="project_manager">Project Manager</SelectItem>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="tester">Tester</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">
              {searchTerm || roleFilter !== "all" 
                ? "Try adjusting your search or filter criteria."
                : "No users available."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminUserManagement;
