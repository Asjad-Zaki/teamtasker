
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, MessageCircle, Paperclip, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTasks } from "@/hooks/useTasks";
import AddTaskDialog from "./AddTaskDialog";

interface KanbanBoardProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar: string;
  };
}

const KanbanBoard = ({ user }: KanbanBoardProps) => {
  const { tasks, loading } = useTasks();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const tasksByStatus = {
    todo: tasks.filter(task => task.status === 'todo'),
    progress: tasks.filter(task => task.status === 'progress'),
    review: tasks.filter(task => task.status === 'review'),
    done: tasks.filter(task => task.status === 'done')
  };

  const columns = [
    { id: "todo", title: "To Do", count: tasksByStatus.todo.length, color: "bg-gray-100" },
    { id: "progress", title: "In Progress", count: tasksByStatus.progress.length, color: "bg-blue-100" },
    { id: "review", title: "In Review", count: tasksByStatus.review.length, color: "bg-yellow-100" },
    { id: "done", title: "Done", count: tasksByStatus.done.length, color: "bg-green-100" }
  ];

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "bg-red-500",
      medium: "bg-yellow-500", 
      low: "bg-green-500"
    };
    return colors[priority as keyof typeof colors] || "bg-gray-500";
  };

  const getLabelColor = (label: string) => {
    const colors = {
      backend: "bg-blue-100 text-blue-800",
      frontend: "bg-green-100 text-green-800",
      design: "bg-purple-100 text-purple-800",
      testing: "bg-orange-100 text-orange-800",
      api: "bg-cyan-100 text-cyan-800",
      ui: "bg-pink-100 text-pink-800",
      security: "bg-red-100 text-red-800",
      qa: "bg-yellow-100 text-yellow-800",
      setup: "bg-gray-100 text-gray-800",
      devops: "bg-indigo-100 text-indigo-800",
      realtime: "bg-teal-100 text-teal-800",
      mobile: "bg-rose-100 text-rose-800"
    };
    return colors[label as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {columns.map((column) => (
        <div key={column.id} className="space-y-4">
          <div className={`${column.color} rounded-lg p-4`}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">{column.title}</h3>
              <Badge variant="secondary" className="bg-white text-gray-700">
                {column.count}
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            {tasksByStatus[column.id as keyof typeof tasksByStatus].map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow cursor-pointer">
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
                    {task.labels.map((label) => (
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
                        {task.comments_count > 0 && (
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="h-3 w-3" />
                            <span>{task.comments_count}</span>
                          </div>
                        )}
                        {task.attachments_count > 0 && (
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
            ))}

            {column.id !== "done" && (
              <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
                <CardContent className="p-4 text-center">
                  <AddTaskDialog status={column.id} />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
