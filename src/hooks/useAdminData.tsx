
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface AdminUser {
  id: string;
  email?: string; // Make email optional since profiles table doesn't have it
  first_name?: string;
  last_name?: string;
  role: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminTask {
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
  created_at: string;
  updated_at: string;
}

export const useAdminData = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchUsers = async () => {
    try {
      // Join profiles with auth.users to get email
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          users:id (email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to include email from auth.users
      const transformedUsers = (data || []).map(profile => ({
        ...profile,
        email: profile.users?.email || `user-${profile.id.slice(0, 8)}@example.com` // Fallback email
      }));
      
      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Set mock data if there's an error
      setUsers([]);
    }
  };

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          assignee:profiles!tasks_assignee_id_fkey(
            first_name,
            last_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface with proper type assertions
      const transformedTasks = (data || []).map(task => ({
        ...task,
        status: task.status as AdminTask['status'],
        priority: task.priority as AdminTask['priority'],
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

  useEffect(() => {
    refreshData();
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    const usersChannel = supabase
      .channel(`admin-users-${Date.now()}-${Math.random()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        () => {
          console.log('Users data changed, refreshing...');
          fetchUsers();
        }
      )
      .subscribe();

    const tasksChannel = supabase
      .channel(`admin-tasks-${Date.now()}-${Math.random()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks'
        },
        () => {
          console.log('Tasks data changed, refreshing...');
          fetchTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(usersChannel);
      supabase.removeChannel(tasksChannel);
    };
  }, []);

  return {
    users,
    tasks,
    loading,
    refreshData
  };
};
