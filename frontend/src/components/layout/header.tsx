'use client';

import React, { useState } from 'react';
import { Menu, User, Bell, X, LogIn, LogOut } from 'lucide-react';
import Image from 'next/image';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Sidebar } from './sidebar';
import Link from 'next/link';
import { useAuth } from '@/components/providers/auth-provider';

interface HeaderProps {
  onMobileMenuClick?: () => void;
}

// 헤더 컴포넌트
export function Header({ onMobileMenuClick: _onMobileMenuClick }: HeaderProps) {
  // 인증 상태
  const { user, logout } = useAuth();
  // 알림 관련 상태
  const [notifications] = useState([
    {
      id: 1,
      type: '연속 손실',
      message: '3일 연속 손실이 발생했습니다. 거래 전략을 재검토해보세요.',
      date: '2024-01-15 14:30',
      read: false,
      urgent: true,
    },
    {
      id: 2,
      type: '연속 손실',
      message: '5일 연속 손실이 발생했습니다. 긴급한 전략 수정이 필요합니다.',
      date: '2024-01-10 09:15',
      read: true,
      urgent: true,
    },
    {
      id: 3,
      type: '거래 완료',
      message: 'BTC/USDT 거래가 완료되었습니다. 수익률: +2.5%',
      date: '2024-01-08 16:45',
      read: true,
      urgent: false,
    },
    {
      id: 4,
      type: '시장 알림',
      message: 'BTC 가격이 5% 상승했습니다. 포트폴리오를 확인해보세요.',
      date: '2024-01-05 12:20',
      read: false,
      urgent: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* 왼쪽: 로고 및 모바일 메뉴 */}
        <div className="flex items-center gap-4">
          {/* 모바일 메뉴 버튼 */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">메뉴 열기</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>네비게이션 메뉴</SheetTitle>
                <SheetDescription>사이드바 메뉴입니다.</SheetDescription>
              </SheetHeader>
              <Sidebar />
            </SheetContent>
          </Sheet>

          {/* 로고 */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
              CT
            </div>
            <h1 className="font-semibold text-lg hidden sm:block">코인 트레이딩 저널</h1>
          </div>
        </div>

        {/* 오른쪽: 액션 버튼들 */}
        <div className="flex items-center gap-2">
          {/* 알림 드롭다운 */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {/* 알림 뱃지 */}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-medium">
                    {unreadCount}
                  </span>
                )}
                <span className="sr-only">알림</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="border-b p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">알림</h3>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    모두 읽음
                  </Button>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">새로운 알림이 없습니다</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-muted/50 transition-colors ${
                          !notification.read ? 'bg-blue-50 dark:bg-blue-950/20' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{notification.type}</span>
                              {notification.urgent && (
                                <Badge variant="destructive" className="text-xs">
                                  긴급
                                </Badge>
                              )}
                              {!notification.read && (
                                <Badge variant="secondary" className="text-xs">
                                  새 알림
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{notification.message}</p>
                            <p className="text-xs text-muted-foreground">{notification.date}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {notifications.length > 0 && (
                <div className="border-t p-3">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    모든 알림 보기
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>

          {/* 다크 모드 토글 */}
          <ThemeToggle />

          {/* 사용자/로그인 메뉴 */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              {user.profileImageUrl ? (
                <Image
                  src={user.profileImageUrl}
                  alt="프로필 이미지"
                  width={32}
                  height={32}
                  className="rounded-full border"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
              <Button variant="ghost" size="icon" className="rounded-full" onClick={logout}>
                <LogOut className="h-5 w-5" />
                <span className="sr-only">로그아웃</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="outline" size="sm" className="gap-2">
                  <LogIn className="h-4 w-4" /> 로그인
                </Button>
              </Link>
              <Link href="/register" className="hidden sm:block">
                <Button size="sm" className="gap-2">
                  <User className="h-4 w-4" /> 회원가입
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
