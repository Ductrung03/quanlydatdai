// src/app/auth/register/page.tsx
'use client';

import { useState } from 'react';
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

const registerSchema = z.object({
  ten_dang_nhap: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
  mat_khau: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  xac_nhan_mat_khau: z.string(),
  ho_ten: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  so_dien_thoai: z.string().optional(),
  so_cccd: z.string().regex(/^\d{12}$/, 'CCCD phải có 12 số').optional().or(z.literal('')),
  dia_chi: z.string().optional(),
}).refine((data) => data.mat_khau === data.xac_nhan_mat_khau, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['xac_nhan_mat_khau'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ten_dang_nhap: data.ten_dang_nhap,
          mat_khau: data.mat_khau,
          ho_ten: data.ho_ten,
          email: data.email || undefined,
          so_dien_thoai: data.so_dien_thoai || undefined,
          so_cccd: data.so_cccd || undefined,
          dia_chi: data.dia_chi || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error);
      } else {
        setSuccess('Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...');
        reset();
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
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
            <CardTitle className="text-2xl text-center">Đăng ký</CardTitle>
            <CardDescription className="text-center">
              Tạo tài khoản mới để sử dụng hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <AlertDescription className="text-green-600">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="ten_dang_nhap">Tên đăng nhập *</Label>
                <Input
                  id="ten_dang_nhap"
                  type="text"
                  {...register('ten_dang_nhap')}
                />
                {errors.ten_dang_nhap && (
                  <p className="text-sm text-red-600">
                    {errors.ten_dang_nhap.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ho_ten">Họ tên *</Label>
                <Input
                  id="ho_ten"
                  type="text"
                  {...register('ho_ten')}
                />
                {errors.ho_ten && (
                  <p className="text-sm text-red-600">
                    {errors.ho_ten.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="so_dien_thoai">Số điện thoại</Label>
                <Input
                  id="so_dien_thoai"
                  type="tel"
                  {...register('so_dien_thoai')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="so_cccd">Số CCCD</Label>
                <Input
                  id="so_cccd"
                  type="text"
                  maxLength={12}
                  {...register('so_cccd')}
                />
                {errors.so_cccd && (
                  <p className="text-sm text-red-600">
                    {errors.so_cccd.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dia_chi">Địa chỉ</Label>
                <Input
                  id="dia_chi"
                  type="text"
                  {...register('dia_chi')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mat_khau">Mật khẩu *</Label>
                <div className="relative">
                  <Input
                    id="mat_khau"
                    type={showPassword ? 'text' : 'password'}
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

              <div className="space-y-2">
                <Label htmlFor="xac_nhan_mat_khau">Xác nhận mật khẩu *</Label>
                <div className="relative">
                  <Input
                    id="xac_nhan_mat_khau"
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('xac_nhan_mat_khau')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.xac_nhan_mat_khau && (
                  <p className="text-sm text-red-600">
                    {errors.xac_nhan_mat_khau.message}
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
                    Đang đăng ký...
                  </>
                ) : (
                  'Đăng ký'
                )}
              </Button>

              <div className="text-center">
                <span className="text-sm text-gray-600">
                  Đã có tài khoản?{' '}
                  <Link
                    href="/auth/login"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Đăng nhập ngay
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