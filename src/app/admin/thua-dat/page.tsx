// src/app/admin/thua-dat/page.tsx
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
import { Plus, Download, Upload, BarChart3, RefreshCw } from 'lucide-react';
import { ThuaDat } from '@/types/land';
import { LandFormDialog } from '@/components/land/land-form-dialog';
import { LandFilterBar } from '@/components/land/land-filter-bar';
import { LandTable } from '@/components/land/land-table';
import { LandDetailsDialog } from '@/components/land/land-details-dialog';
import { LandMapDialog } from '@/components/land/land-map-dialog';
import { DocumentManagementDialog } from '@/components/land/document-management-dialog';
import { toast } from 'sonner';




export default function LandManagementPage() {
  const { user, isLoading: authLoading } = useRequireRole('admin');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showMapDialog, setShowMapDialog] = useState(false);
  const [showDocumentsDialog, setShowDocumentsDialog] = useState(false);
  const [selectedLand, setSelectedLand] = useState<ThuaDat | null>(null);

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
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
      // Implement export functionality
      toast.success('Xuất dữ liệu thành công');
    } catch (error) {
      toast.error('Không thể xuất dữ liệu');
    }
  };

  const handleImport = () => {
    // Implement import functionality
    toast.info('Chức năng nhập dữ liệu sẽ được phát triển');
  };

  if (optionsError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>
            Không thể tải tùy chọn: {optionsError}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (optionsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Quản lý đất đai</h1>
          <p className="text-gray-600 mt-2">
            Quản lý thông tin thửa đất, tài liệu và trạng thái sử dụng
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleImport}>
            <Upload className="h-4 w-4 mr-2" />
            Nhập dữ liệu
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Xuất dữ liệu
          </Button>
          <Button variant="outline" onClick={refresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
          <Button onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm thửa đất
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng thửa đất</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pagination.total.toLocaleString('vi-VN')}
            </div>
            <p className="text-xs text-muted-foreground">
              Đang hoạt động
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Có thể đấu giá</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {landList.filter(land => land.trang_thai_quy_dat.cho_phep_dau_gia).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Sẵn sàng đấu giá
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng diện tích</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {landList.reduce((sum, land) => sum + land.dien_tich_phap_ly, 0).toLocaleString('vi-VN')}
            </div>
            <p className="text-xs text-muted-foreground">
              m²
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng giá trị</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('vi-VN', { 
                notation: 'compact', 
                compactDisplay: 'short' 
              }).format(
                landList.reduce((sum, land) => sum + (land.gia_dat_tong || 0), 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              VNĐ
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
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
        <Alert variant="destructive">
          <AlertDescription>{landError}</AlertDescription>
        </Alert>
      )}

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <LandTable
            data={landList}
            loading={landLoading}
            onEdit={handleEdit}
            onViewDetails={handleViewDetails}
            onViewMap={handleViewMap}
            onManageDocuments={handleManageDocuments}
            onRefresh={refresh}
          />
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              {pagination.page > 1 && (
                <PaginationPrevious 
                  onClick={() => changePage(pagination.page - 1)}
                  className="cursor-pointer"
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
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              {pagination.page < pagination.totalPages && (
                <PaginationNext 
                  onClick={() => changePage(pagination.page + 1)}
                  className="cursor-pointer"
                />
              )}
            </PaginationContent>
          </Pagination>
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
  );
}