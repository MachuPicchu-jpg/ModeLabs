import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

// Regular layout for most pages (with navbar spacing)
export const Layout = ({ children }) => {
  if (children) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="h-40"/> {/* This creates space for the navbar */}
        <main>
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

// Special layout for home page (without navbar spacing)
export const HomeLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
