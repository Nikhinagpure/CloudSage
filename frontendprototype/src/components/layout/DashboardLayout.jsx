import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative">
          {/* Subtle gradient blob background for a premium feel */}
          <div className="pointer-events-none absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
