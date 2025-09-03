// src/components/land/land-details-dialog.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MapPin, Calendar, User, FileText, DollarSign } from 'lucide-react';
import { ThuaDat } from '@/types/land';

interface LandDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: ThuaDat | null;
}

export function LandDetailsDialog({
  open,
  onOpenChange,
  data
}: LandDetailsDialogProps) {
  if (!data) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  };

  const getStatusBadge = (trangThai: ThuaDat['trang_thai_quy_dat']) => {
    return (
      <Badge 
        variant="outline" 
        className="flex items-center gap-1"
        style={{ 
          borderColor: trangThai.mau_sac,
          color: trangThai.mau_sac 
        }}
      >
        <div 
          className="w-2 h-2 rounded-full" 
          style={{ backgroundColor: trangThai.mau_sac }}
        />
        {trangThai.ten_trang_thai}
        {trangThai.cho_phep_dau_gia && (
          <span className="ml-1 text-xs bg-green-100 text-green-800 px-1 rounded">
            Có thể đấu giá
          </span>
        )}
      </Badge>
    );
  };

  const getLandTypeBadge = (loaiDat: ThuaDat['loai_dat']) => {
    return (
      <Badge 
        variant="secondary" 
        className="flex items-center gap-1"
        style={{ 
          backgroundColor: `${loaiDat.mau_sac_hien_thi}20`,
          color: loaiDat.mau_sac_hien_thi,
          borderColor: loaiDat.mau_sac_hien_thi
        }}
      >
        <div 
          className="w-2 h-2 rounded-full" 
          style={{ backgroundColor: loaiDat.mau_sac_hien_thi }}
        />
        {loaiDat.ten_loai_dat}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Chi tiết thửa đất {data.ma_thua_dat}
          </DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về thửa đất số {data.so_thua}, tờ bản đồ {data.so_to_ban_do}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Thông tin cơ bản */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Thông tin cơ bản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Mã thửa đất</label>
                  <div className="font-mono text-sm bg-gray-50 p-2 rounded">
                    {data.ma_thua_dat}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Số thửa</label>
                  <div className="font-semibold">{data.so_thua}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Số tờ bản đồ</label>
                  <div className="font-semibold">{data.so_to_ban_do}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Trạng thái</label>
                  <div className="mt-1">{getStatusBadge(data.trang_thai_quy_dat)}</div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <label className="text-sm font-medium text-gray-600">Đơn vị hành chính</label>
                <div className="font-semibold">
                  {data.don_vi_hanh_chinh.ten_don_vi}
                  <span className="text-sm text-gray-500 ml-2">
                    (Cấp {data.don_vi_hanh_chinh.cap_don_vi})
                  </span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Loại đất</label>
                <div className="mt-1">{getLandTypeBadge(data.loai_dat)}</div>
              </div>
              
              {data.dia_chi && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Địa chỉ</label>
                  <div>{data.dia_chi}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Thông tin diện tích */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Thông tin diện tích
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Diện tích pháp lý</label>
                  <div className="text-2xl font-bold text-blue-600">
                    {data.dien_tich_phap_ly.toLocaleString('vi-VN')} m²
                  </div>
                </div>
                {data.dien_tich_thuc_te && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Diện tích thực tế</label>
                    <div className="text-2xl font-bold text-green-600">
                      {data.dien_tich_thuc_te.toLocaleString('vi-VN')} m²
                    </div>
                  </div>
                )}
              </div>
              
              {data.dien_tich_thuc_te && (
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-600">Chênh lệch diện tích</div>
                  <div className={`font-semibold ${
                    data.dien_tich_thuc_te > data.dien_tich_phap_ly 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {(data.dien_tich_thuc_te - data.dien_tich_phap_ly).toLocaleString('vi-VN')} m²
                    <span className="text-sm ml-1">
                      ({data.dien_tich_thuc_te > data.dien_tich_phap_ly ? '+' : ''}
                      {(((data.dien_tich_thuc_te - data.dien_tich_phap_ly) / data.dien_tich_phap_ly) * 100).toFixed(2)}%)
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Thông tin giá đất */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Thông tin giá đất
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.gia_dat_m2 ? (
                <>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Giá đất/m²</label>
                      <div className="text-xl font-bold text-orange-600">
                        {formatCurrency(data.gia_dat_m2)}
                      </div>
                      {data.nam_gia_dat && (
                        <div className="text-sm text-gray-500">
                          Năm {data.nam_gia_dat}
                        </div>
                      )}
                    </div>
                    
                    {data.gia_dat_tong && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Tổng giá trị</label>
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(data.gia_dat_tong)}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded">
                    <div className="text-sm text-blue-600 font-medium">Tính toán giá trị</div>
                    <div className="text-sm text-blue-800">
                      {data.dien_tich_phap_ly.toLocaleString('vi-VN')} m² × {formatCurrency(data.gia_dat_m2)} = {' '}
                      {formatCurrency(data.dien_tich_phap_ly * data.gia_dat_m2)}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <DollarSign className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <div>Chưa có thông tin giá đất</div>
                  <div className="text-sm">Vui lòng cập nhật thông tin định giá</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Thông tin quản lý */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-4 w-4" />
                Thông tin quản lý
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Ngày nhập quỹ đất</label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">
                    {formatDate(data.ngay_nhap_quy_dat).split(' ')[0]}
                  </span>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <label className="text-sm font-medium text-gray-600">Người tạo</label>
                <div className="font-medium">{data.nguoi_dung.ho_ten}</div>
                <div className="text-sm text-gray-500">
                  {formatDate(data.ngay_tao)}
                </div>
              </div>
              
              {data.ngay_cap_nhat && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Cập nhật lần cuối</label>
                  <div className="text-sm text-gray-700">
                    {formatDate(data.ngay_cap_nhat)}
                  </div>
                </div>
              )}
              
              <div className="bg-green-50 p-3 rounded">
                <div className="text-sm font-medium text-green-800">Trạng thái hoạt động</div>
                <div className="text-sm text-green-700">
                  {data.trang_thai_hoat_dong ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ghi chú */}
        {data.ghi_chu && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Ghi chú</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-yellow-50 p-4 rounded border-l-4 border-yellow-400">
                <div className="text-yellow-800">{data.ghi_chu}</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Thống kê nhanh */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Thống kê nhanh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {data.dien_tich_phap_ly}
                </div>
                <div className="text-sm text-gray-600">m² pháp lý</div>
              </div>
              
              {data.gia_dat_m2 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(data.gia_dat_m2 / 1000000)}M
                  </div>
                  <div className="text-sm text-gray-600">VNĐ/m²</div>
                </div>
              )}
              
              {data.gia_dat_tong && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(data.gia_dat_tong / 1000000000)}B
                  </div>
                  <div className="text-sm text-gray-600">VNĐ tổng</div>
                </div>
              )}
              
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.floor((new Date().getTime() - new Date(data.ngay_tao).getTime()) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-sm text-gray-600">ngày trong hệ thống</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}