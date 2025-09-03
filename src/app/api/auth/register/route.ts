// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { z, ZodError } from 'zod'; // Explicitly import ZodError

const registerSchema = z.object({
  ten_dang_nhap: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
  mat_khau: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  ho_ten: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ').optional(),
  so_dien_thoai: z.string().optional(),
  so_cccd: z.string().length(12, 'CCCD phải có 12 số').optional(),
  dia_chi: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // Check if username already exists
    const existingUser = await prisma.nguoi_dung.findUnique({
      where: { ten_dang_nhap: validatedData.ten_dang_nhap },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Tên đăng nhập đã tồn tại' },
        { status: 400 }
      );
    }

    // Check if email already exists
    if (validatedData.email) {
      const existingEmail = await prisma.nguoi_dung.findUnique({
        where: { email: validatedData.email },
      });

      if (existingEmail) {
        return NextResponse.json(
          { error: 'Email đã được sử dụng' },
          { status: 400 }
        );
      }
    }

    // Check if CCCD already exists
    if (validatedData.so_cccd) {
      const existingCCCD = await prisma.nguoi_dung.findUnique({
        where: { so_cccd: validatedData.so_cccd },
      });

      if (existingCCCD) {
        return NextResponse.json(
          { error: 'Số CCCD đã được sử dụng' },
          { status: 400 }
        );
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.mat_khau, 12);

    // Create user
    const newUser = await prisma.nguoi_dung.create({
      data: {
        ten_dang_nhap: validatedData.ten_dang_nhap,
        mat_khau_hash: hashedPassword,
        ho_ten: validatedData.ho_ten,
        email: validatedData.email || null,
        so_dien_thoai: validatedData.so_dien_thoai || null,
        so_cccd: validatedData.so_cccd || null,
        dia_chi: validatedData.dia_chi || null,
        vai_tro: 'user',
        trang_thai_tai_khoan: true,
        nguoi_tao: null,
      },
      select: {
        ma_nguoi_dung: true,
        ten_dang_nhap: true,
        ho_ten: true,
        email: true,
        vai_tro: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Đăng ký thành công',
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra trong quá trình đăng ký' },
      { status: 500 }
    );
  }
}
