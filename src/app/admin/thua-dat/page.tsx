'use client';

import { useState } from 'react';
import { useRequireRole } from '@/hooks/use-auth';
import { useLandList, useLandOptions } from '@/hooks/use-land';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  PlusIcon, 
  DownloadIcon, 
  UploadIcon, 
  BarChart3Icon, 
  RefreshCwIcon, 
  MapIcon,
  TreePine,
  Landmark,
  TrendingUpIcon,
  AlertCircleIcon,
  FilterIcon,
  SearchIcon,
  GridIcon,
  ListIcon
} from 'lucide-react';
import { ThuaDat } from '@/types/land';
import { LandFormDialog } from '@/components/land/land-form-dialog';
import { LandFilterBar } from '@/components/land/land-filter-bar';
import { LandTable } from '@/components/land/land-table';
import { LandDetailsDialog } from '@/components/land/land-details-dialog';
import { LandMapDialog } from '@/components/land/land-map-dialog';
import { DocumentManagementDialog } from '@/components/land/document-management-dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function LandManagementPage() {
  const { user, isLoading: authLoading } = useRequireRole('admin');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showMapDialog, setShowMapDialog] = useState(false);
  const [showDocumentsDialog, setShowDocumentsDialog] = useState(false);
  const [selectedLand, setSelectedLand] = useState<ThuaDat | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const {
    data: landList,
    pagination,
    loading: landLoading,
    error: landError,
    filters,
    updateFilters,
    changePage,
    refresh
  } = useLandList();

  const { options, loading: optionsLoading, error: optionsError } = useLandOptions();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="text-gray-600 font-medium">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  const handleEdit = (land: ThuaDat) => {
    setSelectedLand(land);
    setShowCreateDialog(true);
  };

  const handleViewDetails = (land: ThuaDat) => {
    setSelectedLand(land);
    setShowDetailsDialog(true);
  };

  const handleViewMap = (land: ThuaDat) => {
    setSelectedLand(land);
    setShowMapDialog(true);
  };

  const handleManageDocuments = (land: ThuaDat) => {
    setSelectedLand(land);
    setShowDocumentsDialog(true);
  };

  const handleCreateNew = () => {
    setSelectedLand(null);
    setShowCreateDialog(true);
  };

  const handleFormSuccess = () => {
    refresh();
    toast.success(selectedLand ? 'Cập nhật thửa đất thành công' : 'Tạo thửa đất thành công');
  };

  const handleResetFilters = () => {
    updateFilters({
      search: '',
      ma_don_vi: undefined,
      ma_loai_dat: undefined,
      ma_trang_thai: undefined,
      min_area: undefined,
      max_area: undefined,
    });
  };

  const handleExport = async () => {
    try {
      toast.success('Xuất dữ liệu thành công');
    } catch (error) {
      toast.error('Không thể xuất dữ liệu');
    }
  };

  const handleImport = () => {
    toast.info('Chức năng nhập dữ liệu sẽ được phát triển');
  };

  // Calculate statistics
  const stats = {
    total: pagination.total,
    available: landList.filter(land => land.trang_thai_quy_dat.cho_phep_dau_gia).length,
    totalArea: landList.reduce((sum, land) => sum + land.dien_tich_phap_ly, 0),
    totalValue: landList.reduce((sum, land) => sum + (land.gia_dat_tong || 0), 0)
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      notation: 'compact', 
      compactDisplay: 'short',
      maximumFractionDigits: 1
    }).format(amount) + ' VNĐ';
  };

  if (optionsError) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertDescription>
            Không thể tải tùy chọn: {optionsError}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (optionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
              <div className="animate-fade-in-up">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 land-gradient rounded-xl flex items-center justify-center">
                    <MapIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Quản lý đất đai</h1>
                    <p className="text-gray-600">Quản lý thông tin thửa đất, tài liệu và trạng thái sử dụng</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="outline" onClick={handleImport} className="flex items-center space-x-2">
                  <UploadIcon className="h-4 w-4" />
                  <span>Nhập dữ liệu</span>
                </Button>
                <Button variant="outline" onClick={handleExport} className="flex items-center space-x-2">
                  <DownloadIcon className="h-4 w-4" />
                  <span>Xuất dữ liệu</span>
                </Button>
                <Button variant="outline" onClick={refresh} className="flex items-center space-x-2">
                  <RefreshCwIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Làm mới</span>
                </Button>
                <Button onClick={handleCreateNew} className="land-gradient hover:shadow-lg transition-all flex items-center space-x-2">
                  <PlusIcon className="h-4 w-4" />
                  <span>Thêm thửa đất</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="card-hover border-l-4 border-l-green-500 animate-fade-in-up">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Tổng thửa đất</CardTitle>
                <div className="w-10 h-10 land-gradient rounded-lg flex items-center justify-center">
                  <BarChart3Icon className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stats.total.toLocaleString('vi-VN')}
                </div>
                <div className="flex items-center text-sm">
                  <TrendingUpIcon className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">Đang hoạt động</span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover border-l-4 border-l-blue-500 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Có thể đấu giá</CardTitle>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Landmark className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stats.available}
                </div>
                <div className="flex items-center text-sm">
                  <Badge className="bg-blue-100 text-blue-800 border-0 text-xs">
                    Sẵn sàng đấu giá
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover border-l-4 border-l-purple-500 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Tổng diện tích</CardTitle>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <TreePine className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stats.totalArea.toLocaleString('vi-VN')}
                </div>
                <div className="flex items-center text-sm text-purple-600">
                  <span className="font-medium">m² đất quý</span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover border-l-4 border-l-orange-500 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Tổng giá trị</CardTitle>
                <div className="w-10 h-10 gold-gradient rounded-lg flex items-center justify-center">
                  <BarChart3Icon className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {formatCurrency(stats.totalValue)}
                </div>
                <div className="flex items-center text-sm text-orange-600">
                  <span className="font-medium">Ước tính thị trường</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters Section */}
          <Card className="animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <FilterIcon className="h-5 w-5 text-gray-600" />
                  <span>Bộ lọc & Tìm kiếm</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <Button
                      variant={viewMode === 'table' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('table')}
                      className="h-8 px-3"
                    >
                      <ListIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="h-8 px-3"
                    >
                      <GridIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <LandFilterBar
                filters={filters}
                onFiltersChange={updateFilters}
                onReset={handleResetFilters}
                options={options!}
                totalCount={pagination.total}
              />
            </CardContent>
          </Card>

          {/* Error Display */}
          {landError && (
            <Alert variant="destructive" className="animate-fade-in-up">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertDescription>{landError}</AlertDescription>
            </Alert>
          )}

          {/* Data Display */}
          <Card className="animate-fade-in-up" style={{animationDelay: '0.5s'}}>
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <SearchIcon className="h-5 w-5 text-gray-600" />
                  <span>Danh sách thửa đất</span>
                  <Badge variant="secondary" className="ml-2">
                    {pagination.total.toLocaleString('vi-VN')} kết quả
                  </Badge>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {viewMode === 'table' ? (
                <LandTable
                  data={landList}
                  loading={landLoading}
                  onEdit={handleEdit}
                  onViewDetails={handleViewDetails}
                  onViewMap={handleViewMap}
                  onManageDocuments={handleManageDocuments}
                  onRefresh={refresh}
                />
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <GridIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Chế độ xem dạng lưới đang được phát triển</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              <Card className="p-4">
                <Pagination>
                  <PaginationContent>
                    {pagination.page > 1 && (
                      <PaginationPrevious 
                        onClick={() => changePage(pagination.page - 1)}
                        className="cursor-pointer hover:bg-green-50 hover:text-green-700 transition-colors"
                      />
                    )}
                    
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const page = i + Math.max(1, pagination.page - 2);
                      if (page > pagination.totalPages) return null;
                      
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => changePage(page)}
                            isActive={page === pagination.page}
                            className={cn(
                              "cursor-pointer transition-colors",
                              page === pagination.page 
                                ? "bg-green-500 text-white hover:bg-green-600" 
                                : "hover:bg-green-50 hover:text-green-700"
                            )}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    {pagination.page < pagination.totalPages && (
                      <PaginationNext 
                        onClick={() => changePage(pagination.page + 1)}
                        className="cursor-pointer hover:bg-green-50 hover:text-green-700 transition-colors"
                      />
                    )}
                  </PaginationContent>
                </Pagination>
              </Card>
            </div>
          )}

          {/* Dialogs */}
          {options && (
            <LandFormDialog
              open={showCreateDialog}
              onOpenChange={setShowCreateDialog}
              options={options}
              editData={selectedLand}
              onSuccess={handleFormSuccess}
            />
          )}

          <LandDetailsDialog
            open={showDetailsDialog}
            onOpenChange={setShowDetailsDialog}
            data={selectedLand}
          />

          <LandMapDialog
            open={showMapDialog}
            onOpenChange={setShowMapDialog}
            data={selectedLand}
          />

          <DocumentManagementDialog
            open={showDocumentsDialog}
            onOpenChange={setShowDocumentsDialog}
            landData={selectedLand}
          />
        </div>
      </div>
    </div>
  );
}