import { useEffect } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { useSidebar } from './SidebarContext';
import { ArrowLeft, Home, FileText, Settings, BarChart, Key, Menu } from 'react-feather';
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';

const ProjectSidebar = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
  const location = useLocation();
  const { projects, loading: bootstrapLoading } = useSelector((state) => state.bootstrap);
  const project = projects.find((p) => p.id === projectId);
  const projectName = project?.name || "Loading...";

  
  useEffect(() => {
    if (!bootstrapLoading && projects.length > 0 && !project) {
      toast.error("Project not found or you don't have access to this project.");
      navigate("/");
    }
  }, [project, projects, bootstrapLoading, navigate]);

  const isActive = (path) => location.pathname === path;

 
  if (bootstrapLoading) {
    return (
      <>
        
        <div className="md:hidden fixed top-4 left-4 z-30">
          <div className="w-10 h-10 bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
        
        <div
          className={`fixed top-16 left-0 w-64 min-h-[calc(100vh-4rem)] bg-gray-800 text-white p-6 shadow-lg transform transition-transform duration-300 z-20 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } md:translate-x-0`}
        >
          <div className="flex items-center mb-8">
            <div className="h-8 w-40 bg-gray-700 rounded-xl animate-pulse"></div>
          </div>
          <nav className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="flex items-center py-3 px-4 rounded-lg bg-gray-700/50 animate-pulse"
              >
                <div className="w-5 h-5 bg-gray-600 rounded-full mr-3"></div>
                <div className="h-4 w-24 bg-gray-600 rounded"></div>
              </div>
            ))}
          </nav>
        </div>
      </>
    );
  }

  return (
    <>
      
      <button
        className="md:hidden fixed top-4 left-4 z-30 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all"
        onClick={() => setIsSidebarOpen(true)}
      >
        <Menu size={24} />
      </button>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <div
        className={`fixed top-16 left-0 w-64 min-h-[calc(100vh-4rem)] bg-gray-800 text-white p-6 shadow-lg transform transition-transform duration-300 z-20 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0`}
      >
        <div className="flex items-center mb-8">
          <span className="text-2xl font-bold text-indigo-400">{projectName}</span>
        </div>
        <nav className="space-y-3">
          <Link
            to="/"
            className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${isActive('/') ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-700 hover:text-indigo-400'
              }`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <ArrowLeft size={20} className="mr-3" />
            Go to Workspace
          </Link>
          <Link
            to={`/project/${projectId}`}
            state={{ projectName }}
            className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${isActive(`/project/${projectId}`)
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-300 hover:bg-gray-700 hover:text-indigo-400'
              }`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <Home size={20} className="mr-3" />
            Getting Started
          </Link>
          <Link
            to={`/project/${projectId}/files`}
            state={{ projectName }}
            className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${isActive(`/project/${projectId}/files`)
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-300 hover:bg-gray-700 hover:text-indigo-400'
              }`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <FileText size={20} className="mr-3" />
            Files
          </Link>
          <Link
            to={`/project/${projectId}/analytics`}
            state={{ projectName }}
            className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${isActive(`/project/${projectId}/analytics`)
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-300 hover:bg-gray-700 hover:text-indigo-400'
              }`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <BarChart size={20} className="mr-3" />
            Analytics
          </Link>
          <Link
            to={`/project/${projectId}/settings`}
            state={{ projectName }}
            className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${isActive(`/project/${projectId}/settings`)
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-300 hover:bg-gray-700 hover:text-indigo-400'
              }`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <Settings size={20} className="mr-3" />
            Settings
          </Link>
          <Link
            to={`/project/${projectId}/apikeys`}
            state={{ projectName }}
            className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${isActive(`/project/${projectId}/apikeys`)
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-300 hover:bg-gray-700 hover:text-indigo-400'
              }`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <Key size={20} className="mr-3" />
            ApiKeys
          </Link>
        </nav>
      </div>
    </>
  );
};

export default ProjectSidebar;