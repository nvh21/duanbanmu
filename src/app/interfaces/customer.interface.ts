import { Address } from './address.interface';

export interface Customer {
  id?: number; // ID khách hàng
  ho_ten: string; // Tên khách hàng (tiếng Việt cho database)
  email: string;
  so_dien_thoai: string; // Số điện thoại (tiếng Việt cho database)
  ngay_sinh: Date | string; // Ngày sinh
  gioi_tinh: boolean; // Giới tính (true = Nam, false = Nữ)
  diem_tich_luy?: number; // Điểm tích lũy
  ngay_tao?: Date | string; // Ngày tạo
  trang_thai?: boolean; // Trạng thái (true = Active, false = Inactive)
  addresses?: Address[]; // Danh sách địa chỉ chi tiết
  // Các trường bổ sung cho hiển thị
  name?: string; // Tên hiển thị (alias cho ho_ten)
  phone?: string; // Số điện thoại hiển thị (alias cho so_dien_thoai)
  dateOfBirth?: Date | string; // Ngày sinh hiển thị (alias cho ngay_sinh)
  gender?: string; // Giới tính hiển thị (Nam/Nữ)
  status?: 'Active' | 'Inactive'; // Trạng thái hiển thị
  registrationDate?: Date | string; // Ngày đăng ký hiển thị
  totalSpent?: number; // Tổng số tiền đã chi
  // Các trường bổ sung cho database
  customerCode?: string; // Mã khách hàng
  address?: string; // Địa chỉ chính
  notes?: string; // Ghi chú
  // Các trường từ backend
  diemTichLuy?: number; // Điểm tích lũy (backend format)
  userId?: number; // User ID
  diaChi?: Address[]; // Địa chỉ (backend format)
}

export interface CustomerFormData {
  ho_ten: string; // Tên khách hàng (tiếng Việt)
  email: string;
  so_dien_thoai: string; // Số điện thoại (tiếng Việt)
  ngay_sinh: Date; // Ngày sinh
  gioi_tinh: boolean; // Giới tính (true = Nam, false = Nữ)
  // Các trường bổ sung cho form
  name?: string; // Tên hiển thị
  phone?: string; // Số điện thoại hiển thị
  dateOfBirth?: Date; // Ngày sinh hiển thị
  gender?: string; // Giới tính hiển thị
}

// Interface để gửi dữ liệu đến backend
export interface CustomerRequestData {
  ho_ten: string; // Tên khách hàng
  email: string;
  so_dien_thoai: string; // Số điện thoại
  ngay_sinh: Date | string; // Ngày sinh
  gioi_tinh: boolean; // Giới tính (true = Nam, false = Nữ)
  trang_thai?: boolean; // Trạng thái (true = Active, false = Inactive)
  customerCode?: string; // Mã khách hàng
  // Các trường bổ sung cho authentication
  username?: string;
  password?: string;
}
