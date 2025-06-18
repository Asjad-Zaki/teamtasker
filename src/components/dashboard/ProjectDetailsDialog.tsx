
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, CheckCircle, AlertCircle, Clock, FileText, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { Project } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';

interface ProjectDetailsDialogProps {
  project: Project;
  trigger: React.ReactNode;
}

const ProjectDetailsDialog = ({ project, trigger }: ProjectDetailsDialogProps) => {
  const [open, setOpen] = useState(false);
  const { tasks } = useTasks();

  // Get tasks for this project (in a real app, tasks would have project_id)
  const projectTasks = tasks.slice(0, 3); // Mock: showing first 3 tasks as example

  const completedTasks = projectTasks.filter(t => t.status === 'done').length;
  const progress = projectTasks.length > 0 ? (completedTasks / projectTasks.length) * 100 : 0;

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      planning: "bg-blue-100 text-blue-800",
      onhold: "bg-yellow-100 text-yellow-800",
      completed: "bg-gray-100 text-gray-800"
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "bg-red-500",
      medium: "bg-yellow-500",
      low: "bg-green-500"
    };
    return colors[priority as keyof typeof colors] || "bg-gray-500";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <DialogTitle className="text-xl">{project.name}</DialogTitle>
              <div className={`w-3 h-3 rounded-full ${getPriorityColor(project.priority)}`}></div>
              <Badge className={getStatusColor(project.status)}>
                <div className="flex items-center space-x-1">
                  {project.status === 'active' && <CheckCircle className="h-3 w-3" />}
                  {project.status === 'planning' && <Clock className="h-3 w-3" />}
                  {project.status === 'onhold' && <AlertCircle className="h-3 w-3" />}
                  <span className="capitalize">{project.status}</span>
                </div>
              </Badge>
            </div>
            <Avatar className="h-10 w-10">
              <AvatarImage src={project.owner_avatar} alt={project.owner_name} />
              <AvatarFallback>{project.owner_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
          </div>
          <p className="text-gray-600 mt-2">{project.description}</p>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Progress Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Project Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                  
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{projectTasks.length}</div>
                      <div className="text-sm text-gray-600">Total Tasks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{projectTasks.length - completedTasks}</div>
                      <div className="text-sm text-gray-600">Remaining</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Project Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Due Date: {format(new Date(project.due_date), "MMM dd, yyyy")}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>Team Size: {project.team_members.length} members</span>
                  </div>
                  <div className="text-gray-600">
                    <span>Priority: </span>
                    <span className="capitalize font-medium">{project.priority}</span>
                  </div>
                  <div className="text-gray-600">
                    <span>Created: {format(new Date(project.created_at), "MMM dd, yyyy")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Project Tasks</h3>
              <Button size="sm">Add Task</Button>
            </div>
            {projectTasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        task.status === 'done' ? 'bg-green-500' : 
                        task.status === 'progress' ? 'bg-blue-500' : 'bg-gray-300'
                      }`}></div>
                      <div>
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-sm text-gray-600">{task.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {task.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Team Members</h3>
              <Button size="sm">Add Member</Button>
            </div>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={project.owner_avatar} alt={project.owner_name} />
                    <AvatarFallback>{project.owner_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium">{project.owner_name}</h4>
                    <p className="text-sm text-gray-600">Project Owner</p>
                  </div>
                  <Badge>Owner</Badge>
                </div>
              </CardContent>
            </Card>
            {project.team_members.map((member, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member}`} alt={member} />
                      <AvatarFallback>{member[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium capitalize">{member}</h4>
                      <p className="text-sm text-gray-600">Team Member</p>
                    </div>
                    <Badge variant="outline">Member</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <h3 className="text-lg font-semibold">Project Timeline</h3>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium">Project Created</h4>
                  <p className="text-sm text-gray-600">{format(new Date(project.created_at), "MMM dd, yyyy")}</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium">Development Started</h4>
                  <p className="text-sm text-gray-600">Tasks assigned and work began</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium">Project Due</h4>
                  <p className="text-sm text-gray-600">{format(new Date(project.due_date), "MMM dd, yyyy")}</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsDialog;
