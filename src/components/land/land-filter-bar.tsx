'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, X, RefreshCw } from 'lucide-react';
import { LandFilterOptions, LandManagementOptions } from '@/types/land';

interface LandFilterBarProps {
  filters: LandFilterOptions;
  onFiltersChange: (filters: Partial<LandFilterOptions>) => void;
  onReset: () => void;
  options: LandManagementOptions;
  totalCount: number;
}

export function LandFilterBar({
  filters,
  onFiltersChange,
  onReset,
  options,
  totalCount,
}: LandFilterBarProps) {
  const [localFilters, setLocalFilters] = useState<LandFilterOptions>(filters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearchChange = (search: string) => {
    setLocalFilters((prev) => ({ ...prev, search }));
    onFiltersChange({ search });
  };

  const handleFilterChange = (key: keyof LandFilterOptions, value: any) => {
    const newValue = value === 'all' ? undefined : value; // Treat 'all' as undefined
    const newFilters = { ...localFilters, [key]: newValue };
    setLocalFilters(newFilters);
    onFiltersChange({ [key]: newValue });
  };

  const handleAdvancedFilter = () => {
    onFiltersChange(localFilters);
    setShowAdvanced(false);
  };

  const handleReset = () => {
    const resetFilters: LandFilterOptions = {
      search: '',
      ma_don_vi: undefined,
      ma_loai_dat: undefined,
      ma_trang_thai: undefined,
      min_area: undefined,
      max_area: undefined,
    };
    setLocalFilters(resetFilters);
    onReset();
  };

  const hasActiveFilters =
    filters.search ||
    filters.ma_don_vi ||
    filters.ma_loai_dat ||
    filters.ma_trang_thai ||
    filters.min_area ||
    filters.max_area;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm theo số thửa, số tờ bản đồ, địa chỉ..."
            value={localFilters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Quick Filters */}
        <Select
          value={filters.ma_trang_thai || 'all'}
          onValueChange={(value) => handleFilterChange('ma_trang_thai', value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            {options.trangThaiQuyDat.map((item) => (
              <SelectItem key={item.ma_trang_thai} value={item.ma_trang_thai}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.mau_sac }}
                  />
                  {item.ten_trang_thai}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.ma_loai_dat || 'all'}
          onValueChange={(value) => handleFilterChange('ma_loai_dat', value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Loại đất" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
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

        {/* Advanced Filter Button */}
        <Popover open={showAdvanced} onOpenChange={setShowAdvanced}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Bộ lọc nâng cao
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Bộ lọc nâng cao</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Đơn vị hành chính */}
                <div className="space-y-2">
                  <Label>Đơn vị hành chính</Label>
                  <Select
                    value={localFilters.ma_don_vi || 'all'}
                    onValueChange={(value) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        ma_don_vi: value === 'all' ? undefined : value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn đơn vị" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả đơn vị</SelectItem>
                      {options.donViHanhChinh.map((item) => (
                        <SelectItem key={item.ma_don_vi} value={item.ma_don_vi}>
                          {item.ten_don_vi} (Cấp {item.cap_don_vi})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Diện tích */}
                <div className="space-y-2">
                  <Label>Diện tích (m²)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Input
                        type="number"
                        placeholder="Từ"
                        value={localFilters.min_area || ''}
                        onChange={(e) =>
                          setLocalFilters((prev) => ({
                            ...prev,
                            min_area: e.target.value ? parseFloat(e.target.value) : undefined,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        placeholder="Đến"
                        value={localFilters.max_area || ''}
                        onChange={(e) =>
                          setLocalFilters((prev) => ({
                            ...prev,
                            max_area: e.target.value ? parseFloat(e.target.value) : undefined,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAdvanced(false)}
                  >
                    Hủy
                  </Button>
                  <Button size="sm" onClick={handleAdvancedFilter}>
                    Áp dụng
                  </Button>
                </div>
              </CardContent>
            </Card>
          </PopoverContent>
        </Popover>

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <X className="h-4 w-4 mr-2" />
            Xóa bộ lọc
          </Button>
        )}
      </div>

      {/* Filter Summary */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Đang lọc:</span>
          {filters.search && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
              Tìm kiếm: "{filters.search}"
            </span>
          )}
          {filters.ma_don_vi && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
              {options.donViHanhChinh.find((d) => d.ma_don_vi === filters.ma_don_vi)?.ten_don_vi}
            </span>
          )}
          {filters.ma_loai_dat && (
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
              {options.loaiDat.find((l) => l.ma_loai_dat === filters.ma_loai_dat)?.ten_loai_dat}
            </span>
          )}
          {filters.ma_trang_thai && (
            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
              {options.trangThaiQuyDat.find((t) => t.ma_trang_thai === filters.ma_trang_thai)
                ?.ten_trang_thai}
            </span>
          )}
          {(filters.min_area || filters.max_area) && (
            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
              Diện tích: {filters.min_area || 0} - {filters.max_area || '∞'} m²
            </span>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-gray-500">
        Tìm thấy {totalCount.toLocaleString('vi-VN')} kết quả
      </div>
    </div>
  );
}