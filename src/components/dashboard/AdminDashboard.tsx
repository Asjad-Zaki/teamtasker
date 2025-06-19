
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
  MoreHorizontal
} from "lucide-react";
import { useAdminData } from "@/hooks/useAdminData";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import AdminUserManagement from "./AdminUserManagement";
import AdminTaskManagement from "./AdminTaskManagement";
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
  const { users, tasks, loading, refreshData } = useAdminData();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const isAdmin = user.role === 'admin';
  const isProjectManager = user.role === 'project_manager';

  if (!isAdmin && !isProjectManager) {
    return (
      <Card className="p-6">
        <CardContent>
          <p className="text-center text-gray-500">
            Access denied. Admin or Project Manager role required.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isAdmin ? 'Admin Dashboard' : 'Project Manager Dashboard'}
          </h2>
          <p className="text-gray-600">
            Manage users, tasks, and monitor system activity in real-time
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            className="flex items-center space-x-2"
          >
            <Activity className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white border">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50">
            <TrendingUp className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="users" className="data-[state=active]:bg-blue-50">
              <Users className="h-4 w-4 mr-2" />
              User Management
            </TabsTrigger>
          )}
          <TabsTrigger value="tasks" className="data-[state=active]:bg-blue-50">
            <Activity className="h-4 w-4 mr-2" />
            Task Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <AdminStats 
            users={users} 
            tasks={tasks} 
            loading={loading}
            canViewUsers={isAdmin}
          />
        </TabsContent>

        {isAdmin && (
          <TabsContent value="users" className="space-y-6">
            <AdminUserManagement 
              users={users}
              loading={loading}
              onRefresh={refreshData}
            />
          </TabsContent>
        )}

        <TabsContent value="tasks" className="space-y-6">
          <AdminTaskManagement 
            tasks={tasks}
            loading={loading}
            onRefresh={refreshData}
            canManageAll={isAdmin}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
