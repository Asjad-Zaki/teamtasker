
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type AppRole = 'admin' | 'project_manager' | 'developer' | 'tester' | 'viewer';

export interface AdminUser {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role: AppRole;
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

export interface AdminProject {
  id: string;
  name: string;
  description?: string;
  status: string;
  owner_id?: string;
  owner_name?: string;
  created_at: string;
  updated_at?: string;
  tasks_count?: number;
  members_count?: number;
}

export const useAdminData = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform users and add mock emails
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

  const fetchProjects = async () => {
    try {
      // Since we don't have a projects table yet, let's create some mock data
      const mockProjects: AdminProject[] = [
        {
          id: '1',
          name: 'TeamTasker Development',
          description: 'Main development project for TeamTasker platform',
          status: 'active',
          owner_id: '1',
          owner_name: 'Admin User',
          created_at: new Date().toISOString(),
          tasks_count: 15,
          members_count: 5
        },
        {
          id: '2',
          name: 'Mobile App',
          description: 'React Native mobile application',
          status: 'planning',
          owner_id: '2',
          owner_name: 'Project Manager',
          created_at: new Date().toISOString(),
          tasks_count: 8,
          members_count: 3
        }
      ];
      
      setProjects(mockProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([fetchUsers(), fetchTasks(), fetchProjects()]);
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
      // Generate a UUID for the new user profile
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          id: crypto.randomUUID(),
          first_name: userData.first_name,
          last_name: userData.last_name,
          role: userData.role as AppRole,
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
      // Ensure role is properly typed
      const updateData: any = { ...updates };
      if (updates.role) {
        updateData.role = updates.role as AppRole;
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
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

  // Project CRUD operations (mock for now)
  const createProject = async (projectData: {
    name: string;
    description?: string;
    status: string;
  }) => {
    try {
      const newProject: AdminProject = {
        id: crypto.randomUUID(),
        name: projectData.name,
        description: projectData.description,
        status: projectData.status,
        owner_id: '1',
        owner_name: 'Current User',
        created_at: new Date().toISOString(),
        tasks_count: 0,
        members_count: 1
      };

      setProjects(prev => [newProject, ...prev]);
      return { data: newProject, error: null };
    } catch (error) {
      console.error('Error creating project:', error);
      return { data: null, error };
    }
  };

  const updateProject = async (projectId: string, updates: Partial<AdminProject>) => {
    try {
      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { ...project, ...updates, updated_at: new Date().toISOString() }
          : project
      ));
      return { data: updates, error: null };
    } catch (error) {
      console.error('Error updating project:', error);
      return { data: null, error };
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      setProjects(prev => prev.filter(project => project.id !== projectId));
      return { error: null };
    } catch (error) {
      console.error('Error deleting project:', error);
      return { error };
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return {
    users,
    tasks,
    projects,
    loading,
    refreshData,
    // User CRUD
    createUser,
    updateUser,
    deleteUser,
    // Task CRUD
    createTask,
    updateTask,
    deleteTask,
    // Project CRUD
    createProject,
    updateProject,
    deleteProject
  };
};
