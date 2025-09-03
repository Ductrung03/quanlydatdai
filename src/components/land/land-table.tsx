// src/components/land/land-table.tsx
'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  MapPin, 
  FileText,
  Loader2
} from 'lucide-react';
import { ThuaDat } from '@/types/land';
import { useLandMutations } from '@/hooks/use-land';
import { toast } from 'sonner';
import { formatCurrency, formatDate } from '@/lib/utils';

interface LandTableProps {
  data: ThuaDat[];
  loading: boolean;
  onEdit: (item: ThuaDat) => void;
  onViewDetails: (item: ThuaDat) => void;
  onViewMap: (item: ThuaDat) => void;
  onManageDocuments: (item: ThuaDat) => void;
  onRefresh: () => void;
}

export function LandTable({
  data,
  loading,
  onEdit,
  onViewDetails,
  onViewMap,
  onManageDocuments,
  onRefresh
}: LandTableProps) {
  const [deleteItem, setDeleteItem] = useState<ThuaDat | null>(null);
  const { deleteLand, loading: deleteLoading } = useLandMutations();

  const handleDelete = async () => {
    if (!deleteItem) return;

    try {
      await deleteLand(deleteItem.ma_thua_dat);
      toast.success('Xóa thửa đất thành công');
      onRefresh();
      setDeleteItem(null);
    } catch (error) {
      toast.error('Không thể xóa thửa đất');
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="text-gray-500 mb-2">Không tìm thấy thửa đất nào</div>
        <p className="text-sm text-gray-400">
          Thử điều chỉnh bộ lọc hoặc thêm thửa đất mới
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Mã thửa đất</TableHead>
              <TableHead>Số thửa/Tờ BĐ</TableHead>
              <TableHead>Đơn vị hành chính</TableHead>
              <TableHead>Loại đất</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Diện tích (m²)</TableHead>
              <TableHead className="text-right">Giá đất/m²</TableHead>
              <TableHead className="text-right">Tổng giá trị</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.ma_thua_dat}>
                <TableCell className="font-mono text-sm">
                  {item.ma_thua_dat}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      Thửa {item.so_thua}
                    </div>
                    <div className="text-sm text-gray-500">
                      Tờ {item.so_to_ban_do}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {item.don_vi_hanh_chinh.ten_don_vi}
                    </div>
                    <div className="text-sm text-gray-500">
                      Cấp {item.don_vi_hanh_chinh.cap_don_vi}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {getLandTypeBadge(item.loai_dat)}
                </TableCell>
                <TableCell>
                  {getStatusBadge(item.trang_thai_quy_dat)}
                </TableCell>
                <TableCell className="text-right">
                  <div>
                    <div className="font-medium">
                      {item.dien_tich_phap_ly.toLocaleString('vi-VN')}
                    </div>
                    {item.dien_tich_thuc_te && (
                      <div className="text-sm text-gray-500">
                        Thực tế: {item.dien_tich_thuc_te.toLocaleString('vi-VN')}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {item.gia_dat_m2 ? (
                    <div>
                      <div className="font-medium">
                        {formatCurrency(item.gia_dat_m2)}
                      </div>
                      {item.nam_gia_dat && (
                        <div className="text-sm text-gray-500">
                          Năm {item.nam_gia_dat}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400">Chưa định giá</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {item.gia_dat_tong ? (
                    <div className="font-medium text-green-600">
                      {formatCurrency(item.gia_dat_tong)}
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="text-sm">
                      {formatDate(item.ngay_tao)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.nguoi_dung.ho_ten}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Mở menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewDetails(item)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onViewMap(item)}>
                        <MapPin className="mr-2 h-4 w-4" />
                        Xem trên bản đồ
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onManageDocuments(item)}>
                        <FileText className="mr-2 h-4 w-4" />
                        Quản lý tài liệu
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEdit(item)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setDeleteItem(item)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa thửa đất</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa thửa đất <strong>{deleteItem?.ma_thua_dat}</strong> không?
              <br />
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                'Xóa'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
