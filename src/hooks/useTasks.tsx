
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee_id?: string;
  assignee_name?: string;
  assignee_avatar?: string;
  due_date?: string;
  labels?: string[];
  comments_count?: number;
  attachments_count?: number;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { createNotification } = useNotifications();

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion to ensure compatibility
      setTasks((data || []).map(task => ({
        ...task,
        status: task.status as Task['status'],
        priority: task.priority as Task['priority']
      })));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const taskWithCreator = {
        ...taskData,
        created_by: user?.id
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert([taskWithCreator])
        .select()
        .single();

      if (error) throw error;

      const newTask = {
        ...data,
        status: data.status as Task['status'],
        priority: data.priority as Task['priority']
      };

      setTasks(prev => [newTask, ...prev]);

      // Create notification for task creation - notify all relevant users
      const { data: allUsers } = await supabase
        .from('profiles')
        .select('id, role')
        .neq('id', user?.id);

      if (allUsers) {
        const relevantUsers = allUsers.filter(u => 
          u.role === 'developer' || u.role === 'tester' || u.role === 'project_manager' || u.role === 'admin'
        );

        relevantUsers.forEach(async (notifyUser) => {
          await createNotification({
            user_id: notifyUser.id,
            type: 'user_added',
            title: 'New Task Created',
            message: `A new task "${taskData.title}" has been created`,
            read: false,
            related_task_id: newTask.id
          });
        });
      }

      // Special notification for assignee if different from creator
      if (taskData.assignee_id && taskData.assignee_id !== user?.id) {
        await createNotification({
          user_id: taskData.assignee_id,
          type: 'user_added',
          title: 'Task Assigned to You',
          message: `You have been assigned to task: "${taskData.title}"`,
          read: false,
          related_task_id: newTask.id
        });
      }

      return { data: newTask, error: null };
    } catch (error) {
      console.error('Error creating task:', error);
      return { data: null, error };
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;

      const updatedTask = {
        ...data,
        status: data.status as Task['status'],
        priority: data.priority as Task['priority']
      };

      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));

      // Enhanced notification system for task updates
      const { data: allUsers } = await supabase
        .from('profiles')
        .select('id, role, first_name, last_name')
        .neq('id', user?.id);

      if (allUsers) {
        let notificationMessage = '';
        let notificationType: 'task_completed' | 'user_added' = 'user_added';

        // Determine notification message based on what was updated
        if (updates.status === 'done') {
          notificationMessage = `Task "${updatedTask.title}" has been completed`;
          notificationType = 'task_completed';
        } else if (updates.status) {
          notificationMessage = `Task "${updatedTask.title}" status changed to ${updates.status}`;
        } else if (updates.priority) {
          notificationMessage = `Task "${updatedTask.title}" priority changed to ${updates.priority}`;
        } else if (updates.assignee_id) {
          notificationMessage = `Task "${updatedTask.title}" has been reassigned`;
        } else {
          notificationMessage = `Task "${updatedTask.title}" has been updated`;
        }

        // Notify relevant users (developers, testers, project managers, admins)
        const relevantUsers = allUsers.filter(u => 
          u.role === 'developer' || u.role === 'tester' || u.role === 'project_manager' || u.role === 'admin'
        );

        relevantUsers.forEach(async (notifyUser) => {
          await createNotification({
            user_id: notifyUser.id,
            type: notificationType,
            title: 'Task Updated',
            message: notificationMessage,
            read: false,
            related_task_id: taskId
          });
        });

        // Special notification for new assignee
        if (updates.assignee_id && updates.assignee_id !== user?.id) {
          await createNotification({
            user_id: updates.assignee_id,
            type: 'user_added',
            title: 'Task Assigned to You',
            message: `You have been assigned to task: "${updatedTask.title}"`,
            read: false,
            related_task_id: taskId
          });
        }
      }

      return { data: updatedTask, error: null };
    } catch (error) {
      console.error('Error updating task:', error);
      return { data: null, error };
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      // Get task details before deletion for notification
      const taskToDelete = tasks.find(t => t.id === taskId);
      
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prev => prev.filter(task => task.id !== taskId));

      // Notify relevant users about task deletion
      if (taskToDelete) {
        const { data: allUsers } = await supabase
          .from('profiles')
          .select('id, role')
          .neq('id', user?.id);

        if (allUsers) {
          const relevantUsers = allUsers.filter(u => 
            u.role === 'developer' || u.role === 'tester' || u.role === 'project_manager' || u.role === 'admin'
          );

          relevantUsers.forEach(async (notifyUser) => {
            await createNotification({
              user_id: notifyUser.id,
              type: 'user_added',
              title: 'Task Deleted',
              message: `Task "${taskToDelete.title}" has been deleted`,
              read: false
            });
          });
        }
      }

      return { error: null };
    } catch (error) {
      console.error('Error deleting task:', error);
      return { error };
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Set up real-time subscription for tasks with unique channel name
  useEffect(() => {
    const channelName = `tasks-realtime-${Date.now()}-${Math.random()}`;
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks'
        },
        (payload) => {
          console.log('Task change received:', payload);
          fetchTasks(); // Refresh tasks when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks
  };
};
