import { z } from 'zod';

export const createThuaDatSchema = z.object({
  so_thua: z.string().min(1, 'Số thửa không được để trống'),
  so_to_ban_do: z.string().min(1, 'Số tờ bản đồ không được để trống'),
  ma_don_vi: z.string().min(1, 'Đơn vị hành chính không được để trống'),
  ma_loai_dat: z.string().min(1, 'Loại đất không được để trống'),
  ma_trang_thai: z.string().min(1, 'Trạng thái không được để trống'),
  dien_tich_phap_ly: z.number().positive('Diện tích phải lớn hơn 0'),
  dien_tich_thuc_te: z.number().positive().optional(),
  dia_chi: z.string().optional(),
  gia_dat_m2: z.number().min(0).optional(),
  gia_dat_tong: z.number().min(0).optional(),
  nam_gia_dat: z.number().optional(),
  ghi_chu: z.string().optional(),
  ngay_nhap_quy_dat: z.string(),
});