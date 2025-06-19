
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdminUser {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role: string;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface AdminTask {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  assignee_id?: string;
  assignee_name?: string;
  assignee_avatar?: string;
  due_date?: string;
  created_at: string;
  updated_at?: string;
  comments_count?: number;
  attachments_count?: number;
}

export const useAdminData = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Use mock emails for now since we can't access auth.users directly
      const transformedUsers = (data || []).map(profile => ({
        ...profile,
        email: `${profile.first_name?.toLowerCase() || 'user'}@teamtasker.com`
      }));
      
      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const fetchTasks = async () => {
    try {
      const { data: tasksData, error } = await supabase
        .from('tasks')
        .select(`
          *,
          assignee:profiles(first_name, last_name, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedTasks = (tasksData || []).map(task => ({
        ...task,
        assignee_name: task.assignee ? 
          `${task.assignee.first_name || ''} ${task.assignee.last_name || ''}`.trim() : 
          undefined,
        assignee_avatar: task.assignee?.avatar_url,
        comments_count: task.comments_count || 0,
        attachments_count: task.attachments_count || 0
      }));

      setTasks(transformedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([fetchUsers(), fetchTasks()]);
    setLoading(false);
  };

  // User CRUD operations
  const createUser = async (userData: {
    first_name: string;
    last_name: string;
    role: string;
    email: string;
  }) => {
    try {
      // In a real app, this would create an auth user first
      // For now, we'll create a profile directly
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          first_name: userData.first_name,
          last_name: userData.last_name,
          role: userData.role,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`
        }])
        .select()
        .single();

      if (error) throw error;
      await refreshData();
      return { data, error: null };
    } catch (error) {
      console.error('Error creating user:', error);
      return { data: null, error };
    }
  };

  const updateUser = async (userId: string, updates: Partial<AdminUser>) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      await refreshData();
      return { data, error: null };
    } catch (error) {
      console.error('Error updating user:', error);
      return { data: null, error };
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      await refreshData();
      return { error: null };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { error };
    }
  };

  // Task CRUD operations
  const createTask = async (taskData: {
    title: string;
    description?: string;
    priority: string;
    assignee_id?: string;
    due_date?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([taskData])
        .select()
        .single();

      if (error) throw error;
      await refreshData();
      return { data, error: null };
    } catch (error) {
      console.error('Error creating task:', error);
      return { data: null, error };
    }
  };

  const updateTask = async (taskId: string, updates: Partial<AdminTask>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;
      await refreshData();
      return { data, error: null };
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
      await refreshData();
      return { error: null };
    } catch (error) {
      console.error('Error deleting task:', error);
      return { error };
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return {
    users,
    tasks,
    loading,
    refreshData,
    // User CRUD
    createUser,
    updateUser,
    deleteUser,
    // Task CRUD
    createTask,
    updateTask,
    deleteTask
  };
};
