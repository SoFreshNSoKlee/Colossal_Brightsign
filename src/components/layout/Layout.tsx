import React from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { TopNav } from './TopNav';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  return (
    <div className="flex min-h-dvh bg-neo-bg">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav title={title} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-6 scrollbar-hide">
          <div className="max-w-4xl mx-auto px-1 py-2 lg:px-6 lg:py-4">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  );
}
