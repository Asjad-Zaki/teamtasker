
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Dashboard from "@/components/dashboard/Dashboard";
import LandingPage from "@/components/LandingPage";

const Index = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user && profile) {
    return (
      <Dashboard 
        user={{
          id: user.id,
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User',
          email: user.email || '',
          role: profile.role,
          avatar: profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
        }}
        onLogout={() => {}} // Will be handled by useAuth
      />
    );
  }

  return <LandingPage />;
};

export default Index;
