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
import { Badge } from '@/components/ui/badge';
import { 
  EyeIcon, 
  EyeOffIcon, 
  Loader2Icon,
  LandmarkIcon,
  UserPlusIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  PhoneIcon,
  MailIcon,
  UserIcon,
  MapPinIcon,
  KeyIcon,
  ArrowLeftIcon
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

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
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    trigger
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const watchedFields = watch();

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

  const nextStep = async () => {
    const fieldsToValidate = currentStep === 1 
      ? ['ten_dang_nhap', 'ho_ten', 'mat_khau', 'xac_nhan_mat_khau']
      : ['email', 'so_dien_thoai', 'so_cccd', 'dia_chi'];
    
    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return strength;
  };

  const passwordStrength = getPasswordStrength(watchedFields.mat_khau || '');

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full space-y-8">
          {/* Header */}
          <div className="text-center animate-fade-in-up">
            <div className="mx-auto w-16 h-16 land-gradient rounded-2xl flex items-center justify-center shadow-lg mb-6">
              <LandmarkIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Tạo tài khoản mới
            </h2>
            <p className="text-gray-600">
              Tham gia hệ thống quản lý đất đai hiện đại
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-4 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            <div className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-full transition-all",
              currentStep === 1 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
            )}>
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                currentStep === 1 ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"
              )}>
                1
              </div>
              <span className="text-sm font-medium">Thông tin cơ bản</span>
            </div>
            <div className="w-8 h-px bg-gray-200"></div>
            <div className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-full transition-all",
              currentStep === 2 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
            )}>
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                currentStep === 2 ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"
              )}>
                2
              </div>
              <span className="text-sm font-medium">Thông tin bổ sung</span>
            </div>
          </div>

          {/* Registration Card */}
          <Card className="shadow-xl border-0 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-xl font-semibold text-gray-900">
                {currentStep === 1 ? 'Thông tin đăng nhập' : 'Thông tin cá nhân'}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {currentStep === 1 
                  ? 'Nhập thông tin đăng nhập và bảo mật'
                  : 'Thông tin bổ sung để hoàn thiện hồ sơ'
                }
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

                {success && (
                  <Alert className="border-green-200 bg-green-50 animate-fade-in-up">
                    <CheckCircleIcon className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">
                      {success}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div className="space-y-5">
                    {/* Username */}
                    <div className="space-y-2">
                      <Label htmlFor="ten_dang_nhap" className="text-sm font-medium text-gray-700">
                        Tên đăng nhập *
                      </Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="ten_dang_nhap"
                          type="text"
                          {...register('ten_dang_nhap')}
                          className={cn(
                            "h-11 pl-10 focus-ring",
                            errors.ten_dang_nhap && "border-red-300"
                          )}
                          placeholder="Nhập tên đăng nhập"
                        />
                      </div>
                      {errors.ten_dang_nhap && (
                        <p className="text-sm text-red-600 flex items-center">
                          <AlertCircleIcon className="w-4 h-4 mr-1" />
                          {errors.ten_dang_nhap.message}
                        </p>
                      )}
                    </div>

                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label htmlFor="ho_ten" className="text-sm font-medium text-gray-700">
                        Họ và tên *
                      </Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="ho_ten"
                          type="text"
                          {...register('ho_ten')}
                          className={cn(
                            "h-11 pl-10 focus-ring",
                            errors.ho_ten && "border-red-300"
                          )}
                          placeholder="Nhập họ và tên"
                        />
                      </div>
                      {errors.ho_ten && (
                        <p className="text-sm text-red-600 flex items-center">
                          <AlertCircleIcon className="w-4 h-4 mr-1" />
                          {errors.ho_ten.message}
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <Label htmlFor="mat_khau" className="text-sm font-medium text-gray-700">
                        Mật khẩu *
                      </Label>
                      <div className="relative">
                        <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="mat_khau"
                          type={showPassword ? 'text' : 'password'}
                          {...register('mat_khau')}
                          className={cn(
                            "h-11 pl-10 pr-12 focus-ring",
                            errors.mat_khau && "border-red-300"
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
                        </Button>
                      </div>
                      
                      {/* Password Strength Indicator */}
                      {watchedFields.mat_khau && (
                        <div className="space-y-2">
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4].map((level) => (
                              <div
                                key={level}
                                className={cn(
                                  "h-2 w-full rounded-full transition-all",
                                  passwordStrength >= level
                                    ? passwordStrength === 1 ? "bg-red-400"
                                    : passwordStrength === 2 ? "bg-yellow-400"
                                    : passwordStrength === 3 ? "bg-blue-400"
                                    : "bg-green-500"
                                    : "bg-gray-200"
                                )}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-gray-600">
                            Độ mạnh mật khẩu: {' '}
                            <span className={cn(
                              "font-medium",
                              passwordStrength === 1 && "text-red-600",
                              passwordStrength === 2 && "text-yellow-600", 
                              passwordStrength === 3 && "text-blue-600",
                              passwordStrength >= 4 && "text-green-600"
                            )}>
                              {passwordStrength === 1 && "Yếu"}
                              {passwordStrength === 2 && "Trung bình"}
                              {passwordStrength === 3 && "Khá mạnh"}
                              {passwordStrength >= 4 && "Rất mạnh"}
                            </span>
                          </p>
                        </div>
                      )}
                      
                      {errors.mat_khau && (
                        <p className="text-sm text-red-600 flex items-center">
                          <AlertCircleIcon className="w-4 h-4 mr-1" />
                          {errors.mat_khau.message}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Label htmlFor="xac_nhan_mat_khau" className="text-sm font-medium text-gray-700">
                        Xác nhận mật khẩu *
                      </Label>
                      <div className="relative">
                        <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="xac_nhan_mat_khau"
                          type={showConfirmPassword ? 'text' : 'password'}
                          {...register('xac_nhan_mat_khau')}
                          className={cn(
                            "h-11 pl-10 pr-12 focus-ring",
                            errors.xac_nhan_mat_khau && "border-red-300"
                          )}
                          placeholder="Nhập lại mật khẩu"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOffIcon className="h-4 w-4 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                      {errors.xac_nhan_mat_khau && (
                        <p className="text-sm text-red-600 flex items-center">
                          <AlertCircleIcon className="w-4 h-4 mr-1" />
                          {errors.xac_nhan_mat_khau.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="button"
                      onClick={nextStep}
                      className="w-full h-11 land-gradient hover:shadow-lg transition-all font-semibold"
                    >
                      Tiếp theo
                      <ArrowLeftIcon className="ml-2 h-4 w-4 rotate-180" />
                    </Button>
                  </div>
                )}

                {/* Step 2: Additional Information */}
                {currentStep === 2 && (
                  <div className="space-y-5">
                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email
                      </Label>
                      <div className="relative">
                        <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          {...register('email')}
                          className={cn(
                            "h-11 pl-10 focus-ring",
                            errors.email && "border-red-300"
                          )}
                          placeholder="Nhập địa chỉ email"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-sm text-red-600 flex items-center">
                          <AlertCircleIcon className="w-4 h-4 mr-1" />
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="so_dien_thoai" className="text-sm font-medium text-gray-700">
                        Số điện thoại
                      </Label>
                      <div className="relative">
                        <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="so_dien_thoai"
                          type="tel"
                          {...register('so_dien_thoai')}
                          className="h-11 pl-10 focus-ring"
                          placeholder="Nhập số điện thoại"
                        />
                      </div>
                    </div>

                    {/* CCCD */}
                    <div className="space-y-2">
                      <Label htmlFor="so_cccd" className="text-sm font-medium text-gray-700">
                        Số CCCD
                      </Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="so_cccd"
                          type="text"
                          maxLength={12}
                          {...register('so_cccd')}
                          className={cn(
                            "h-11 pl-10 focus-ring",
                            errors.so_cccd && "border-red-300"
                          )}
                          placeholder="Nhập số CCCD (12 số)"
                        />
                      </div>
                      {errors.so_cccd && (
                        <p className="text-sm text-red-600 flex items-center">
                          <AlertCircleIcon className="w-4 h-4 mr-1" />
                          {errors.so_cccd.message}
                        </p>
                      )}
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                      <Label htmlFor="dia_chi" className="text-sm font-medium text-gray-700">
                        Địa chỉ
                      </Label>
                      <div className="relative">
                        <MapPinIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="dia_chi"
                          type="text"
                          {...register('dia_chi')}
                          className="h-11 pl-10 focus-ring"
                          placeholder="Nhập địa chỉ"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="flex-1 h-11 font-semibold"
                      >
                        <ArrowLeftIcon className="mr-2 h-4 w-4" />
                        Quay lại
                      </Button>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 h-11 land-gradient hover:shadow-lg transition-all font-semibold"
                      >
                        {isLoading ? (
                          <>
                            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                            Đang đăng ký...
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="mr-2 h-4 w-4" />
                            Hoàn thành đăng ký
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Login Link */}
                <div className="text-center pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-600">
                    Đã có tài khoản?{' '}
                    <Link
                      href="/auth/login"
                      className="font-semibold text-green-600 hover:text-green-500 transition-colors"
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

      {/* Right Side - Benefits */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-green-800">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <div className="max-w-lg">
            <h1 className="text-4xl font-bold mb-6 animate-fade-in-up">
              Tham gia cộng đồng quản lý đất đai
            </h1>
            <p className="text-xl mb-8 text-green-100 leading-relaxed animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              Trở thành thành viên để truy cập đầy đủ các tính năng và tham gia 
              vào hệ thống đấu giá đất đai chuyên nghiệp.
            </p>
            
            {/* Benefits */}
            <div className="space-y-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircleIcon className="w-6 h-6 text-green-200" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Truy cập thông tin đất đai</h3>
                  <p className="text-green-100">Xem chi tiết thông tin các thửa đất, bản đồ địa chính</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <UserPlusIcon className="w-6 h-6 text-green-200" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Tham gia đấu giá</h3>
                  <p className="text-green-100">Đăng ký và tham gia các cuộc đấu giá đất đai</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <LandmarkIcon className="w-6 h-6 text-green-200" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Quản lý hồ sơ</h3>
                  <p className="text-green-100">Theo dõi và quản lý các hồ sơ, tài liệu cá nhân</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 border border-white border-opacity-20 rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 border border-white border-opacity-20 rounded-full"></div>
      </div>
    </div>
  );
}