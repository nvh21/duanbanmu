import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface HoaDonDTO {
  id?: number;
  maHoaDon: string;
  khachHangId: number;
  tenKhachHang: string;
  emailKhachHang: string;
  soDienThoaiKhachHang: string;
  nhanVienId: number;
  tenNhanVien: string;
  tongTien: number;
  thanhTien: number;
  tienGiamGia?: number;
  trangThai: string;
  ngayTao: string;
  ngayCapNhat?: string;
}

export interface TrangThaiHoaDon {
  CHO_XAC_NHAN: 'CHỜ_XÁC_NHẬN';
  DA_XAC_NHAN: 'ĐÃ_XÁC_NHẬN';
  DANG_GIAO: 'ĐANG_GIAO';
  DA_GIAO: 'ĐÃ_GIAO';
  DA_HUY: 'ĐÃ_HỦY';
  HOAN_TRA: 'HOÀN_TRẢ';
}

@Injectable({
  providedIn: 'root'
})
export class HoaDonService {
  constructor(private apiService: ApiService) {}

  // Lấy tất cả hóa đơn
  getAllHoaDon(): Observable<HoaDonDTO[]> {
    return this.apiService.get<HoaDonDTO[]>('/api/hoa-don');
  }

  // Lấy hóa đơn theo ID
  getHoaDonById(id: number): Observable<HoaDonDTO> {
    return this.apiService.get<HoaDonDTO>(`/api/hoa-don/${id}`);
  }

  // Lấy hóa đơn theo mã hóa đơn
  getHoaDonByMa(maHoaDon: string): Observable<HoaDonDTO> {
    return this.apiService.get<HoaDonDTO>(`/api/hoa-don/ma/${maHoaDon}`);
  }

  // Lấy hóa đơn theo trạng thái
  getHoaDonByTrangThai(trangThai: string): Observable<HoaDonDTO[]> {
    return this.apiService.get<HoaDonDTO[]>(`/api/hoa-don/trang-thai/${trangThai}`);
  }

  // Lấy hóa đơn theo khách hàng
  getHoaDonByKhachHang(khachHangId: number): Observable<HoaDonDTO[]> {
    return this.apiService.get<HoaDonDTO[]>(`/api/hoa-don/khach-hang/${khachHangId}`);
  }

  // Lấy hóa đơn theo nhân viên
  getHoaDonByNhanVien(nhanVienId: number): Observable<HoaDonDTO[]> {
    return this.apiService.get<HoaDonDTO[]>(`/api/hoa-don/nhan-vien/${nhanVienId}`);
  }

  // Lấy hóa đơn theo khoảng thời gian
  getHoaDonByDateRange(startDate: string, endDate: string): Observable<HoaDonDTO[]> {
    return this.apiService.get<HoaDonDTO[]>(`/api/hoa-don/date-range?startDate=${startDate}&endDate=${endDate}`);
  }

  // Tạo hóa đơn mới
  createHoaDon(hoaDonDTO: HoaDonDTO): Observable<HoaDonDTO> {
    return this.apiService.post<HoaDonDTO>('/api/hoa-don', hoaDonDTO);
  }

  // Cập nhật hóa đơn
  updateHoaDon(id: number, hoaDonDTO: HoaDonDTO): Observable<HoaDonDTO> {
    return this.apiService.put<HoaDonDTO>(`/api/hoa-don/${id}`, hoaDonDTO);
  }

  // Xóa hóa đơn
  deleteHoaDon(id: number): Observable<void> {
    return this.apiService.delete<void>(`/api/hoa-don/${id}`);
  }

  // Cập nhật trạng thái hóa đơn
  updateTrangThaiHoaDon(id: number, trangThai: string): Observable<HoaDonDTO> {
    return this.apiService.put<HoaDonDTO>(`/api/hoa-don/${id}/trang-thai?trangThai=${trangThai}`, {});
  }

  // Tạo dữ liệu mẫu
  createSampleData(): Observable<string> {
    return this.apiService.post<string>('/api/hoa-don/create-sample-data', {});
  }

  // Tạo khách hàng và nhân viên mẫu
  createSampleCustomers(): Observable<string> {
    return this.apiService.post<string>('/api/hoa-don/create-sample-customers', {});
  }

  // Test API
  testApi(): Observable<string> {
    return this.apiService.get<string>('/api/hoa-don/test');
  }
}
