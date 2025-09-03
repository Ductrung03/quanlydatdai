// src/components/land/land-form-dialog.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { ThuaDat, CreateThuaDatData, LandManagementOptions } from '@/types/land';
import { useLandMutations } from '@/hooks/use-land';

const landFormSchema = z.object({
  so_thua: z.string().min(1, 'Số thửa không được để trống'),
  so_to_ban_do: z.string().min(1, 'Số tờ bản đồ không được để trống'),
  ma_don_vi: z.string().min(1, 'Vui lòng chọn đơn vị hành chính'),
  ma_loai_dat: z.string().min(1, 'Vui lòng chọn loại đất'),
  ma_trang_thai: z.string().min(1, 'Vui lòng chọn trạng thái'),
  dien_tich_phap_ly: z.number().positive('Diện tích pháp lý phải lớn hơn 0'),
  dien_tich_thuc_te: z.number().positive().optional(),
  dia_chi: z.string().optional(),
  gia_dat_m2: z.number().min(0).optional(),
  gia_dat_tong: z.number().min(0).optional(),
  nam_gia_dat: z.number().optional(),
  ghi_chu: z.string().optional(),
  ngay_nhap_quy_dat: z.string().min(1, 'Vui lòng chọn ngày nhập quỹ đất'),
});

type LandFormData = z.infer<typeof landFormSchema>;

interface LandFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  options: LandManagementOptions;
  editData?: ThuaDat | null;
  onSuccess: () => void;
}

