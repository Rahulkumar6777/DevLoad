import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import { SidebarProvider } from '../components/SidebarContext';

export default function PrivateLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <Sidebar />
        <div className="flex-1 md:ml-64 pt-16">
          <TopNavbar />
            <div className="p-4 sm:p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}