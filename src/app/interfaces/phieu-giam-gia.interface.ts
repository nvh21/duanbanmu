export interface PhieuGiamGia {
  id?: number;
  maPhieu: string;
  tenPhieuGiamGia: string;
  loaiPhieuGiamGia: boolean; // false = phần trăm, true = tiền mặt
  giaTriGiam: number;
  giaTriToiThieu: number;
  soTienToiDa: number;
  hoaDonToiThieu: number;
  soLuongDung: number;
  ngayBatDau: string;
  ngayKetThuc: string;
  trangThai: boolean;
}

export interface PhieuGiamGiaRequest {
  maPhieu: string;
  tenPhieuGiamGia: string;
  loaiPhieuGiamGia: boolean;
  giaTriGiam: number;
  giaTriToiThieu: number;
  soTienToiDa: number;
  hoaDonToiThieu: number;
  soLuongDung: number;
  ngayBatDau: string;
  ngayKetThuc: string;
  trangThai: boolean;
}

export interface PhieuGiamGiaResponse {
  id: number;
  maPhieu: string;
  tenPhieuGiamGia: string;
  loaiPhieuGiamGia: boolean;
  loaiPhieuGiamGiaText: string;
  giaTriGiam: number;
  giaTriToiThieu: number;
  soTienToiDa: number;
  hoaDonToiThieu: number;
  soLuongDung: number;
  ngayBatDau: string;
  ngayKetThuc: string;
  trangThai: boolean;
  trangThaiText: string;
  isActive: boolean;
  isExpired: boolean;
  isNotStarted: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface KhachHang {
  id: number;
  maKhachHang: string;
  tenKhachHang: string;
  gioiTinh: boolean; // false = nữ, true = nam
  ngaySinh: string;
  tongSoLanMua: number;
  lanMuaGanNhat: string;
}

export interface KhachHangResponse {
  success: boolean;
  message: string;
  data: KhachHang[];
}
