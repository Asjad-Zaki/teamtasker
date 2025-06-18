
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Calendar, Users, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { useProjects } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";
import ProjectDetailsDialog from "./ProjectDetailsDialog";

interface ProjectOverviewProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar: string;
  };
}

const ProjectOverview = ({ user }: ProjectOverviewProps) => {
  const { projects, loading, stats } = useProjects();
  const { tasks } = useTasks();

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      planning: "bg-blue-100 text-blue-800",
      onhold: "bg-yellow-100 text-yellow-800",
      completed: "bg-gray-100 text-gray-800"
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      active: <CheckCircle className="h-4 w-4" />,
      planning: <Clock className="h-4 w-4" />,
      onhold: <AlertCircle className="h-4 w-4" />,
      completed: <CheckCircle className="h-4 w-4" />
    };
    return icons[status as keyof typeof icons] || <Clock className="h-4 w-4" />;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "bg-red-500",
      medium: "bg-yellow-500",
      low: "bg-green-500"
    };
    return colors[priority as keyof typeof colors] || "bg-gray-500";
  };

  const getProjectProgress = (projectId: string) => {
    // In a real app, tasks would have project_id
    // For now, we'll calculate based on all tasks
    const projectTasks = tasks.slice(0, Math.floor(tasks.length / projects.length));
    const completedTasks = projectTasks.filter(t => t.status === 'done').length;
    return projectTasks.length > 0 ? (completedTasks / projectTasks.length) * 100 : 0;
  };

  const canCreateProject = user.role === "admin" || user.role === "project_manager";

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">Projects Overview</h3>
          <p className="text-gray-600">Track progress across all your projects</p>
        </div>
        {canCreateProject && (
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        )}
      </div>

      {/* Real-time Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{stats.activeProjects}</div>
                <div className="text-sm text-gray-600">Active Projects</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{stats.teamMembers}</div>
                <div className="text-sm text-gray-600">Team Members</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">{stats.completedTasks}</div>
                <div className="text-sm text-gray-600">Tasks Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">{stats.remainingTasks}</div>
                <div className="text-sm text-gray-600">Tasks Remaining</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects List with Real-time Data */}
      <div className="grid gap-6">
        {projects.map((project) => {
          const progress = getProjectProgress(project.id);
          const projectTasks = tasks.slice(0, 3); // Mock project tasks
          const completedTasks = projectTasks.filter(t => t.status === 'done').length;
          
          return (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(project.priority)}`}></div>
                      <Badge className={getStatusColor(project.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(project.status)}
                          <span className="capitalize">{project.status}</span>
                        </div>
                      </Badge>
                    </div>
                    <p className="text-gray-600">{project.description}</p>
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={project.owner_avatar} alt={project.owner_name} />
                    <AvatarFallback>{project.owner_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Real-time Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Real-time Project Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Due {format(new Date(project.due_date), "MMM dd")}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{project.team_members.length} members</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>{completedTasks}/{projectTasks.length} tasks</span>
                  </div>
                  <div className="text-gray-600">
                    <span className="capitalize">{project.priority} priority</span>
                  </div>
                </div>

                {/* Team Avatars */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Team:</span>
                    <div className="flex -space-x-2">
                      {project.team_members.slice(0, 3).map((member, index) => (
                        <Avatar key={index} className="h-6 w-6 border-2 border-white">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member}`} alt={member} />
                          <AvatarFallback className="text-xs">{member[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                      ))}
                      {project.team_members.length > 3 && (
                        <div className="h-6 w-6 bg-gray-100 border-2 border-white rounded-full flex items-center justify-center">
                          <span className="text-xs text-gray-600">+{project.team_members.length - 3}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <ProjectDetailsDialog 
                    project={project}
                    trigger={
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    }
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectOverview;