export function LandFormDialog({
  open,
  onOpenChange,
  options,
  editData,
  onSuccess
}: LandFormDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const { createLand, updateLand, loading } = useLandMutations();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<LandFormData>({
    resolver: zodResolver(landFormSchema)
  });

  const watchedValues = watch();

  // Auto calculate total price
  useEffect(() => {
    if (watchedValues.gia_dat_m2 && watchedValues.dien_tich_phap_ly) {
      const total = watchedValues.gia_dat_m2 * watchedValues.dien_tich_phap_ly;
      setValue('gia_dat_tong', total);
    }
  }, [watchedValues.gia_dat_m2, watchedValues.dien_tich_phap_ly, setValue]);

  // Load edit data
  useEffect(() => {
    if (editData && open) {
      setValue('so_thua', editData.so_thua);
      setValue('so_to_ban_do', editData.so_to_ban_do);
      setValue('ma_don_vi', editData.ma_don_vi);
      setValue('ma_loai_dat', editData.ma_loai_dat);
      setValue('ma_trang_thai', editData.ma_trang_thai);
      setValue('dien_tich_phap_ly', editData.dien_tich_phap_ly);
      setValue('dien_tich_thuc_te', editData.dien_tich_thuc_te || undefined);
      setValue('dia_chi', editData.dia_chi || '');
      setValue('gia_dat_m2', editData.gia_dat_m2 || undefined);
      setValue('gia_dat_tong', editData.gia_dat_tong || undefined);
      setValue('nam_gia_dat', editData.nam_gia_dat || undefined);
      setValue('ghi_chu', editData.ghi_chu || '');
      setValue('ngay_nhap_quy_dat', 
        editData.ngay_nhap_quy_dat.toISOString().split('T')[0]
      );
    } else if (!editData && open) {
      reset();
    }
  }, [editData, open, setValue, reset]);

  const onSubmit = async (data: LandFormData) => {
    setError(null);

    try {
      const formData: CreateThuaDatData = {
        ...data,
        dien_tich_thuc_te: data.dien_tich_thuc_te || undefined,
        dia_chi: data.dia_chi || undefined,
        gia_dat_m2: data.gia_dat_m2 || undefined,
        gia_dat_tong: data.gia_dat_tong || undefined,
        nam_gia_dat: data.nam_gia_dat || undefined,
        ghi_chu: data.ghi_chu || undefined,
      };

      if (editData) {
        await updateLand(editData.ma_thua_dat, formData);
      } else {
        await createLand(formData);
      }

      onSuccess();
      onOpenChange(false);
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editData ? 'Chỉnh sửa thửa đất' : 'Thêm thửa đất mới'}
          </DialogTitle>
          <DialogDescription>
            {editData 
              ? 'Cập nhật thông tin thửa đất' 
              : 'Nhập thông tin để tạo thửa đất mới'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Số thửa */}
            <div className="space-y-2">
              <Label htmlFor="so_thua">Số thửa *</Label>
              <Input
                id="so_thua"
                {...register('so_thua')}
                placeholder="VD: 123"
              />
              {errors.so_thua && (
                <p className="text-sm text-red-600">{errors.so_thua.message}</p>
              )}
            </div>

            {/* Số tờ bản đồ */}
            <div className="space-y-2">
              <Label htmlFor="so_to_ban_do">Số tờ bản đồ *</Label>
              <Input
                id="so_to_ban_do"
                {...register('so_to_ban_do')}
                placeholder="VD: 45"
              />
              {errors.so_to_ban_do && (
                <p className="text-sm text-red-600">{errors.so_to_ban_do.message}</p>
              )}
            </div>

            {/* Đơn vị hành chính */}
            <div className="space-y-2">
              <Label>Đơn vị hành chính *</Label>
              <Select onValueChange={(value) => setValue('ma_don_vi', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn đơn vị" />
                </SelectTrigger>
                <SelectContent>
                  {options.donViHanhChinh.map((item) => (
                    <SelectItem key={item.ma_don_vi} value={item.ma_don_vi}>
                      {item.ten_don_vi} (Cấp {item.cap_don_vi})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.ma_don_vi && (
                <p className="text-sm text-red-600">{errors.ma_don_vi.message}</p>
              )}
            </div>

            {/* Loại đất */}
            <div className="space-y-2">
              <Label>Loại đất *</Label>
              <Select onValueChange={(value) => setValue('ma_loai_dat', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại đất" />
                </SelectTrigger>
                <SelectContent>
                  {options.loaiDat.map((item) => (
                    <SelectItem key={item.ma_loai_dat} value={item.ma_loai_dat}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.mau_sac_hien_thi }}
                        />
                        {item.ten_loai_dat}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.ma_loai_dat && (
                <p className="text-sm text-red-600">{errors.ma_loai_dat.message}</p>
              )}
            </div>

            {/* Trạng thái */}
            <div className="space-y-2">
              <Label>Trạng thái *</Label>
              <Select onValueChange={(value) => setValue('ma_trang_thai', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {options.trangThaiQuyDat.map((item) => (
                    <SelectItem key={item.ma_trang_thai} value={item.ma_trang_thai}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.mau_sac }}
                        />
                        {item.ten_trang_thai}
                        {item.cho_phep_dau_gia && (
                          <span className="text-xs bg-green-100 text-green-800 px-1 rounded">
                            Có thể đấu giá
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.ma_trang_thai && (
                <p className="text-sm text-red-600">{errors.ma_trang_thai.message}</p>
              )}
            </div>

            {/* Ngày nhập quỹ đất */}
            <div className="space-y-2">
              <Label htmlFor="ngay_nhap_quy_dat">Ngày nhập quỹ đất *</Label>
              <Input
                id="ngay_nhap_quy_dat"
                type="date"
                {...register('ngay_nhap_quy_dat')}
              />
              {errors.ngay_nhap_quy_dat && (
                <p className="text-sm text-red-600">{errors.ngay_nhap_quy_dat.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Diện tích pháp lý */}
            <div className="space-y-2">
              <Label htmlFor="dien_tich_phap_ly">Diện tích pháp lý (m²) *</Label>
              <Input
                id="dien_tich_phap_ly"
                type="number"
                step="0.01"
                {...register('dien_tich_phap_ly', { valueAsNumber: true })}
                placeholder="VD: 100.5"
              />
              {errors.dien_tich_phap_ly && (
                <p className="text-sm text-red-600">{errors.dien_tich_phap_ly.message}</p>
              )}
            </div>

            {/* Diện tích thực tế */}
            <div className="space-y-2">
              <Label htmlFor="dien_tich_thuc_te">Diện tích thực tế (m²)</Label>
              <Input
                id="dien_tich_thuc_te"
                type="number"
                step="0.01"
                {...register('dien_tich_thuc_te', { valueAsNumber: true })}
                placeholder="VD: 98.5"
              />
              {errors.dien_tich_thuc_te && (
                <p className="text-sm text-red-600">{errors.dien_tich_thuc_te.message}</p>
              )}
            </div>

            {/* Giá đất m² */}
            <div className="space-y-2">
              <Label htmlFor="gia_dat_m2">Giá đất/m² (VNĐ)</Label>
              <Input
                id="gia_dat_m2"
                type="number"
                {...register('gia_dat_m2', { valueAsNumber: true })}
                placeholder="VD: 1000000"
              />
              {errors.gia_dat_m2 && (
                <p className="text-sm text-red-600">{errors.gia_dat_m2.message}</p>
              )}
            </div>

            {/* Giá đất tổng */}
            <div className="space-y-2">
              <Label htmlFor="gia_dat_tong">Giá đất tổng (VNĐ)</Label>
              <Input
                id="gia_dat_tong"
                type="number"
                {...register('gia_dat_tong', { valueAsNumber: true })}
                placeholder="Tự động tính toán"
                readOnly={!!watchedValues.gia_dat_m2}
              />
              {errors.gia_dat_tong && (
                <p className="text-sm text-red-600">{errors.gia_dat_tong.message}</p>
              )}
            </div>

            {/* Năm giá đất */}
            <div className="space-y-2">
              <Label htmlFor="nam_gia_dat">Năm giá đất</Label>
              <Input
                id="nam_gia_dat"
                type="number"
                {...register('nam_gia_dat', { valueAsNumber: true })}
                placeholder="VD: 2024"
                min="2000"
                max="2030"
              />
              {errors.nam_gia_dat && (
                <p className="text-sm text-red-600">{errors.nam_gia_dat.message}</p>
              )}
            </div>
          </div>

          {/* Địa chỉ */}
          <div className="space-y-2">
            <Label htmlFor="dia_chi">Địa chỉ</Label>
            <Input
              id="dia_chi"
              {...register('dia_chi')}
              placeholder="Nhập địa chỉ cụ thể"
            />
            {errors.dia_chi && (
              <p className="text-sm text-red-600">{errors.dia_chi.message}</p>
            )}
          </div>

          {/* Ghi chú */}
          <div className="space-y-2">
            <Label htmlFor="ghi_chu">Ghi chú</Label>
            <Textarea
              id="ghi_chu"
              {...register('ghi_chu')}
              placeholder="Nhập ghi chú thêm"
              rows={3}
            />
            {errors.ghi_chu && (
              <p className="text-sm text-red-600">{errors.ghi_chu.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editData ? 'Đang cập nhật...' : 'Đang tạo...'}
                </>
              ) : (
                editData ? 'Cập nhật' : 'Tạo mới'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}