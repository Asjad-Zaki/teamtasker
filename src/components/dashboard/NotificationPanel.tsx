
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, CheckCircle, MessageCircle, UserPlus, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

interface NotificationPanelProps {
  onClose: () => void;
}

const NotificationPanel = ({ onClose }: NotificationPanelProps) => {
  const notifications = [
    {
      id: "1",
      type: "task_completed",
      title: "Task completed",
      message: "Mike Johnson completed 'Build task management API'",
      timestamp: new Date(2024, 6, 17, 14, 30),
      read: false,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
      icon: <CheckCircle className="h-4 w-4" />
    },
    {
      id: "2",
      type: "comment",
      title: "New comment",
      message: "Sarah Wilson commented on 'Test user registration flow'",
      timestamp: new Date(2024, 6, 17, 13, 15),
      read: false,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      icon: <MessageCircle className="h-4 w-4" />
    },
    {
      id: "3",
      type: "user_added",
      title: "New team member",
      message: "Alex Brown was added to the E-commerce Platform project",
      timestamp: new Date(2024, 6, 17, 11, 45),
      read: true,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      icon: <UserPlus className="h-4 w-4" />
    },
    {
      id: "4",
      type: "deadline",
      title: "Deadline reminder",
      message: "Mobile App Redesign project due in 3 days",
      timestamp: new Date(2024, 6, 17, 9, 0),
      read: true,
      avatar: null,
      icon: <AlertTriangle className="h-4 w-4" />
    }
  ];

  const getNotificationColor = (type: string) => {
    const colors = {
      task_completed: "text-green-600",
      comment: "text-blue-600",
      user_added: "text-purple-600",
      deadline: "text-orange-600"
    };
    return colors[type as keyof typeof colors] || "text-gray-600";
  };

  const getNotificationBg = (type: string) => {
    const colors = {
      task_completed: "bg-green-100",
      comment: "bg-blue-100", 
      user_added: "bg-purple-100",
      deadline: "bg-orange-100"
    };
    return colors[type as keyof typeof colors] || "bg-gray-100";
  };

  return (
    <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white border-l shadow-lg z-40 overflow-hidden">
      <div className="flex flex-col h-full">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Notifications</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {notifications.map((notification) => (
              <Card key={notification.id} className={`${notification.read ? 'bg-white' : 'bg-blue-50'} hover:shadow-sm transition-shadow cursor-pointer`}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${getNotificationBg(notification.type)}`}>
                      <div className={getNotificationColor(notification.type)}>
                        {notification.icon}
                      </div>
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">{notification.title}</h4>
                        {!notification.read && (
                          <Badge className="bg-blue-500 text-white h-2 w-2 p-0 rounded-full"></Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {format(notification.timestamp, "MMM dd, h:mm a")}
                        </span>
                        {notification.avatar && (
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={notification.avatar} />
                            <AvatarFallback className="text-xs">U</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="border-t p-4">
          <Button variant="outline" className="w-full text-sm">
            View All Notifications
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
