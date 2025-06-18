
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
      const { data, error } = await supabase
        .from('tasks')
        .insert([taskData])
        .select()
        .single();

      if (error) throw error;

      const newTask = {
        ...data,
        status: data.status as Task['status'],
        priority: data.priority as Task['priority']
      };

      setTasks(prev => [newTask, ...prev]);

      // Create notification for task creation
      if (taskData.assignee_id && taskData.assignee_id !== user?.id) {
        await createNotification({
          user_id: taskData.assignee_id,
          type: 'user_added',
          title: 'New Task Assigned',
          message: `You have been assigned to task: ${taskData.title}`,
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

      // Create notification for status change to 'done'
      if (updates.status === 'done' && updatedTask.assignee_id) {
        await createNotification({
          user_id: updatedTask.assignee_id,
          type: 'task_completed',
          title: 'Task Completed',
          message: `Task "${updatedTask.title}" has been marked as completed`,
          read: false,
          related_task_id: taskId
        });
      }

      return { data: updatedTask, error: null };
    } catch (error) {
      console.error('Error updating task:', error);
      return { data: null, error };
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prev => prev.filter(task => task.id !== taskId));
      return { error: null };
    } catch (error) {
      console.error('Error deleting task:', error);
      return { error };
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Set up real-time subscription for tasks
  useEffect(() => {
    const channel = supabase
      .channel('tasks-changes')
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
