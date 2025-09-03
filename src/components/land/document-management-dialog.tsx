// src/components/land/document-management-dialog.tsx
'use client';

import { useState } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import {
  FileText,
  Upload,
  Download,
  Eye,
  Trash2,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Paperclip,
  Image,
  FileSpreadsheet,
  File // Thay FilePdf bằng File
} from 'lucide-react';
import { ThuaDat } from '@/types/land';
import { toast } from 'sonner';

interface DocumentManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  landData: ThuaDat | null;
}

interface Document {
  ma_tai_lieu: number;
  ten_tai_lieu: string;
  loai_tai_lieu: string;
  kich_thuoc_file: number;
  duong_dan_file: string;
  mo_ta?: string;
  trang_thai_duyet: 'pending' | 'approved' | 'rejected';
  ngay_upload: Date;
  nguoi_upload: {
    ho_ten: string;
  };
  nguoi_duyet?: {
    ho_ten: string;
  };
  ngay_duyet?: Date;
}

// Mock data for demonstration
const mockDocuments: Document[] = [
  {
    ma_tai_lieu: 1,
    ten_tai_lieu: 'Giấy chứng nhận quyền sử dụng đất.pdf',
    loai_tai_lieu: 'certificate',
    kich_thuoc_file: 2456789,
    duong_dan_file: '/documents/cert_001.pdf',
    mo_ta: 'Giấy chứng nhận quyền sử dụng đất số 123456',
    trang_thai_duyet: 'approved',
    ngay_upload: new Date('2024-01-15'),
    nguoi_upload: { ho_ten: 'Nguyễn Văn A' },
    nguoi_duyet: { ho_ten: 'Admin System' },
    ngay_duyet: new Date('2024-01-16')
  },
  {
    ma_tai_lieu: 2,
    ten_tai_lieu: 'Bản đồ địa chính.dwg',
    loai_tai_lieu: 'map',
    kich_thuoc_file: 8921345,
    duong_dan_file: '/documents/map_001.dwg',
    mo_ta: 'Bản đồ địa chính tỷ lệ 1:500',
    trang_thai_duyet: 'pending',
    ngay_upload: new Date('2024-02-01'),
    nguoi_upload: { ho_ten: 'Trần Thị B' }
  },
  {
    ma_tai_lieu: 3,
    ten_tai_lieu: 'Báo cáo thẩm định giá.xlsx',
    loai_tai_lieu: 'valuation',
    kich_thuoc_file: 1234567,
    duong_dan_file: '/documents/valuation_001.xlsx',
    mo_ta: 'Báo cáo thẩm định giá đất năm 2024',
    trang_thai_duyet: 'rejected',
    ngay_upload: new Date('2024-01-20'),
    nguoi_upload: { ho_ten: 'Lê Văn C' },
    nguoi_duyet: { ho_ten: 'Admin System' },
    ngay_duyet: new Date('2024-01-22')
  }
];

const documentTypes = [
  { value: 'certificate', label: 'Giấy chứng nhận', icon: FileText },
  { value: 'map', label: 'Bản đồ', icon: Image },
  { value: 'valuation', label: 'Thẩm định giá', icon: FileSpreadsheet },
  { value: 'survey', label: 'Khảo sát', icon: File },
  { value: 'contract', label: 'Hợp đồng', icon: FileText },
  { value: 'other', label: 'Khác', icon: Paperclip }
];

