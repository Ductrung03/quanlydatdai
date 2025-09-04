'use client';

import { useRequireAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminGuard, UserGuard } from '@/components/auth/rbac';
import { 
  MapIcon, 
  GavelIcon, 
  UsersIcon, 
  FileTextIcon, 
  TrendingUpIcon,
  ActivityIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowRightIcon,
  BarChart3Icon,
  CalendarIcon,
  BellIcon,
  TreePine,
  Landmark,
  DollarSignIcon
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Mock data - trong thực tế sẽ fetch từ API
const mockStats = {
  totalLands: 1247,
  availableForAuction: 89,
  totalArea: 15420.5,
  totalValue: 125000000000,
  monthlyAuctions: 12,
  activeUsers: 234,
  pendingDocuments: 15,
  completedTransactions: 156
};

const recentActivities = [
  {
    id: 1,
    type: 'auction',
    title: 'Đấu giá thửa đất TA-001-123 hoàn thành',
    time: '2 giờ trước',
    status: 'success',
    icon: GavelIcon,
    color: 'text-green-600'
  },
  {
    id: 2,
    type: 'document',
    title: 'Tài liệu mới được tải lên cho thửa đất HN-045-067',
    time: '4 giờ trước',
    status: 'info',
    icon: FileTextIcon,
    color: 'text-blue-600'
  },
  {
    id: 3,
    type: 'registration',
    title: '3 người dùng mới đăng ký tham gia đấu giá',
    time: '6 giờ trước',
    status: 'info',
    icon: UsersIcon,
    color: 'text-purple-600'
  },
  {
    id: 4,
    type: 'alert',
    title: 'Cần phê duyệt 5 hồ sơ đăng ký đấu giá',
    time: '1 ngày trước',
    status: 'warning',
    icon: AlertCircleIcon,
    color: 'text-orange-600'
  }
];

export default function DashboardPage() {
  const { user, isLoading } = useRequireAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 1
    }).format(amount) + ' VNĐ';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
              <div className="animate-fade-in-up">
                <h1 className="text-3xl font-bold text-gray-900">
                  Chào mừng trở lại, <span className="text-green-600">{user?.ho_ten}</span>
                </h1>
                <p className="text-gray-600 mt-2 text-lg">
                  Tổng quan hoạt động hệ thống quản lý đất đai hôm nay
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="outline" className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Hôm nay</span>
                </Button>
                <Button variant="outline" size="icon">
                  <BellIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="card-hover border-l-4 border-l-green-500 animate-fade-in-up">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Tổng thửa đất</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {mockStats.totalLands.toLocaleString('vi-VN')}
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">+5.2% từ tháng trước</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 land-gradient rounded-xl flex items-center justify-center">
                    <MapIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover border-l-4 border-l-blue-500 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Có thể đấu giá</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {mockStats.availableForAuction}
                    </p>
                    <div className="flex items-center mt-2">
                      <CheckCircleIcon className="h-4 w-4 text-blue-500 mr-1" />
                      <span className="text-sm text-blue-600">Sẵn sàng đấu giá</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <GavelIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover border-l-4 border-l-purple-500 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Tổng diện tích</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {mockStats.totalArea.toLocaleString('vi-VN')}
                    </p>
                    <div className="flex items-center mt-2">
                      <TreePine className="h-4 w-4 text-purple-500 mr-1" />
                      <span className="text-sm text-purple-600">hecta</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Landmark className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover border-l-4 border-l-orange-500 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Tổng giá trị</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {formatCurrency(mockStats.totalValue)}
                    </p>
                    <div className="flex items-center mt-2">
                      <DollarSignIcon className="h-4 w-4 text-orange-500 mr-1" />
                      <span className="text-sm text-orange-600">Ước tính</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 gold-gradient rounded-xl flex items-center justify-center">
                    <BarChart3Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Actions */}
              <Card className="animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ActivityIcon className="h-5 w-5 text-green-600" />
                    <span>Thao tác nhanh</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AdminGuard>
                    <Button asChild className="h-20 justify-start p-4 land-gradient hover:shadow-lg transition-all">
                      <Link href="/admin/thua-dat">
                        <div className="flex items-center space-x-4">
                          <MapIcon className="h-8 w-8" />
                          <div className="text-left">
                            <div className="font-semibold">Quản lý đất đai</div>
                            <div className="text-sm opacity-90">Thêm, sửa thửa đất</div>
                          </div>
                        </div>
                      </Link>
                    </Button>

                    <Button asChild variant="outline" className="h-20 justify-start p-4 hover:shadow-lg transition-all">
                      <Link href="/admin/auctions">
                        <div className="flex items-center space-x-4">
                          <GavelIcon className="h-8 w-8 text-blue-600" />
                          <div className="text-left">
                            <div className="font-semibold">Tạo đấu giá</div>
                            <div className="text-sm text-gray-600">Tổ chức đấu giá mới</div>
                          </div>
                        </div>
                      </Link>
                    </Button>

                    <Button asChild variant="outline" className="h-20 justify-start p-4 hover:shadow-lg transition-all">
                      <Link href="/admin/users">
                        <div className="flex items-center space-x-4">
                          <UsersIcon className="h-8 w-8 text-purple-600" />
                          <div className="text-left">
                            <div className="font-semibold">Quản lý user</div>
                            <div className="text-sm text-gray-600">Phân quyền, phê duyệt</div>
                          </div>
                        </div>
                      </Link>
                    </Button>
                  </AdminGuard>

                  <UserGuard>
                    <Button asChild variant="outline" className="h-20 justify-start p-4 hover:shadow-lg transition-all">
                      <Link href="/user/search">
                        <div className="flex items-center space-x-4">
                          <MapIcon className="h-8 w-8 text-green-600" />
                          <div className="text-left">
                            <div className="font-semibold">Tìm kiếm đất</div>
                            <div className="text-sm text-gray-600">Tra cứu thông tin</div>
                          </div>
                        </div>
                      </Link>
                    </Button>
                  </UserGuard>

                  <Button asChild variant="outline" className="h-20 justify-start p-4 hover:shadow-lg transition-all">
                    <Link href="/admin/reports">
                      <div className="flex items-center space-x-4">
                        <BarChart3Icon className="h-8 w-8 text-orange-600" />
                        <div className="text-left">
                          <div className="font-semibold">Báo cáo</div>
                          <div className="text-sm text-gray-600">Thống kê, phân tích</div>
                        </div>
                      </div>
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Performance Chart Placeholder */}
              <Card className="animate-fade-in-up" style={{animationDelay: '0.5s'}}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Hoạt động theo tháng</CardTitle>
                  <Button variant="outline" size="sm">
                    Xem chi tiết
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <BarChart3Icon className="h-12 w-12 text-gray-400 mx-auto" />
                      <p className="text-gray-500">Biểu đồ thống kê sẽ được hiển thị ở đây</p>
                      <p className="text-sm text-gray-400">Tích hợp Chart.js hoặc Recharts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recent Activities */}
              <Card className="animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ActivityIcon className="h-5 w-5 text-blue-600" />
                    <span>Hoạt động gần đây</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-0">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                        activity.status === 'success' && "bg-green-100",
                        activity.status === 'info' && "bg-blue-100", 
                        activity.status === 'warning' && "bg-orange-100"
                      )}>
                        <activity.icon className={cn("h-4 w-4", activity.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="ghost" className="w-full justify-center text-sm">
                    Xem tất cả hoạt động
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="animate-fade-in-up" style={{animationDelay: '0.7s'}}>
                <CardHeader>
                  <CardTitle>Thống kê nhanh</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Đấu giá tháng này</span>
                    <Badge className="land-gradient border-0 text-white">
                      {mockStats.monthlyAuctions}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Người dùng hoạt động</span>
                    <Badge variant="secondary">
                      {mockStats.activeUsers}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Hồ sơ chờ duyệt</span>
                    <Badge variant="outline" className="border-orange-200 text-orange-700">
                      {mockStats.pendingDocuments}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Giao dịch hoàn thành</span>
                    <Badge variant="outline" className="border-green-200 text-green-700">
                      {mockStats.completedTransactions}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <AdminGuard>
                {/* Admin System Status */}
                <Card className="animate-fade-in-up" style={{animationDelay: '0.8s'}}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Trạng thái hệ thống</span>
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse-green"></div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Database</span>
                      <Badge className="bg-green-100 text-green-800 border-0">Hoạt động</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API Services</span>
                      <Badge className="bg-green-100 text-green-800 border-0">Hoạt động</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">File Storage</span>
                      <Badge className="bg-green-100 text-green-800 border-0">Hoạt động</Badge>
                    </div>
                  </CardContent>
                </Card>
              </AdminGuard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}