export interface Address {
  id?: number; // Optional vì khi tạo mới chưa có ID
  dia_chi?: string; // Địa chỉ đầy đủ (tiếng Việt cho database)
  specificAddress?: string; // Địa chỉ chi tiết (tiếng Anh cho form)
  province?: string;
  district?: string;
  ward?: string;
  mac_dinh?: boolean; // Mặc định (tiếng Việt cho database)
  isDefault?: boolean; // Mặc định (tiếng Anh cho form)
  createdAt?: Date | string; // Optional, có thể tự tạo
  updatedAt?: Date | string; // Optional, có thể tự tạo
  customerId?: number; // Thêm để liên kết với customer
  // Các trường từ backend
  tenDiaChi?: string; // Tên địa chỉ
  thanhPho?: string; // Thành phố
  quan?: string; // Quận
  phuong?: string; // Phường
  diaChiCuThe?: string; // Địa chỉ cụ thể
  macDinh?: boolean; // Mặc định (backend format)
  soDienThoai?: string; // Số điện thoại
  tenNguoiNhan?: string; // Tên người nhận
}

export interface AddressFormData {
  specificAddress: string;
  province: string;
  district: string;
  ward: string;
  isDefault: boolean;
}

export interface Province {
  id: string;
  name: string;
}

export interface District {
  id: string;
  name: string;
  provinceId: string;
}

export interface Ward {
  id: string;
  name: string;
  districtId: string;
}

