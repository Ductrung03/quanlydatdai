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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  MoreHorizontalIcon, 
  EditIcon, 
  Trash2Icon, 
  EyeIcon, 
  MapPinIcon, 
  FileTextIcon,
  Loader2Icon,
  CopyIcon,
  ExternalLinkIcon,
  CalendarIcon,
  UserIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  MapIcon,
  TreePine
} from 'lucide-react';
import { ThuaDat } from '@/types/land';
import { useLandMutations } from '@/hooks/use-land';
import { toast } from 'sonner';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

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
  const [copiedId, setCopiedId] = useState<string | null>(null);
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

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success('Đã sao chép mã thửa đất');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (trangThai: ThuaDat['trang_thai_quy_dat']) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircleIcon },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: AlertCircleIcon },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-800', icon: AlertCircleIcon }
    };
    
    return (
      <Badge 
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1 font-medium border-0',
          'bg-opacity-100'
        )}
        style={{ 
          backgroundColor: `${trangThai.mau_sac}20`,
          color: trangThai.mau_sac
        }}
      >
        <div 
          className="w-2 h-2 rounded-full" 
          style={{ backgroundColor: trangThai.mau_sac }}
        />
        {trangThai.ten_trang_thai}
        {trangThai.cho_phep_dau_gia && (
          <span className="ml-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            Đấu giá
          </span>
        )}
      </Badge>
    );
  };

  const getLandTypeBadge = (loaiDat: ThuaDat['loai_dat']) => {
    return (
      <Badge 
        variant="secondary" 
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1 font-medium border',
          'hover:shadow-sm transition-all duration-200'
        )}
        style={{ 
          backgroundColor: `${loaiDat.mau_sac_hien_thi}15`,
          color: loaiDat.mau_sac_hien_thi,
          borderColor: `${loaiDat.mau_sac_hien_thi}40`
        }}
      >
        <TreePine className="w-3 h-3" />
        {loaiDat.ten_loai_dat}
      </Badge>
    );
  };

  const getPriceChangeIndicator = (land: ThuaDat) => {
    if (!land.gia_dat_m2) return null;
    
    // Mock price change calculation - in real app, compare with historical data
    const mockPriceChange = Math.random() > 0.5 ? 5.2 : -2.1;
    const isPositive = mockPriceChange > 0;
    
    return (
      <div className={cn(
        'flex items-center text-xs',
        isPositive ? 'text-green-600' : 'text-red-600'
      )}>
        {isPositive ? (
          <TrendingUpIcon className="w-3 h-3 mr-1" />
        ) : (
          <TrendingDownIcon className="w-3 h-3 mr-1" />
        )}
        <span>{isPositive ? '+' : ''}{mockPriceChange}%</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            <MapIcon className="w-6 h-6 text-green-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900 mb-1">Đang tải dữ liệu đất đai</p>
            <p className="text-sm text-gray-500">Vui lòng chờ trong giây lát...</p>
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-12">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <MapIcon className="w-10 h-10 text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Không tìm thấy thửa đất nào
            </h3>
            <p className="text-gray-500 mb-4">
              Thử điều chỉnh bộ lọc hoặc thêm thửa đất mới vào hệ thống
            </p>
            <Button variant="outline" onClick={onRefresh}>
              <MapIcon className="w-4 h-4 mr-2" />
              Làm mới dữ liệu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="relative">
        <Table className="data-table">
          <TableHeader>
            <TableRow className="bg-gray-50/80 border-b-2 border-gray-200">
              <TableHead className="font-semibold text-gray-700 py-4">
                <div className="flex items-center space-x-2">
                  <CopyIcon className="w-4 h-4" />
                  <span>Mã thửa đất</span>
                </div>
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                <div className="flex items-center space-x-2">
                  <MapIcon className="w-4 h-4" />
                  <span>Thửa/Tờ BĐ</span>
                </div>
              </TableHead>
              <TableHead className="font-semibold text-gray-700">Đơn vị hành chính</TableHead>
              <TableHead className="font-semibold text-gray-700">Loại đất</TableHead>
              <TableHead className="font-semibold text-gray-700">Trạng thái</TableHead>
              <TableHead className="font-semibold text-gray-700 text-right">
                Diện tích (m²)
              </TableHead>
              <TableHead className="font-semibold text-gray-700 text-right">
                Giá đất/m²
              </TableHead>
              <TableHead className="font-semibold text-gray-700 text-right">
                Tổng giá trị
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-4 h-4" />
                  <span>Ngày tạo</span>
                </div>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow 
                key={item.ma_thua_dat}
                className={cn(
                  "hover:bg-gray-50/80 transition-colors duration-200",
                  "border-b border-gray-100 group"
                )}
              >
                <TableCell className="py-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyId(item.ma_thua_dat)}
                        className="font-mono text-sm bg-gray-50 hover:bg-gray-100 h-8 px-2"
                      >
                        <span className="max-w-[120px] truncate">
                          {item.ma_thua_dat}
                        </span>
                        {copiedId === item.ma_thua_dat ? (
                          <CheckCircleIcon className="w-3 h-3 ml-1 text-green-600" />
                        ) : (
                          <CopyIcon className="w-3 h-3 ml-1 text-gray-400" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click để sao chép mã</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>

                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-bold text-green-700">
                          {item.so_thua}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Thửa {item.so_thua}</div>
                        <div className="text-sm text-gray-500">Tờ {item.so_to_ban_do}</div>
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-gray-900 max-w-[150px] truncate">
                      {item.don_vi_hanh_chinh.ten_don_vi}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Cấp {item.don_vi_hanh_chinh.cap_don_vi}
                    </Badge>
                  </div>
                </TableCell>

                <TableCell>
                  {getLandTypeBadge(item.loai_dat)}
                </TableCell>

                <TableCell>
                  {getStatusBadge(item.trang_thai_quy_dat)}
                </TableCell>

                <TableCell className="text-right">
                  <div className="space-y-1">
                    <div className="font-semibold text-gray-900">
                      {item.dien_tich_phap_ly.toLocaleString('vi-VN')}
                    </div>
                    {item.dien_tich_thuc_te && (
                      <div className="text-sm text-gray-500">
                        Thực tế: {item.dien_tich_thuc_te.toLocaleString('vi-VN')}
                        {item.dien_tich_thuc_te !== item.dien_tich_phap_ly && (
                          <span className={cn(
                            "ml-1",
                            item.dien_tich_thuc_te > item.dien_tich_phap_ly 
                              ? "text-green-600" 
                              : "text-red-600"
                          )}>
                            ({item.dien_tich_thuc_te > item.dien_tich_phap_ly ? '+' : ''}
                            {(item.dien_tich_thuc_te - item.dien_tich_phap_ly).toFixed(1)})
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  {item.gia_dat_m2 ? (
                    <div className="space-y-1">
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(item.gia_dat_m2)}
                      </div>
                      {item.nam_gia_dat && (
                        <div className="text-sm text-gray-500">
                          Năm {item.nam_gia_dat}
                        </div>
                      )}
                      {getPriceChangeIndicator(item)}
                    </div>
                  ) : (
                    <div className="text-center">
                      <span className="text-gray-400 text-sm">Chưa định giá</span>
                      <div className="text-xs text-gray-300">Cần cập nhật</div>
                    </div>
                  )}
                </TableCell>

                <TableCell className="text-right">
                  {item.gia_dat_tong ? (
                    <div className="space-y-1">
                      <div className="font-bold text-green-700">
                        {formatCurrency(item.gia_dat_tong)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {(item.gia_dat_tong / 1000000).toFixed(1)}M VNĐ
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>

                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900">
                      {formatDate(item.ngay_tao)}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Avatar className="w-5 h-5 mr-1">
                        <AvatarFallback className="text-xs bg-gray-100 text-gray-600">
                          {item.nguoi_dung.ho_ten.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate max-w-[80px]">
                        {item.nguoi_dung.ho_ten}
                      </span>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className={cn(
                          "h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                          "hover:bg-gray-100 focus:opacity-100"
                        )}
                      >
                        <span className="sr-only">Mở menu thao tác</span>
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem 
                        onClick={() => onViewDetails(item)}
                        className="cursor-pointer"
                      >
                        <EyeIcon className="mr-2 h-4 w-4 text-blue-600" />
                        <span>Xem chi tiết</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onViewMap(item)}
                        className="cursor-pointer"
                      >
                        <MapPinIcon className="mr-2 h-4 w-4 text-green-600" />
                        <span>Xem trên bản đồ</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onManageDocuments(item)}
                        className="cursor-pointer"
                      >
                        <FileTextIcon className="mr-2 h-4 w-4 text-purple-600" />
                        <span>Quản lý tài liệu</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onEdit(item)}
                        className="cursor-pointer"
                      >
                        <EditIcon className="mr-2 h-4 w-4 text-orange-600" />
                        <span>Chỉnh sửa</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setDeleteItem(item)}
                        className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        <Trash2Icon className="mr-2 h-4 w-4" />
                        <span>Xóa thửa đất</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center space-x-2">
                <AlertCircleIcon className="w-5 h-5 text-red-600" />
                <span>Xác nhận xóa thửa đất</span>
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-3">
                <p>
                  Bạn có chắc chắn muốn xóa thửa đất{' '}
                  <span className="font-semibold text-gray-900">
                    {deleteItem?.ma_thua_dat}
                  </span>{' '}
                  không?
                </p>
                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <p className="text-sm text-red-800 font-medium">
                    ⚠️ Cảnh báo: Hành động này không thể hoàn tác
                  </p>
                  <ul className="text-sm text-red-700 mt-1 space-y-1">
                    <li>• Tất cả tài liệu liên quan sẽ bị xóa</li>
                    <li>• Lịch sử đấu giá sẽ bị ảnh hưởng</li>
                    <li>• Không thể khôi phục dữ liệu sau khi xóa</li>
                  </ul>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteLoading} className="font-medium">
                Hủy bỏ
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleteLoading}
                className="bg-red-600 hover:bg-red-700 font-medium"
              >
                {deleteLoading ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  <>
                    <Trash2Icon className="mr-2 h-4 w-4" />
                    Xóa thửa đất
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}