'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  HomeIcon,
  MapIcon,
  GavelIcon,
  UsersIcon,
  FileTextIcon,
  BarChart3Icon,
  SettingsIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
  TreePine,
  Landmark,
  ClipboardList,
  Search,
  Bell,
  ChevronDown
} from 'lucide-react';
import { useRequireAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: string;
  roles?: string[];
  children?: NavigationItem[];
}

const navigation: NavigationItem[] = [
  {
    name: 'Tổng quan',
    href: '/dashboard',
    icon: HomeIcon,
  },
  {
    name: 'Quản lý đất đai',
    href: '/admin/thua-dat',
    icon: MapIcon,
    roles: ['admin'],
    badge: 'Mới',
    children: [
      { name: 'Danh sách thửa đất', href: '/admin/thua-dat', icon: ClipboardList },
      { name: 'Bản đồ địa chính', href: '/admin/thua-dat/map', icon: MapIcon },
      { name: 'Loại đất', href: '/admin/land-types', icon: TreePine },
    ]
  },
  {
    name: 'Quản lý đấu giá',
    href: '/admin/auctions',
    icon: GavelIcon,
    roles: ['admin'],
    children: [
      { name: 'Cuộc đấu giá', href: '/admin/auctions', icon: GavelIcon },
      { name: 'Đăng ký tham gia', href: '/admin/auctions/registrations', icon: ClipboardList },
      { name: 'Kết quả đấu giá', href: '/admin/auctions/results', icon: BarChart3Icon },
    ]
  },
  {
    name: 'Quản lý người dùng',
    href: '/admin/users',
    icon: UsersIcon,
    roles: ['admin'],
  },
  {
    name: 'Tài liệu & Hồ sơ',
    href: '/admin/documents',
    icon: FileTextIcon,
    roles: ['admin'],
  },
  {
    name: 'Báo cáo thống kê',
    href: '/admin/reports',
    icon: BarChart3Icon,
    roles: ['admin'],
  },
  {
    name: 'Tìm kiếm đất đai',
    href: '/user/search',
    icon: Search,
    roles: ['user', 'admin'],
  },
  {
    name: 'Đấu giá của tôi',
    href: '/user/my-auctions',
    icon: GavelIcon,
    roles: ['user'],
  },
];

interface SidebarNavigationProps {
  children: React.ReactNode;
}

export function SidebarNavigation({ children }: SidebarNavigationProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathname = usePathname();
  const { user, isLoading } = useRequireAuth();

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const filteredNavigation = navigation.filter(item => 
    !item.roles || item.roles.includes(user?.vai_tro || 'user')
  );

  const handleLogout = () => {
    signOut({ callbackUrl: '/auth/login' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const renderNavigationItem = (item: NavigationItem, isChild = false) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
    const isExpanded = expandedItems.includes(item.name);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.name}>
        <div className="flex items-center">
          <Link
            href={item.href}
            className={cn(
              'nav-item flex-1',
              isActive && 'active',
              isChild && 'ml-6'
            )}
            onClick={() => setSidebarOpen(false)}
          >
            <item.icon className="icon" />
            <span className="font-medium">{item.name}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto text-xs">
                {item.badge}
              </Badge>
            )}
          </Link>
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleExpanded(item.name)}
              className="p-1 ml-2 hover:bg-green-50"
            >
              <ChevronDown 
                className={cn(
                  "h-4 w-4 transition-transform",
                  isExpanded && "transform rotate-180"
                )}
              />
            </Button>
          )}
        </div>
        
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map(child => renderNavigationItem(child, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
            >
              <MenuIcon className="h-6 w-6" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Landmark className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">LandManager</span>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 land-gradient rounded-xl flex items-center justify-center shadow-lg">
              <Landmark className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900">LandManager</h1>
              <p className="text-sm text-gray-500">Quản lý đất đai</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <XIcon className="h-5 w-5" />
          </Button>
        </div>

        {/* User profile */}
        <div className="p-4 border-b border-gray-100">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-3 h-auto">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-green-100 text-green-700 font-semibold">
                      {user?.ho_ten?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900">{user?.ho_ten}</div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={user?.vai_tro === 'admin' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {user?.vai_tro === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                      </Badge>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem>
                <SettingsIcon className="mr-2 h-4 w-4" />
                Cài đặt tài khoản
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOutIcon className="mr-2 h-4 w-4" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {filteredNavigation.map(item => renderNavigationItem(item))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <div className="text-center text-xs text-gray-500">
            <p>&copy; 2024 LandManager</p>
            <p>Phiên bản 1.0.0</p>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-gray-900 bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:pl-72">
        <div className="lg:hidden pt-16">
          {/* Mobile header spacer */}
        </div>
        {children}
      </div>
    </div>
  );
}