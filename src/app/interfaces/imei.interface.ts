export interface Imei {
  id: number;
  soImei: string;
  sanPhamId: number;
  sanPhamTen?: string;
  sanPhamMa?: string;
  trangThai: boolean;
  ngayTao: Date;
  ngayCapNhat: Date;
}

export interface ImeiRequest {
  soImei: string;
  sanPhamId: number;
  trangThai?: boolean;
}

export interface ImeiResponse {
  id: number;
  soImei: string;
  sanPhamId: number;
  sanPhamTen: string;
  sanPhamMa: string;
  trangThai: boolean;
  ngayTao: Date;
  ngayCapNhat: Date;
}

export interface ImeiValidationResult {
  isValid: boolean;
  message: string;
  imei: string;
}

export interface ImeiImportResult {
  success: ImeiResponse[];
  failed: ImeiValidationResult[];
  total: number;
  successCount: number;
  failedCount: number;
}
