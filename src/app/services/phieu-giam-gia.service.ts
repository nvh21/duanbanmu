import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

const API_BASE_URL = 'http://localhost:8080';

export interface PhieuGiamGiaRequest {
  maPhieu: string;
  tenPhieu: string;
  moTa?: string;
  ngayBatDau: string;
  ngayKetThuc: string;
  giaTriGiam: number;
  giaTriToiThieu: number;
  soLuong: number;
  loaiGiamGia: 'PHAN_TRAM' | 'TIEN_MAT';
  trangThai?: boolean;
}

export interface PhieuGiamGiaResponse {
  id: number;
  maPhieu: string;
  tenPhieu: string;
  moTa?: string;
  ngayBatDau: string;
  ngayKetThuc: string;
  giaTriGiam: number;
  giaTriToiThieu: number;
  soLuong: number;
  loaiGiamGia: 'PHAN_TRAM' | 'TIEN_MAT';
  trangThai: boolean;
  trangThaiText: string;
  loaiGiamGiaText: string;
}

export interface PhieuGiamGiaSearchParams {
  keyword?: string;
  trangThai?: boolean;
  loaiGiamGia?: 'PHAN_TRAM' | 'TIEN_MAT';
  page?: number;
  size?: number;
  sort?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PhieuGiamGiaService {
  constructor(private apiService: ApiService) {}

  // Tạo phiếu giảm giá mới
  createPhieuGiamGia(request: PhieuGiamGiaRequest): Observable<PhieuGiamGiaResponse> {
    return this.apiService.post<PhieuGiamGiaResponse>(`${API_BASE_URL}/api/phieu-giam-gia`, request);
  }

  // Cập nhật phiếu giảm giá
  updatePhieuGiamGia(id: number, request: PhieuGiamGiaRequest): Observable<PhieuGiamGiaResponse> {
    return this.apiService.put<PhieuGiamGiaResponse>(`${API_BASE_URL}/api/phieu-giam-gia/${id}`, request);
  }

  // Xóa phiếu giảm giá
  deletePhieuGiamGia(id: number): Observable<void> {
    return this.apiService.delete<void>(`${API_BASE_URL}/api/phieu-giam-gia/${id}`);
  }

  // Lấy phiếu giảm giá theo ID
  getPhieuGiamGiaById(id: number): Observable<PhieuGiamGiaResponse> {
    return this.apiService.get<PhieuGiamGiaResponse>(`${API_BASE_URL}/api/phieu-giam-gia/${id}`);
  }

  // Lấy phiếu giảm giá theo mã phiếu
  getPhieuGiamGiaByMaPhieu(maPhieu: string): Observable<PhieuGiamGiaResponse> {
    return this.apiService.get<PhieuGiamGiaResponse>(`${API_BASE_URL}/api/phieu-giam-gia/ma/${maPhieu}`);
  }

  // Tìm kiếm phiếu giảm giá với phân trang
  searchPhieuGiamGia(params: PhieuGiamGiaSearchParams): Observable<any> {
    const queryParams = new URLSearchParams();
    
    if (params.keyword) queryParams.append('keyword', params.keyword);
    if (params.trangThai !== undefined) queryParams.append('trangThai', params.trangThai.toString());
    if (params.loaiGiamGia) queryParams.append('loaiGiamGia', params.loaiGiamGia);
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.sort) queryParams.append('sort', params.sort);

    const queryString = queryParams.toString();
    const url = queryString ? `${API_BASE_URL}/api/phieu-giam-gia?${queryString}` : `${API_BASE_URL}/api/phieu-giam-gia`;
    
    return this.apiService.get<any>(url);
  }

  // Lấy tất cả phiếu giảm giá đang hoạt động
  getAllActivePhieuGiamGia(): Observable<PhieuGiamGiaResponse[]> {
    return this.apiService.get<PhieuGiamGiaResponse[]>(`${API_BASE_URL}/api/phieu-giam-gia/active`);
  }

  // Lấy phiếu giảm giá đã hết hạn
  getExpiredPhieuGiamGia(): Observable<PhieuGiamGiaResponse[]> {
    return this.apiService.get<PhieuGiamGiaResponse[]>(`${API_BASE_URL}/api/phieu-giam-gia/expired`);
  }

  // Lấy phiếu giảm giá sắp diễn ra
  getUpcomingPhieuGiamGia(): Observable<PhieuGiamGiaResponse[]> {
    return this.apiService.get<PhieuGiamGiaResponse[]>(`${API_BASE_URL}/api/phieu-giam-gia/upcoming`);
  }

  // Toggle trạng thái phiếu giảm giá
  togglePhieuGiamGiaStatus(id: number): Observable<PhieuGiamGiaResponse> {
    return this.apiService.put<PhieuGiamGiaResponse>(`${API_BASE_URL}/api/phieu-giam-gia/${id}/toggle-status`, {});
  }

  // Tạo dữ liệu mẫu
  createSampleData(): Observable<string> {
    return this.apiService.post<string>(`${API_BASE_URL}/api/phieu-giam-gia/create-sample-data`, {});
  }

  // Test API
  testApi(): Observable<string> {
    return this.apiService.get<string>(`${API_BASE_URL}/api/phieu-giam-gia/test`);
  }
}
