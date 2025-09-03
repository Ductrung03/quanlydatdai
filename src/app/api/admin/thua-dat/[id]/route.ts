import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { createThuaDatSchema } from "@/lib/schemas/land";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";


// src/app/api/admin/thua-dat/[id]/route.ts
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  
  if (session?.user?.vai_tro !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validatedData = createThuaDatSchema.partial().parse(body);

    const updatedThuaDat = await db.thuaDat.update({
      where: { ma_thua_dat: params.id },
      data: {
        ...validatedData,
        ngay_nhap_quy_dat: validatedData.ngay_nhap_quy_dat ? new Date(validatedData.ngay_nhap_quy_dat) : undefined,
        nguoi_cap_nhat: parseInt(session.user.id),
        ngay_cap_nhat: new Date(),
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
      message: 'Cập nhật thửa đất thành công',
      data: updatedThuaDat
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Error updating thua dat:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  
  if (session?.user?.vai_tro !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  try {
    // Soft delete by setting trang_thai_hoat_dong to false
    await prisma.thua_dat.update({
      where: { ma_thua_dat: params.id },
      data: {
        trang_thai_hoat_dong: false,
        nguoi_cap_nhat: parseInt(session.user.id),
        ngay_cap_nhat: new Date(),
      }
    });

    return NextResponse.json({
      message: 'Xóa thửa đất thành công'
    });

  } catch (error) {
    console.error('Error deleting thua dat:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}