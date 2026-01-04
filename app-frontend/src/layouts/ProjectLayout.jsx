import { Outlet } from 'react-router-dom';
import ProjectSidebar from '../components/ProjectSidebar';
import TopNavbar from '../components/TopNavbar';
import { SidebarProvider } from '../components/SidebarContext';

export default function ProjectLayout() {
  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <TopNavbar />
        <div className="flex flex-1 pt-0">
          <ProjectSidebar />
          <main className="flex-1 min-w-0"> 
            <div className="p-1 sm:p-1">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}