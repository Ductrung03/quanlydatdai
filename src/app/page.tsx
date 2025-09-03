// src/app/dashboard/page.tsx (updated with navigation to land management)
'use client';

import { useRequireAuth } from '@/hooks/use-auth';
import { signOut } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AdminGuard, UserGuard } from '@/components/auth/rbac';
import { User, LogOut, Shield, Users, Map, FileText, Gavel } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isLoading } = useRequireAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/auth/login' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Chào mừng, <span className="font-semibold">{user?.ho_ten}</span>
          </p>
        </div>
        <Button onClick={handleLogout} variant="outline">
          <LogOut className="h-4 w-4 mr-2" />
          Đăng xuất
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thông tin tài khoản</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Tên đăng nhập:</span> {user?.name}
              </p>
              <p className="text-sm">
                <span className="font-medium">Email:</span> {user?.email || 'Chưa cập nhật'}
              </p>
              <p className="text-sm">
                <span className="font-medium">Vai trò:</span>{' '}
                <span className={`px-2 py-1 rounded-full text-xs ${
                  user?.vai_tro === 'admin' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {user?.vai_tro === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        <UserGuard>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chức năng người dùng</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/user/land-search">
                    <Map className="h-4 w-4 mr-2" />
                    Tìm kiếm đất đai
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/user/auctions">
                    <Gavel className="h-4 w-4 mr-2" />
                    Tham gia đấu giá
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/user/history">
                    <FileText className="h-4 w-4 mr-2" />
                    Lịch sử giao dịch
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </UserGuard>

        <AdminGuard>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chức năng quản trị</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/admin/users">
                    <Users className="h-4 w-4 mr-2" />
                    Quản lý người dùng
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/admin/thua-dat">
                    <Map className="h-4 w-4 mr-2" />
                    Quản lý đất đai
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/admin/auctions">
                    <Gavel className="h-4 w-4 mr-2" />
                    Quản lý đấu giá
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </AdminGuard>
      </div>

      <AdminGuard fallback={
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">
              Bạn cần quyền quản trị để xem các tính năng nâng cao.
            </p>
          </CardContent>
        </Card>
      }>
        <Card>
          <CardHeader>
            <CardTitle>Thống kê hệ thống (Chỉ dành cho Admin)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-gray-600">Tổng người dùng</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-sm text-gray-600">Thửa đất</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">0</div>
                <div className="text-sm text-gray-600">Cuộc đấu giá</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">0</div>
                <div className="text-sm text-gray-600">Tài liệu</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </AdminGuard>
    </div>
  );
}