
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Search, MoreHorizontal, Shield, User, Code, TestTube, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface UserManagementProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar: string;
  };
}

const UserManagement = ({ user }: UserManagementProps) => {
  const [users, setUsers] = useState([
    {
      id: "1",
      name: "John Doe",
      email: "john@teamtasker.com",
      role: "admin",
      status: "active",
      lastActive: "2 hours ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      tasksCompleted: 15,
      projectsOwned: 3
    },
    {
      id: "2", 
      name: "Jane Smith",
      email: "jane@teamtasker.com",
      role: "project_manager",
      status: "active",
      lastActive: "30 minutes ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
      tasksCompleted: 23,
      projectsOwned: 2
    },
    {
      id: "3",
      name: "Mike Johnson", 
      email: "mike@teamtasker.com",
      role: "developer",
      status: "active",
      lastActive: "1 hour ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
      tasksCompleted: 31,
      projectsOwned: 0
    },
    {
      id: "4",
      name: "Sarah Wilson",
      email: "sarah@teamtasker.com", 
      role: "tester",
      status: "inactive",
      lastActive: "2 days ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      tasksCompleted: 18,
      projectsOwned: 0
    },
    {
      id: "5",
      name: "Alex Brown",
      email: "alex@teamtasker.com",
      role: "viewer",
      status: "active",
      lastActive: "5 hours ago", 
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      tasksCompleted: 5,
      projectsOwned: 0
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

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

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = (userId: string, newRole: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    ));
    
    toast({
      title: "Role Updated",
      description: `User role has been updated to ${newRole.replace('_', ' ')}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">Team Members</h3>
          <p className="text-gray-600">Manage user roles and permissions</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by role" />
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
        </CardContent>
      </Card>

      {/* Users Grid */}
      <div className="grid gap-4">
        {filteredUsers.map((u) => (
          <Card key={u.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={u.avatar} alt={u.name} />
                    <AvatarFallback>
                      {u.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{u.name}</h4>
                      <Badge className={`${getRoleColor(u.role)} text-xs`}>
                        <div className="flex items-center space-x-1">
                          {getRoleIcon(u.role)}
                          <span>{u.role.replace('_', ' ')}</span>
                        </div>
                      </Badge>
                      <Badge variant={u.status === "active" ? "default" : "secondary"} className="text-xs">
                        {u.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{u.email}</p>
                    <p className="text-xs text-gray-500">Last active: {u.lastActive}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-sm font-semibold">{u.tasksCompleted}</div>
                    <div className="text-xs text-gray-500">Tasks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold">{u.projectsOwned}</div>
                    <div className="text-xs text-gray-500">Projects</div>
                  </div>

                  {user.role === "admin" && u.id !== user.id && (
                    <Select 
                      value={u.role} 
                      onValueChange={(newRole) => handleRoleChange(u.id, newRole)}
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
                  )}

                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">No users found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserManagement;
