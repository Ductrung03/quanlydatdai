import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [donViList, loaiDatList, trangThaiList] = await Promise.all([
      prisma.don_vi_hanh_chinh.findMany({
        where: { trang_thai: true },
        select: {
          ma_don_vi: true,
          ten_don_vi: true,
          cap_don_vi: true
        },
        orderBy: { ten_don_vi: 'asc' }
      }),
      prisma.loai_dat.findMany({
        where: { trang_thai: true },
        select: {
          ma_loai_dat: true,
          ten_loai_dat: true,
          mau_sac_hien_thi: true
        },
        orderBy: { thu_tu_hien_thi: 'asc' }
      }),
      prisma.trang_thai_quy_dat.findMany({
        where: { trang_thai: true },
        select: {
          ma_trang_thai: true,
          ten_trang_thai: true,
          mau_sac: true,
          cho_phep_dau_gia: true
        },
        orderBy: { thu_tu_hien_thi: 'asc' }
      })
    ]);

    return NextResponse.json({
      donViHanhChinh: donViList,
      loaiDat: loaiDatList,
      trangThaiQuyDat: trangThaiList
    });

  } catch (error) {
    console.error('Error fetching options:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}