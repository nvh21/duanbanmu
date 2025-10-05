export interface Address {
  id: number;
  specificAddress: string;
  province: string;
  district: string;
  ward: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
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

