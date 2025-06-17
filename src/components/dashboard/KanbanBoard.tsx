
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, MessageCircle, Paperclip, Calendar } from "lucide-react";
import { format } from "date-fns";

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
  const [tasks] = useState({
    todo: [
      {
        id: "1",
        title: "Implement user authentication",
        description: "Add JWT-based authentication system",
        priority: "high",
        assignee: {
          name: "John Doe",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john"
        },
        dueDate: new Date(2024, 6, 25),
        comments: 3,
        attachments: 2,
        labels: ["backend", "security"]
      },
      {
        id: "2", 
        title: "Design dashboard wireframes",
        description: "Create wireframes for the main dashboard",
        priority: "medium",
        assignee: {
          name: "Jane Smith",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane"
        },
        dueDate: new Date(2024, 6, 28),
        comments: 1,
        attachments: 0,
        labels: ["design", "ui"]
      }
    ],
    progress: [
      {
        id: "3",
        title: "Build task management API",
        description: "Create CRUD endpoints for task management",
        priority: "high",
        assignee: {
          name: "Mike Johnson",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike"
        },
        dueDate: new Date(2024, 6, 30),
        comments: 5,
        attachments: 1,
        labels: ["backend", "api"]
      }
    ],
    review: [
      {
        id: "4",
        title: "Test user registration flow",
        description: "Comprehensive testing of the registration process",
        priority: "medium",
        assignee: {
          name: "Sarah Wilson",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah"
        },
        dueDate: new Date(2024, 7, 2),
        comments: 2,
        attachments: 0,
        labels: ["testing", "qa"]
      }
    ],
    done: [
      {
        id: "5",
        title: "Set up project repository",
        description: "Initialize Git repository and basic project structure",
        priority: "low",
        assignee: {
          name: "Alex Brown",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex"
        },
        dueDate: new Date(2024, 6, 20),
        comments: 1,
        attachments: 3,
        labels: ["setup", "devops"]
      }
    ]
  });

  const columns = [
    { id: "todo", title: "To Do", count: tasks.todo.length, color: "bg-gray-100" },
    { id: "progress", title: "In Progress", count: tasks.progress.length, color: "bg-blue-100" },
    { id: "review", title: "In Review", count: tasks.review.length, color: "bg-yellow-100" },
    { id: "done", title: "Done", count: tasks.done.length, color: "bg-green-100" }
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
      devops: "bg-indigo-100 text-indigo-800"
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
            {tasks[column.id as keyof typeof tasks].map((task) => (
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
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {task.description}
                  </p>

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

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-3 w-3" />
                      <span>{format(task.dueDate, "MMM dd")}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {task.comments > 0 && (
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-3 w-3" />
                          <span>{task.comments}</span>
                        </div>
                      )}
                      {task.attachments > 0 && (
                        <div className="flex items-center space-x-1">
                          <Paperclip className="h-3 w-3" />
                          <span>{task.attachments}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                      <AvatarFallback className="text-xs">
                        {task.assignee.name.split(' ').map(n => n[0]).join('')}
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
                  <Button variant="ghost" className="text-gray-500 text-sm">
                    + Add a task
                  </Button>
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
