
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, CheckSquare, Shield, Zap, Database, Github } from "lucide-react";
import AuthModal from "@/components/auth/AuthModal";
import Dashboard from "@/components/dashboard/Dashboard";

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (userData: any) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
    setShowAuth(false);
  };

  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Role-Based Access Control",
      description: "Admin, Project Manager, Developer, Tester, and Viewer roles with specific permissions"
    },
    {
      icon: <CheckSquare className="h-6 w-6" />,
      title: "Kanban Task Management", 
      description: "Drag-and-drop task boards with real-time updates using Socket.IO"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "JWT Authentication",
      description: "Secure authentication and authorization with token-based sessions"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Real-Time Updates",
      description: "Live notifications and task updates across all connected users"
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Redis Caching",
      description: "Fast session management and user preferences caching"
    },
    {
      icon: <Github className="h-6 w-6" />,
      title: "Modern Tech Stack",
      description: "React, TypeScript, Node.js, PostgreSQL, and more"
    }
  ];

  const roles = [
    { name: "Admin", color: "bg-red-500", description: "Manage users, assign roles, create/delete projects" },
    { name: "Project Manager", color: "bg-blue-500", description: "Create/edit/delete tasks, assign users" },
    { name: "Developer", color: "bg-green-500", description: "View/update tasks, add comments" },
    { name: "Tester", color: "bg-yellow-500", description: "Mark tasks as tested, comment" },
    { name: "Viewer", color: "bg-gray-500", description: "Read-only access to project information" }
  ];

  if (isAuthenticated) {
    return <Dashboard user={currentUser} onLogout={() => setIsAuthenticated(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <CheckSquare className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TeamTasker
            </h1>
          </div>
          <Button onClick={() => setShowAuth(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200">
            🚀 Role-Based Task Management System
          </Badge>
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Streamline Your Team's
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Task Management
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A comprehensive platform designed for small teams with role-based access control, 
            real-time updates, and intelligent caching for optimal performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => setShowAuth(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8"
            >
              Start Managing Tasks
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">Powerful Features</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Built with modern technologies and best practices to deliver a seamless task management experience.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-blue-600">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">Role-Based Permissions</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Each team member gets access to exactly what they need, with clear permission boundaries.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${role.color}`}></div>
                    <CardTitle className="text-lg">{role.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {role.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">Built with Modern Technologies</h3>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            Leveraging the latest tools and frameworks for optimal performance and developer experience.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["React", "TypeScript", "Node.js", "PostgreSQL", "Redis", "Socket.IO", "JWT", "Tailwind CSS", "Shadcn/UI"].map((tech) => (
              <Badge key={tech} variant="secondary" className="bg-gray-100 text-gray-700 px-4 py-2 text-sm">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join teams already using TeamTasker to streamline their workflow and boost productivity.
          </p>
          <Button 
            size="lg" 
            onClick={() => setShowAuth(true)}
            className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8"
          >
            Start Your Free Trial
          </Button>
        </div>
      </section>

      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
        onLogin={handleLogin}
      />
    </div>
  );
};

export default Index;
