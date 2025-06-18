
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, MessageCircle, Paperclip, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Task } from "@/hooks/useTasks";

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  getPriorityColor: (priority: string) => string;
  getLabelColor: (label: string) => string;
}

const TaskCard = ({ task, onDragStart, getPriorityColor, getLabelColor }: TaskCardProps) => {
  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-move"
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
            <CardTitle className="text-sm font-medium leading-tight">
              {task.title}
            </CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
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
          <Badge variant="outline" className="text-xs capitalize">
            {task.priority}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
