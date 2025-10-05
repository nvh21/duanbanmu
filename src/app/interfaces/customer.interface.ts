export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
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
