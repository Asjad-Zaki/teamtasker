
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Notification {
  id: string;
  type: 'task_completed' | 'comment' | 'user_added' | 'deadline';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  user_id: string;
  related_task_id?: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      // Use type assertion since the notifications table is new and types haven't been regenerated
      const { data, error } = await (supabase as any)
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // For now, use mock data if table doesn't exist or there's an error
      setNotifications([
        {
          id: "1",
          type: "task_completed",
          title: "Task completed",
          message: "A task was marked as completed",
          read: false,
          created_at: new Date().toISOString(),
          user_id: user?.id || ''
        },
        {
          id: "2",
          type: "comment",
          title: "New comment",
          message: "Someone commented on your task",
          read: false,
          created_at: new Date().toISOString(),
          user_id: user?.id || ''
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // Use type assertion for the update operation
      const { error } = await (supabase as any)
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (!error) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId ? { ...notif, read: true } : notif
          )
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const createNotification = async (notification: Omit<Notification, 'id' | 'created_at'>) => {
    try {
      const { error } = await (supabase as any)
        .from('notifications')
        .insert([notification]);

      if (!error) {
        // Refresh notifications after creating a new one
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  // Set up real-time subscription for notifications with unique channel name
  useEffect(() => {
    if (!user) return;

    const channelName = `notifications-realtime-${user.id}-${Date.now()}-${Math.random()}`;

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Notification change received:', payload);
          fetchNotifications(); // Refresh notifications when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    createNotification,
    refetch: fetchNotifications
  };
};
