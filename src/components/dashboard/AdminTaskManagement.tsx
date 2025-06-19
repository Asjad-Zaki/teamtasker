
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Activity,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Clock,
  CheckCircle,
  AlertTriangle,
  Edit,
  Trash2
} from "lucide-react";
import { AdminTask } from "@/hooks/useAdminData";
import { toast } from "@/hooks/use-toast";

interface AdminTaskManagementProps {
  tasks: AdminTask[];
  loading: boolean;
  onRefresh: () => void;
  canManageAll: boolean;
  createTask: (taskData: {
    title: string;
    description?: string;
    priority: string;
    assignee_id?: string;
    due_date?: string;
  }) => Promise<{ data: any; error: any }>;
  updateTask: (taskId: string, updates: Partial<AdminTask>) => Promise<{ data: any; error: any }>;
  deleteTask: (taskId: string) => Promise<{ error: any }>;
}

const AdminTaskManagement = ({ 
  tasks, 
  loading, 
  onRefresh, 
  canManageAll,
  createTask,
  updateTask,
  deleteTask 
}: AdminTaskManagementProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      todo: "bg-gray-500 text-white",
      progress: "bg-blue-500 text-white",
      review: "bg-yellow-500 text-white",
      done: "bg-green-500 text-white"
    };
    return colors[status as keyof typeof colors] || "bg-gray-500 text-white";
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-orange-100 text-orange-800",
      urgent: "bg-red-100 text-red-800"
    };
    return colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      todo: <Clock className="h-4 w-4" />,
      progress: <Activity className="h-4 w-4" />,
      review: <AlertTriangle className="h-4 w-4" />,
      done: <CheckCircle className="h-4 w-4" />
    };
    return icons[status as keyof typeof icons] || <Clock className="h-4 w-4" />;
  };

  const handleStatusUpdate = async (taskId: string, newStatus: string) => {
    try {
      const { error } = await updateTask(taskId, { status: newStatus });
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to update task status.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Task Updated",
          description: "Task status has been updated successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task status.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        const { error } = await deleteTask(taskId);
        
        if (error) {
          toast({
            title: "Error",
            description: "Failed to delete task.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Task Deleted",
            description: "Task has been deleted successfully.",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete task.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCreateTask = async () => {
    try {
      const { error } = await createTask({
        title: "New Task",
        description: "Task description",
        priority: "medium"
      });
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to create task.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Task Created",
          description: "New task has been created successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-20"></div>
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
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="progress">In Progress</SelectItem>
              <SelectItem value="review">In Review</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {canManageAll && (
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCreateTask}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        )}
      </div>

      {/* Tasks Grid */}
      <div className="grid gap-4">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {task.title}
                    </h3>
                    <Badge className={`${getStatusColor(task.status)} text-xs`}>
                      {getStatusIcon(task.status)}
                      <span className="ml-1 capitalize">{task.status}</span>
                    </Badge>
                    <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
                      {task.priority.toUpperCase()}
                    </Badge>
                  </div>
                  
                  {task.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {task.assignee_name && (
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{task.assignee_name}</span>
                      </div>
                    )}
                    {task.due_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(task.due_date).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(task.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Select 
                    value={task.status} 
                    onValueChange={(value) => handleStatusUpdate(task.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="progress">In Progress</SelectItem>
                      <SelectItem value="review">In Review</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                  {canManageAll && (
                    <>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No tasks available."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminTaskManagement;
