
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, MessageCircle, Paperclip, Calendar, Edit, Trash2, TestTube, Eye } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Task } from "@/hooks/useTasks";
import TaskEditDialog from "./TaskEditDialog";
import { toast } from "@/hooks/use-toast";

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  getPriorityColor: (priority: string) => string;
  getLabelColor: (label: string) => string;
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => Promise<{ data: any; error: any }>;
  onDeleteTask?: (taskId: string) => Promise<{ error: any }>;
  canEdit?: boolean;
  canDrag?: boolean;
  userRole?: string;
}

const TaskCard = ({ 
  task, 
  onDragStart, 
  getPriorityColor, 
  getLabelColor,
  onUpdateTask,
  onDeleteTask,
  canEdit = true,
  canDrag = true,
  userRole = 'developer'
}: TaskCardProps) => {
  
  // Role-specific permissions
  const permissions = {
    canEdit: canEdit && (userRole === "admin" || userRole === "project_manager" || userRole === "developer" || userRole === "tester"),
    canDelete: userRole === "admin" || userRole === "project_manager",
    canMarkTested: userRole === "tester" || userRole === "admin" || userRole === "project_manager",
    canComment: userRole !== "viewer",
    isViewer: userRole === "viewer"
  };

  const handleDeleteTask = async () => {
    if (!permissions.canDelete) return;
    
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        if (onDeleteTask) {
          const { error } = await onDeleteTask(task.id);
          
          if (error) {
            toast({
              title: "Error",
              description: "Failed to delete task.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Success",
              description: "Task deleted successfully.",
            });
          }
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

  const handleMarkTested = async () => {
    if (!permissions.canMarkTested || !onUpdateTask) return;
    
    try {
      const { error } = await onUpdateTask(task.id, { 
        status: 'review',
        labels: [...(task.labels || []), 'tested'].filter((label, index, arr) => arr.indexOf(label) === index)
      });
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to mark task as tested.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Task marked as tested and moved to review.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark task as tested.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card 
      className={`hover:shadow-md transition-shadow relative group ${
        canDrag ? 'cursor-move' : 'cursor-default'
      } ${permissions.isViewer ? 'border-gray-200' : ''}`}
      draggable={canDrag}
      onDragStart={canDrag ? (e) => onDragStart(e, task.id) : undefined}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
            <CardTitle className="text-sm font-medium leading-tight">
              {task.title}
            </CardTitle>
            {permissions.isViewer && (
              <Eye className="h-3 w-3 text-gray-400" />
            )}
          </div>
          
          {!permissions.isViewer && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
              {permissions.canEdit && onUpdateTask && (
                <TaskEditDialog 
                  task={task}
                  onUpdateTask={onUpdateTask}
                  trigger={
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Edit className="h-3 w-3" />
                    </Button>
                  }
                />
              )}
              
              {permissions.canMarkTested && task.status === 'progress' && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                  onClick={handleMarkTested}
                  title="Mark as tested"
                >
                  <TestTube className="h-3 w-3" />
                </Button>
              )}
              
              {permissions.canDelete && onDeleteTask && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                  onClick={handleDeleteTask}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
              
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-3">
        {task.description && (
          <p className="text-xs text-gray-600 leading-relaxed">
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap gap-1">
          {task.labels && task.labels.map((label) => (
            <Badge 
              key={label} 
              variant="secondary" 
              className={`text-xs ${getLabelColor(label)}`}
            >
              {label}
            </Badge>
          ))}
        </div>

        {task.due_date && (
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(task.due_date), "MMM dd")}</span>
            </div>
            <div className="flex items-center space-x-2">
              {task.comments_count && task.comments_count > 0 && (
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-3 w-3" />
                  <span>{task.comments_count}</span>
                </div>
              )}
              {task.attachments_count && task.attachments_count > 0 && (
                <div className="flex items-center space-x-1">
                  <Paperclip className="h-3 w-3" />
                  <span>{task.attachments_count}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Avatar className="h-6 w-6">
            <AvatarImage src={task.assignee_avatar || ''} alt={task.assignee_name || ''} />
            <AvatarFallback className="text-xs">
              {task.assignee_name?.split(' ').map(n => n[0]).join('') || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs capitalize">
              {task.priority}
            </Badge>
            {userRole === "tester" && task.status === 'progress' && (
              <Badge variant="outline" className="text-xs text-green-600">
                Ready for testing
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
