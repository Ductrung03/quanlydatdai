// src/app/api/admin/thua-dat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { db } from '@/lib/db';
import { createThuaDatSchema } from '@/lib/schemas/land';


export async function GET(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.vai_tro || !['admin', 'user'].includes(session.user.vai_tro)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const ma_don_vi = searchParams.get('ma_don_vi');
    const ma_loai_dat = searchParams.get('ma_loai_dat');
    const ma_trang_thai = searchParams.get('ma_trang_thai');
    const min_area = searchParams.get('min_area');
    const max_area = searchParams.get('max_area');

    const skip = (page - 1) * limit;

    const where: any = {
      trang_thai_hoat_dong: true,
    };

    if (search) {
      where.OR = [
        { so_thua: { contains: search, mode: 'insensitive' } },
        { so_to_ban_do: { contains: search, mode: 'insensitive' } },
        { dia_chi: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (ma_don_vi) where.ma_don_vi = ma_don_vi;
    if (ma_loai_dat) where.ma_loai_dat = ma_loai_dat;
    if (ma_trang_thai) where.ma_trang_thai = ma_trang_thai;
    
    if (min_area || max_area) {
      where.dien_tich_phap_ly = {};
      if (min_area) where.dien_tich_phap_ly.gte = parseFloat(min_area);
      if (max_area) where.dien_tich_phap_ly.lte = parseFloat(max_area);
    }

    const [thuaDatList, totalCount] = await Promise.all([
      prisma.thua_dat.findMany({
        where,
        include: {
          don_vi_hanh_chinh: {
            select: { ten_don_vi: true, cap_don_vi: true }
          },
          loai_dat: {
            select: { ten_loai_dat: true, mau_sac_hien_thi: true }
          },
          trang_thai_quy_dat: {
            select: { ten_trang_thai: true, mau_sac: true, cho_phep_dau_gia: true }
          },
          nguoi_dung: {
            select: { ho_ten: true }
          }
        },
        skip,
        take: limit,
        orderBy: { ngay_tao: 'desc' }
      }),
      prisma.thua_dat.count({ where })
    ]);

    return NextResponse.json({
      data: thuaDatList,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching thua dat:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  
  if (session?.user?.vai_tro !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validatedData = createThuaDatSchema.parse(body);

    // Check for duplicate (so_thua + so_to_ban_do + ma_don_vi must be unique)
    const existing = await prisma.thua_dat.findFirst({
      where: {
        so_thua: validatedData.so_thua,
        so_to_ban_do: validatedData.so_to_ban_do,
        ma_don_vi: validatedData.ma_don_vi,
      }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Thửa đất với thông tin này đã tồn tại' },
        { status: 400 }
      );
    }

    // Generate ma_thua_dat
    const ma_thua_dat = `${validatedData.ma_don_vi}_${validatedData.so_to_ban_do}_${validatedData.so_thua}`;

    const newThuaDat = await db.thuaDat.create({
      data: {
        ma_thua_dat,
        so_thua: validatedData.so_thua,
        so_to_ban_do: validatedData.so_to_ban_do,
        ma_don_vi: validatedData.ma_don_vi,
        ma_loai_dat: validatedData.ma_loai_dat,
        ma_trang_thai: validatedData.ma_trang_thai,
        dien_tich_phap_ly: validatedData.dien_tich_phap_ly,
        dien_tich_thuc_te: validatedData.dien_tich_thuc_te,
        dia_chi: validatedData.dia_chi,
        gia_dat_m2: validatedData.gia_dat_m2,
        gia_dat_tong: validatedData.gia_dat_tong,
        nam_gia_dat: validatedData.nam_gia_dat,
        ghi_chu: validatedData.ghi_chu,
        ngay_nhap_quy_dat: new Date(validatedData.ngay_nhap_quy_dat),
        nguoi_tao: parseInt(session.user.id),
        nguoi_cap_nhat: parseInt(session.user.id),
      },
      include: {
        don_vi_hanh_chinh: {
          select: { ten_don_vi: true }
        },
        loai_dat: {
          select: { ten_loai_dat: true }
        },
        trang_thai_quy_dat: {
          select: { ten_trang_thai: true }
        }
      }
    });

    return NextResponse.json({
      message: 'Tạo thửa đất thành công',
      data: newThuaDat
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Error creating thua dat:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}