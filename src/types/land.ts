// src/types/land.ts
export interface ThuaDat {
  ma_thua_dat: string;
  so_thua: string;
  so_to_ban_do: string;
  ma_don_vi: string;
  ma_loai_dat: string;
  ma_trang_thai: string;
  dien_tich_phap_ly: number;
  dien_tich_thuc_te?: number;
  dia_chi?: string;
  gia_dat_m2?: number;
  gia_dat_tong?: number;
  nam_gia_dat?: number;
  ghi_chu?: string;
  trang_thai_hoat_dong: boolean;
  ngay_nhap_quy_dat: Date;
  ngay_tao: Date;
  nguoi_tao: number;
  ngay_cap_nhat?: Date;
  nguoi_cap_nhat?: number;
  don_vi_hanh_chinh: {
    ten_don_vi: string;
    cap_don_vi: number;
  };
  loai_dat: {
    ten_loai_dat: string;
    mau_sac_hien_thi: string;
  };
  trang_thai_quy_dat: {
    ten_trang_thai: string;
    mau_sac: string;
    cho_phep_dau_gia: boolean;
  };
  nguoi_dung: {
    ho_ten: string;
  };
}

export interface DonViHanhChinh {
  ma_don_vi: string;
  ten_don_vi: string;
  cap_don_vi: number;
}

export interface LoaiDat {
  ma_loai_dat: string;
  ten_loai_dat: string;
  mau_sac_hien_thi: string;
}

export interface TrangThaiQuyDat {
  ma_trang_thai: string;
  ten_trang_thai: string;
  mau_sac: string;
  cho_phep_dau_gia: boolean;
}

export interface LandFilterOptions {
  search?: string;
  ma_don_vi?: string;
  ma_loai_dat?: string;
  ma_trang_thai?: string;
  min_area?: number;
  max_area?: number;
  page?: number;
  limit?: number;
}

export interface CreateThuaDatData {
  so_thua: string;
  so_to_ban_do: string;
  ma_don_vi: string;
  ma_loai_dat: string;
  ma_trang_thai: string;
  dien_tich_phap_ly: number;
  dien_tich_thuc_te?: number;
  dia_chi?: string;
  gia_dat_m2?: number;
  gia_dat_tong?: number;
  nam_gia_dat?: number;
  ghi_chu?: string;
  ngay_nhap_quy_dat: string;
}

export interface LandManagementOptions {
  donViHanhChinh: DonViHanhChinh[];
  loaiDat: LoaiDat[];
  trangThaiQuyDat: TrangThaiQuyDat[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}