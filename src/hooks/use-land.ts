// src/hooks/use-land.ts
import { useState, useEffect, useCallback } from 'react';
import {
  ThuaDat,
  LandFilterOptions,
  CreateThuaDatData,
  LandManagementOptions,
  PaginatedResponse
} from '@/types/land';

export function useLandList(initialFilters: LandFilterOptions = {}) {
  const [data, setData] = useState<ThuaDat[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<LandFilterOptions>(initialFilters);

  const fetchLandList = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/admin/thua-dat?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Không thể tải danh sách thửa đất');
      }

      const result: PaginatedResponse<ThuaDat> = await response.json();
      setData(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLandList();
  }, [fetchLandList]);

  const updateFilters = (newFilters: Partial<LandFilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const changePage = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const refresh = () => {
    fetchLandList();
  };

  return {
    data,
    pagination,
    loading,
    error,
    filters,
    updateFilters,
    changePage,
    refresh
  };
}

export function useLandOptions() {
  const [options, setOptions] = useState<LandManagementOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch('/api/admin/thua-dat/options');
        
        if (!response.ok) {
          throw new Error('Không thể tải tùy chọn');
        }

        const data = await response.json();
        setOptions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  return { options, loading, error };
}

export function useLandMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createLand = async (data: CreateThuaDatData): Promise<ThuaDat> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/thua-dat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Không thể tạo thửa đất');
      }

      const result = await response.json();
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateLand = async (id: string, data: Partial<CreateThuaDatData>): Promise<ThuaDat> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/thua-dat/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Không thể cập nhật thửa đất');
      }

      const result = await response.json();
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteLand = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/thua-dat/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Không thể xóa thửa đất');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    createLand,
    updateLand,
    deleteLand,
    loading,
    error
  };
}