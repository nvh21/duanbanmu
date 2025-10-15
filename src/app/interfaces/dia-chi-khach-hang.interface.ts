export interface DiaChiKhachHang {
  id?: number;
  tenNguoiNhan?: string;
  soDienThoai?: string;
  diaChiChiTiet: string;
  tinhThanh: string;
  quanHuyen: string;
  phuongXa: string;
  macDinh: boolean;
  trangThai: boolean;
  ngayTao?: string;
  ngayCapNhat?: string;
  khachHangId: number;
}

export interface DiaChiKhachHangFormData {
  tenNguoiNhan?: string;
  soDienThoai?: string;
  diaChiChiTiet: string;
  tinhThanh: string;
  quanHuyen: string;
  phuongXa: string;
  macDinh: boolean;
  trangThai: boolean;
}

// Utility functions
export function getTrangThaiDiaChiText(trangThai: boolean | undefined): string {
  return trangThai ? 'Hoạt động' : 'Không hoạt động';
}

export function getMacDinhText(macDinh: boolean | undefined): string {
  return macDinh ? 'Mặc định' : 'Không mặc định';
}

export function formatDiaChiFull(diaChi: DiaChiKhachHang): string {
  return `${diaChi.diaChiChiTiet}, ${diaChi.phuongXa}, ${diaChi.quanHuyen}, ${diaChi.tinhThanh}`;
}
