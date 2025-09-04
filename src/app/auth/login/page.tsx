'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  EyeIcon, 
  EyeOffIcon, 
  Loader2Icon, 
  LandmarkIcon,
  ShieldCheckIcon,
  UserCheckIcon,
  MapIcon,
  TreePine,
  AlertCircleIcon
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  ten_dang_nhap: z.string().min(1, 'Vui lòng nhập tên đăng nhập'),
  mat_khau: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        ten_dang_nhap: data.ten_dang_nhap,
        mat_khau: data.mat_khau,
        redirect: false,
      });

      if (result?.error) {
        setError('Tên đăng nhập hoặc mật khẩu không chính xác');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      setError('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          {/* Logo and Header */}
          <div className="text-center animate-fade-in-up">
            <div className="mx-auto w-16 h-16 land-gradient rounded-2xl flex items-center justify-center shadow-lg mb-6">
              <LandmarkIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Chào mừng trở lại
            </h2>
            <p className="text-gray-600">
              Đăng nhập vào hệ thống quản lý đất đai
            </p>
          </div>

          {/* Login Card */}
          <Card className="shadow-xl border-0 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-xl font-semibold text-gray-900">
                Đăng nhập tài khoản
              </CardTitle>
              <CardDescription className="text-gray-600">
                Nhập thông tin đăng nhập để truy cập hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {error && (
                  <Alert variant="destructive" className="animate-fade-in-up">
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Username Field */}
                <div className="space-y-2">
                  <Label htmlFor="ten_dang_nhap" className="text-sm font-medium text-gray-700">
                    Tên đăng nhập
                  </Label>
                  <Input
                    id="ten_dang_nhap"
                    type="text"
                    autoComplete="username"
                    {...register('ten_dang_nhap')}
                    className={cn(
                      "h-11 focus-ring border-gray-200",
                      errors.ten_dang_nhap && "border-red-300 focus:border-red-500"
                    )}
                    placeholder="Nhập tên đăng nhập"
                  />
                  {errors.ten_dang_nhap && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <AlertCircleIcon className="w-4 h-4 mr-1" />
                      {errors.ten_dang_nhap.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="mat_khau" className="text-sm font-medium text-gray-700">
                    Mật khẩu
                  </Label>
                  <div className="relative">
                    <Input
                      id="mat_khau"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      {...register('mat_khau')}
                      className={cn(
                        "h-11 pr-12 focus-ring border-gray-200",
                        errors.mat_khau && "border-red-300 focus:border-red-500"
                      )}
                      placeholder="Nhập mật khẩu"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-4 w-4 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="sr-only">
                        {showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                      </span>
                    </Button>
                  </div>
                  {errors.mat_khau && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <AlertCircleIcon className="w-4 h-4 mr-1" />
                      {errors.mat_khau.message}
                    </p>
                  )}
                </div>

                {/* Remember & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Ghi nhớ đăng nhập
                    </label>
                  </div>
                  <Link
                    href="#"
                    className="text-sm font-medium text-green-600 hover:text-green-500 transition-colors"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-11 land-gradient hover:shadow-lg transition-all duration-200 font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
                      Đang đăng nhập...
                    </>
                  ) : (
                    <>
                      <ShieldCheckIcon className="mr-2 h-5 w-5" />
                      Đăng nhập
                    </>
                  )}
                </Button>

                {/* Register Link */}
                <div className="text-center pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-600">
                    Chưa có tài khoản?{' '}
                    <Link
                      href="/auth/register"
                      className="font-semibold text-green-600 hover:text-green-500 transition-colors"
                    >
                      Đăng ký ngay
                    </Link>
                  </span>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Features List */}
          <div className="text-center animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <MapIcon className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-xs text-gray-600">Quản lý bản đồ</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <UserCheckIcon className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-xs text-gray-600">Đăng ký đấu giá</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <TreePine className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-xs text-gray-600">Phân loại đất</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Section */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <div className="absolute inset-0 land-gradient"></div>
        <div className="absolute inset-0 bg-black opacity-20"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-8 gap-4 h-full p-8">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg opacity-20"></div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <div className="max-w-lg">
            <h1 className="text-4xl font-bold mb-6 animate-fade-in-up">
              Hệ thống Quản lý Đất đai
            </h1>
            <p className="text-xl mb-8 text-green-100 leading-relaxed animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              Giải pháp toàn diện cho việc quản lý, theo dõi và đấu giá các thửa đất. 
              Tích hợp công nghệ hiện đại để tối ưu hóa quy trình hành chính.
            </p>
            
            {/* Feature List */}
            <div className="space-y-4 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                <span className="text-green-100">Quản lý thông tin thửa đất chi tiết</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                <span className="text-green-100">Tích hợp bản đồ địa chính số</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                <span className="text-green-100">Hệ thống đấu giá trực tuyến</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                <span className="text-green-100">Quản lý tài liệu và hồ sơ</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">1,247</div>
                <div className="text-green-200 text-sm">Thửa đất</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">89</div>
                <div className="text-green-200 text-sm">Đấu giá</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">234</div>
                <div className="text-green-200 text-sm">Người dùng</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-20 h-20 border-2 border-white border-opacity-20 rounded-full"></div>
        <div className="absolute bottom-10 left-10 w-16 h-16 border-2 border-white border-opacity-20 rounded-full"></div>
      </div>
    </div>
  );
}