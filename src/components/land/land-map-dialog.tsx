// src/components/land/land-map-dialog.tsx
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Satellite, 
  Map, 
  Layers, 
  Navigation, 
  Maximize,
  Download,
  Share
} from 'lucide-react';
import { ThuaDat } from '@/types/land';

interface LandMapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: ThuaDat | null;
}

export function LandMapDialog({
  open,
  onOpenChange,
  data
}: LandMapDialogProps) {
  const [mapType, setMapType] = useState<'street' | 'satellite' | 'hybrid'>('street');
  const [showLayers, setShowLayers] = useState({
    boundaries: true,
    roads: true,
    labels: true,
    contours: false,
  });

  if (!data) return null;

  // Mock coordinates - in real implementation, these would come from the database
  const mockCoordinates = {
    center: [105.8542, 21.0285], // Hanoi coordinates as example
    bounds: [
      [105.8532, 21.0275],
      [105.8552, 21.0295]
    ]
  };

  const handleExportMap = () => {
    // Implement map export functionality
    console.log('Export map for:', data.ma_thua_dat);
  };

  const handleShareLocation = () => {
    // Implement share functionality
    const shareUrl = `${window.location.origin}/land/${data.ma_thua_dat}`;
    navigator.clipboard.writeText(shareUrl);
  };

  const handleNavigate = () => {
    // Open in external map app
    const url = `https://maps.google.com/?q=${mockCoordinates.center[1]},${mockCoordinates.center[0]}`;
    window.open(url, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Vị trí thửa đất {data.ma_thua_dat}
          </DialogTitle>
          <DialogDescription>
            Xem vị trí và ranh giới thửa đất trên bản đồ
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map Controls */}
          <div className="lg:col-span-1 space-y-4">
            {/* Land Info Card */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-gray-600">Thửa đất</div>
                    <div className="font-semibold">
                      Số {data.so_thua}, Tờ {data.so_to_ban_do}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-600">Diện tích</div>
                    <div className="font-semibold text-blue-600">
                      {data.dien_tich_phap_ly.toLocaleString('vi-VN')} m²
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-600">Đơn vị</div>
                    <div className="text-sm">{data.don_vi_hanh_chinh.ten_don_vi}</div>
                  </div>
                  
                  <div>
                    <Badge 
                      variant="outline" 
                      className="flex items-center gap-1 w-fit"
                      style={{ 
                        borderColor: data.trang_thai_quy_dat.mau_sac,
                        color: data.trang_thai_quy_dat.mau_sac 
                      }}
                    >
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: data.trang_thai_quy_dat.mau_sac }}
                      />
                      {data.trang_thai_quy_dat.ten_trang_thai}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map Type Controls */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="text-sm font-medium">Loại bản đồ</div>
                  <Tabs value={mapType} onValueChange={(value: any) => setMapType(value)}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="street" className="text-xs">
                        <Map className="h-3 w-3 mr-1" />
                        Đường
                      </TabsTrigger>
                      <TabsTrigger value="satellite" className="text-xs">
                        <Satellite className="h-3 w-3 mr-1" />
                        Vệ tinh
                      </TabsTrigger>
                      <TabsTrigger value="hybrid" className="text-xs">
                        <Layers className="h-3 w-3 mr-1" />
                        Kết hợp
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardContent>
            </Card>

            {/* Layer Controls */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="text-sm font-medium">Lớp hiển thị</div>
                  <div className="space-y-2">
                    {Object.entries(showLayers).map(([key, value]) => (
                      <label key={key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setShowLayers(prev => ({
                            ...prev,
                            [key]: e.target.checked
                          }))}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">
                          {key === 'boundaries' && 'Ranh giới'}
                          {key === 'roads' && 'Đường xá'}
                          {key === 'labels' && 'Nhãn địa danh'}
                          {key === 'contours' && 'Đường đồng mức'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start text-sm"
                onClick={handleNavigate}
              >
                <Navigation className="h-4 w-4 mr-2" />
                Dẫn đường
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start text-sm"
                onClick={handleShareLocation}
              >
                <Share className="h-4 w-4 mr-2" />
                Chia sẻ vị trí
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start text-sm"
                onClick={handleExportMap}
              >
                <Download className="h-4 w-4 mr-2" />
                Xuất bản đồ
              </Button>
            </div>

            {/* Coordinates Info */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-600">Tọa độ trung tâm</div>
                  <div className="font-mono text-xs bg-gray-50 p-2 rounded">
                    {mockCoordinates.center[1]}, {mockCoordinates.center[0]}
                  </div>
                  <div className="text-xs text-gray-500">
                    WGS84 (EPSG:4326)
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map Display */}
          <div className="lg:col-span-3">
            <Card className="h-[600px]">
              <CardContent className="p-0 h-full">
                <div className="relative h-full bg-gradient-to-br from-green-50 to-blue-50 rounded-lg overflow-hidden">
                  {/* Mock Map Display */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-32 h-32 bg-green-200 rounded-full flex items-center justify-center mx-auto relative">
                        {/* Mock land plot */}
                        <div 
                          className="w-20 h-16 border-4 border-red-500 bg-red-100 rounded"
                          style={{ 
                            transform: 'rotate(15deg)',
                            borderColor: data.trang_thai_quy_dat.mau_sac,
                            backgroundColor: `${data.trang_thai_quy_dat.mau_sac}20`
                          }}
                        />
                        
                        {/* Mock surrounding plots */}
                        <div className="absolute -top-2 -left-2 w-16 h-12 border-2 border-gray-400 bg-gray-100 rounded opacity-50" />
                        <div className="absolute -bottom-2 -right-2 w-18 h-14 border-2 border-gray-400 bg-gray-100 rounded opacity-50" />
                        <div className="absolute top-6 -right-4 w-12 h-16 border-2 border-gray-400 bg-gray-100 rounded opacity-50" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="font-semibold text-lg">
                          Thửa đất {data.so_thua}
                        </div>
                        <div className="text-sm text-gray-600">
                          {data.dien_tich_phap_ly.toLocaleString('vi-VN')} m²
                        </div>
                        <div className="text-xs text-gray-500">
                          Bản đồ mô phỏng - Tích hợp bản đồ thực tế đang phát triển
                        </div>
                      </div>
                      
                      {/* Mock scale and compass */}
                      <div className="absolute bottom-4 left-4 text-xs text-gray-500">
                        <div className="bg-white bg-opacity-80 p-2 rounded">
                          Tỷ lệ 1:1000
                        </div>
                      </div>
                      
                      <div className="absolute top-4 right-4">
                        <div className="bg-white bg-opacity-80 p-2 rounded-full">
                          <Navigation className="h-4 w-4 text-gray-600" style={{ transform: 'rotate(0deg)' }} />
                        </div>
                      </div>
                      
                      {/* Mock legend */}
                      <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 p-3 rounded text-left">
                        <div className="text-xs font-medium mb-2">Chú giải</div>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 border-2 rounded" 
                              style={{ 
                                borderColor: data.trang_thai_quy_dat.mau_sac,
                                backgroundColor: `${data.trang_thai_quy_dat.mau_sac}40`
                              }}
                            />
                            <span>Thửa đất hiện tại</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 border-2 border-gray-400 bg-gray-100 rounded" />
                            <span>Thửa đất lân cận</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Map controls overlay */}
                  <div className="absolute top-4 left-4 space-y-2">
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Thông tin vị trí</div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>• Khoảng cách đến trung tâm: ~12.5 km</div>
                      <div>• Khoảng cách đến đường chính: ~250 m</div>
                      <div>• Độ cao trung bình: ~15 m</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Thông tin kỹ thuật</div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>• Hệ tọa độ: VN2000 / UTM Zone 48N</div>
                      <div>• Độ chính xác: ±0.5 m</div>
                      <div>• Cập nhật: {new Date().toLocaleDateString('vi-VN')}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}