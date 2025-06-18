
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'todo' | 'progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee_id: string | null;
  assignee_name: string | null;
  assignee_avatar: string | null;
  due_date: string | null;
  comments_count: number;
  attachments_count: number;
  labels: string[];
  created_at: string;
  updated_at: string;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion to ensure compatibility with our Task interface
      const typedTasks = (data || []).map(task => ({
        ...task,
        status: task.status as 'todo' | 'progress' | 'review' | 'done',
        priority: task.priority as 'low' | 'medium' | 'high',
        labels: task.labels || [],
        comments_count: task.comments_count || 0,
        attachments_count: task.attachments_count || 0
      })) as Task[];
      
      setTasks(typedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    due_date?: string;
    labels?: string[];
  }) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          ...taskData,
          assignee_name: user?.email?.split('@')[0] || 'Unassigned',
          assignee_avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'default'}`
        }])
        .select()
        .single();

      if (error) throw error;

      // Type assertion for the new task
      const typedTask = {
        ...data,
        status: data.status as 'todo' | 'progress' | 'review' | 'done',
        priority: data.priority as 'low' | 'medium' | 'high',
        labels: data.labels || [],
        comments_count: data.comments_count || 0,
        attachments_count: data.attachments_count || 0
      } as Task;

      setTasks(prev => [typedTask, ...prev]);
      toast({
        title: "Success",
        description: "Task created successfully"
      });

      return { data: typedTask, error: null };
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Type assertion for the updated task
      const typedTask = {
        ...data,
        status: data.status as 'todo' | 'progress' | 'review' | 'done',
        priority: data.priority as 'low' | 'medium' | 'high',
        labels: data.labels || [],
        comments_count: data.comments_count || 0,
        attachments_count: data.attachments_count || 0
      } as Task;

      setTasks(prev => prev.map(task => task.id === id ? typedTask : task));
      toast({
        title: "Success",
        description: "Task updated successfully"
      });

      return { data: typedTask, error: null };
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    refetch: fetchTasks
  };
};
