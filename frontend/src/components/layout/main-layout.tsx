'use client';

import React from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { AuthProvider } from '@/components/providers/auth-provider';

interface MainLayoutProps {
  children: React.ReactNode;
}

// 메인 레이아웃 컴포넌트 (Header + Sidebar + Content)
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <AuthProvider>
      <div className="flex h-screen bg-background">
        {/* 데스크톱 사이드바 */}
        <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-30">
          <Sidebar />
        </aside>

        {/* 메인 콘텐츠 영역 */}
        <div className="flex flex-1 flex-col lg:pl-64">
          {/* 헤더 */}
          <Header />

          {/* 콘텐츠 영역 */}
          <main className="flex-1 overflow-auto">
            <div className="h-full">{children}</div>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
