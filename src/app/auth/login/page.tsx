// src/app/auth/login/page.tsx
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
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Đăng nhập</CardTitle>
            <CardDescription className="text-center">
              Nhập thông tin tài khoản để đăng nhập
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="ten_dang_nhap">Tên đăng nhập</Label>
                <Input
                  id="ten_dang_nhap"
                  type="text"
                  autoComplete="username"
                  {...register('ten_dang_nhap')}
                />
                {errors.ten_dang_nhap && (
                  <p className="text-sm text-red-600">
                    {errors.ten_dang_nhap.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mat_khau">Mật khẩu</Label>
                <div className="relative">
                  <Input
                    id="mat_khau"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    {...register('mat_khau')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.mat_khau && (
                  <p className="text-sm text-red-600">
                    {errors.mat_khau.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang đăng nhập...
                  </>
                ) : (
                  'Đăng nhập'
                )}
              </Button>

              <div className="text-center">
                <span className="text-sm text-gray-600">
                  Chưa có tài khoản?{' '}
                  <Link
                    href="/auth/register"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Đăng ký ngay
                  </Link>
                </span>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}