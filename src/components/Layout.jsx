import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useState, useEffect } from 'react';

function Layout() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showSidebar, setShowSidebar] = useState(!isMobile);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setShowSidebar(!mobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'} 
                      fixed md:relative z-20 h-full transition-transform duration-300 ease-in-out 
                      md:translate-x-0 bg-primary w-64 border-r border-blue-900/30`}>
        <Sidebar onClose={() => setShowSidebar(false)} />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Navbar onMenuClick={() => setShowSidebar(!showSidebar)} />
        
        <main className="flex-1 overflow-y-auto p-4">
          <div className="container-custom mx-auto py-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;