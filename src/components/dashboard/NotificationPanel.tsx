
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, CheckCircle, MessageCircle, UserPlus, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { useNotifications } from "@/hooks/useNotifications";

interface NotificationPanelProps {
  onClose: () => void;
}

const NotificationPanel = ({ onClose }: NotificationPanelProps) => {
  const { notifications, loading, markAsRead } = useNotifications();

  const getNotificationIcon = (type: string) => {
    const icons = {
      task_completed: <CheckCircle className="h-4 w-4" />,
      comment: <MessageCircle className="h-4 w-4" />,
      user_added: <UserPlus className="h-4 w-4" />,
      deadline: <AlertTriangle className="h-4 w-4" />
    };
    return icons[type as keyof typeof icons] || <CheckCircle className="h-4 w-4" />;
  };

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

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  if (loading) {
    return (
      <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white border-l shadow-lg z-40 overflow-hidden">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

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
            {notifications.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`${notification.read ? 'bg-white' : 'bg-blue-50'} hover:shadow-sm transition-shadow cursor-pointer`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${getNotificationBg(notification.type)}`}>
                        <div className={getNotificationColor(notification.type)}>
                          {getNotificationIcon(notification.type)}
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
                            {format(new Date(notification.created_at), "MMM dd, h:mm a")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
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
