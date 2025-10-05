import { Address } from './address.interface';

export interface Customer {
  id: number;
  customerCode?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  addresses?: Address[]; // Danh sách địa chỉ chi tiết
  dateOfBirth: Date;
  gender: 'Nam' | 'Nữ' | 'Khác';
  registrationDate: Date;
  totalOrders: number;
  totalSpent: number;
  status: 'Active' | 'Inactive';
  notes?: string;
}

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: Date;
  gender: 'Nam' | 'Nữ' | 'Khác';
  notes?: string;
}