export function DocumentManagementDialog({
  open,
  onOpenChange,
  landData
}: DocumentManagementDialogProps) {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [deleteDocument, setDeleteDocument] = useState<Document | null>(null);
  const [uploadForm, setUploadForm] = useState({
    ten_tai_lieu: '',
    loai_tai_lieu: '',
    mo_ta: '',
    file: null as File | null
  });

  if (!landData) return null;

  const getStatusBadge = (status: Document['trang_thai_duyet']) => {
    const config = {
      pending: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      approved: { label: 'Đã duyệt', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { label: 'Bị từ chối', color: 'bg-red-100 text-red-800', icon: XCircle }
    };
    
    const { label, color, icon: Icon } = config[status];
    
    return (
      <Badge className={`${color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <File className="h-4 w-4 text-red-500" />;
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="h-4 w-4 text-green-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <Image className="h-4 w-4 text-blue-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadForm(prev => ({ ...prev, file, ten_tai_lieu: file.name }));
    }
  };

  const handleUploadSubmit = () => {
    if (!uploadForm.file || !uploadForm.loai_tai_lieu) {
      toast.error('Vui lòng chọn file và loại tài liệu');
      return;
    }

    // Mock upload - in real implementation, this would call an API
    const newDocument: Document = {
      ma_tai_lieu: documents.length + 1,
      ten_tai_lieu: uploadForm.ten_tai_lieu,
      loai_tai_lieu: uploadForm.loai_tai_lieu,
      kich_thuoc_file: uploadForm.file.size,
      duong_dan_file: `/documents/${uploadForm.file.name}`,
      mo_ta: uploadForm.mo_ta,
      trang_thai_duyet: 'pending',
      ngay_upload: new Date(),
      nguoi_upload: { ho_ten: 'Current User' }
    };

    setDocuments(prev => [...prev, newDocument]);
    setShowUploadForm(false);
    setUploadForm({
      ten_tai_lieu: '',
      loai_tai_lieu: '',
      mo_ta: '',
      file: null
    });
    toast.success('Tải lên tài liệu thành công');
  };

  const handleDeleteDocument = () => {
    if (!deleteDocument) return;
    
    setDocuments(prev => prev.filter(doc => doc.ma_tai_lieu !== deleteDocument.ma_tai_lieu));
    setDeleteDocument(null);
    toast.success('Xóa tài liệu thành công');
  };

  const handleApproveDocument = (doc: Document) => {
    setDocuments(prev => prev.map(d => 
      d.ma_tai_lieu === doc.ma_tai_lieu 
        ? { ...d, trang_thai_duyet: 'approved' as const, ngay_duyet: new Date(), nguoi_duyet: { ho_ten: 'Admin System' } }
        : d
    ));
    toast.success('Duyệt tài liệu thành công');
  };

  const handleRejectDocument = (doc: Document) => {
    setDocuments(prev => prev.map(d => 
      d.ma_tai_lieu === doc.ma_tai_lieu 
        ? { ...d, trang_thai_duyet: 'rejected' as const, ngay_duyet: new Date(), nguoi_duyet: { ho_ten: 'Admin System' } }
        : d
    ));
    toast.success('Từ chối tài liệu thành công');
  };

  const filteredDocuments = {
    all: documents,
    pending: documents.filter(doc => doc.trang_thai_duyet === 'pending'),
    approved: documents.filter(doc => doc.trang_thai_duyet === 'approved'),
    rejected: documents.filter(doc => doc.trang_thai_duyet === 'rejected')
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Quản lý tài liệu - {landData.ma_thua_dat}
            </DialogTitle>
            <DialogDescription>
              Quản lý tài liệu và chứng từ liên quan đến thửa đất
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{documents.length}</div>
                  <div className="text-sm text-gray-600">Tổng tài liệu</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{filteredDocuments.approved.length}</div>
                  <div className="text-sm text-gray-600">Đã duyệt</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{filteredDocuments.pending.length}</div>
                  <div className="text-sm text-gray-600">Chờ duyệt</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{filteredDocuments.rejected.length}</div>
                  <div className="text-sm text-gray-600">Bị từ chối</div>
                </CardContent>
              </Card>
            </div>

            {/* Action Bar */}
            <div className="flex justify-between items-center">
              <div className="text-lg font-semibold">Danh sách tài liệu</div>
              <Button onClick={() => setShowUploadForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Tải lên tài liệu
              </Button>
            </div>

            {/* Document Tabs */}
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">
                  Tất cả ({documents.length})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Chờ duyệt ({filteredDocuments.pending.length})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Đã duyệt ({filteredDocuments.approved.length})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Từ chối ({filteredDocuments.rejected.length})
                </TabsTrigger>
              </TabsList>

              {Object.entries(filteredDocuments).map(([key, docs]) => (
                <TabsContent key={key} value={key} className="space-y-4">
                  {docs.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <div className="text-gray-500">Không có tài liệu nào</div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-4">
                      {docs.map((doc) => (
                        <Card key={doc.ma_tai_lieu}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3 flex-1">
                                {getFileIcon(doc.ten_tai_lieu)}
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className="font-medium truncate">{doc.ten_tai_lieu}</div>
                                    {getStatusBadge(doc.trang_thai_duyet)}
                                  </div>
                                  
                                  <div className="text-sm text-gray-600 mb-2">
                                    {documentTypes.find(t => t.value === doc.loai_tai_lieu)?.label} • {' '}
                                    {formatFileSize(doc.kich_thuoc_file)} • {' '}
                                    {doc.ngay_upload.toLocaleDateString('vi-VN')}
                                  </div>
                                  
                                  {doc.mo_ta && (
                                    <div className="text-sm text-gray-500 mb-2">{doc.mo_ta}</div>
                                  )}
                                  
                                  <div className="text-xs text-gray-400">
                                    Tải lên bởi: {doc.nguoi_upload.ho_ten}
                                    {doc.nguoi_duyet && (
                                      <> • Duyệt bởi: {doc.nguoi_duyet.ho_ten} ({doc.ngay_duyet?.toLocaleDateString('vi-VN')})</>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 ml-4">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                                
                                {doc.trang_thai_duyet === 'pending' && (
                                  <>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleApproveDocument(doc)}
                                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleRejectDocument(doc)}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <XCircle className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                                
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setDeleteDocument(doc)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload Form Dialog */}
      <Dialog open={showUploadForm} onOpenChange={setShowUploadForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tải lên tài liệu mới</DialogTitle>
            <DialogDescription>
              Tải lên tài liệu liên quan đến thửa đất {landData.ma_thua_dat}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="file">Chọn file *</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.dwg"
                />
                <div className="text-xs text-gray-500">
                  Chấp nhận: PDF, DOC, XLS, IMG, DWG. Tối đa 10MB
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Loại tài liệu *</Label>
                <Select value={uploadForm.loai_tai_lieu} onValueChange={(value) => 
                  setUploadForm(prev => ({ ...prev, loai_tai_lieu: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại tài liệu" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ten_tai_lieu">Tên tài liệu</Label>
              <Input
                id="ten_tai_lieu"
                value={uploadForm.ten_tai_lieu}
                onChange={(e) => setUploadForm(prev => ({ ...prev, ten_tai_lieu: e.target.value }))}
                placeholder="Tên hiển thị của tài liệu"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mo_ta">Mô tả</Label>
              <Textarea
                id="mo_ta"
                value={uploadForm.mo_ta}
                onChange={(e) => setUploadForm(prev => ({ ...prev, mo_ta: e.target.value }))}
                placeholder="Mô tả chi tiết về tài liệu"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowUploadForm(false)}>
                Hủy
              </Button>
              <Button onClick={handleUploadSubmit}>
                <Upload className="h-4 w-4 mr-2" />
                Tải lên
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteDocument} onOpenChange={() => setDeleteDocument(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa tài liệu</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa tài liệu "{deleteDocument?.ten_tai_lieu}" không?
              <br />
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDocument}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}