
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTasks } from '@/hooks/useTasks';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'planning' | 'onhold' | 'completed';
  priority: 'low' | 'medium' | 'high';
  owner_id: string;
  owner_name: string;
  owner_avatar: string;
  team_members: string[];
  due_date: string;
  created_at: string;
  updated_at: string;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { tasks } = useTasks();

  // Calculate project statistics from tasks
  const getProjectStats = () => {
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const remainingTasks = totalTasks - completedTasks;
    const teamMembers = new Set(tasks.map(t => t.assignee_id).filter(Boolean)).size;

    return {
      activeProjects,
      totalTasks,
      completedTasks,
      remainingTasks,
      teamMembers
    };
  };

  // Mock data for now - in a real app, this would come from a projects table
  const mockProjects: Project[] = [
    {
      id: "1",
      name: "E-commerce Platform",
      description: "Modern e-commerce solution with React and Node.js",
      status: "active",
      priority: "high",
      owner_id: "1",
      owner_name: "Jane Smith",
      owner_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
      team_members: ["john", "mike", "sarah"],
      due_date: new Date(2024, 8, 15).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "2",
      name: "Mobile App Redesign",
      description: "Complete UI/UX overhaul for mobile application",
      status: "active",
      priority: "medium",
      owner_id: "2",
      owner_name: "Alex Brown",
      owner_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      team_members: ["jane", "sarah"],
      due_date: new Date(2024, 7, 30).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "3",
      name: "API Documentation",
      description: "Comprehensive API documentation and examples",
      status: "planning",
      priority: "low",
      owner_id: "3",
      owner_name: "Mike Johnson",
      owner_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
      team_members: ["alex"],
      due_date: new Date(2024, 9, 10).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setProjects(mockProjects);
      setLoading(false);
    }, 1000);
  }, []);

  return {
    projects,
    loading,
    stats: getProjectStats()
  };
};
