import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Manufacturer {
  id: number;
  code: string;
  name: string;
  country: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface HelmetProduct {
  id: number;
  image: string;
  code: string;
  name: string;
  manufacturerId: number;
  manufacturerName: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  status: string;
  description: string;
  specifications: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductDetail {
  id: number;
  productId: number;
  productName: string;
  category: string;
  material: string;
  weight: number;
  dimensions: string;
  safetyStandards: string[];
  features: string[];
  warranty: string;
  careInstructions: string;
  compatibility: string[];
  colors: string[];
  sizes: string[];
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private manufacturersSubject = new BehaviorSubject<Manufacturer[]>(
    this.getInitialManufacturers()
  );
  private helmetProductsSubject = new BehaviorSubject<HelmetProduct[]>(
    this.getInitialHelmetProducts()
  );
  private productDetailsSubject = new BehaviorSubject<ProductDetail[]>(
    this.getInitialProductDetails()
  );

  public manufacturers$ = this.manufacturersSubject.asObservable();
  public helmetProducts$ = this.helmetProductsSubject.asObservable();
  public productDetails$ = this.productDetailsSubject.asObservable();

  // Manufacturers
  getManufacturers(): Observable<Manufacturer[]> {
    return this.manufacturers$;
  }

  addManufacturer(manufacturer: Manufacturer): void {
    const current = this.manufacturersSubject.value;
    manufacturer.id = Math.max(...current.map((m) => m.id), 0) + 1;
    manufacturer.createdAt = new Date();
    manufacturer.updatedAt = new Date();
    this.manufacturersSubject.next([...current, manufacturer]);
  }

  updateManufacturer(id: number, manufacturer: Manufacturer): void {
    const current = this.manufacturersSubject.value;
    const index = current.findIndex((m) => m.id === id);
    if (index !== -1) {
      manufacturer.updatedAt = new Date();
      current[index] = manufacturer;
      this.manufacturersSubject.next([...current]);
    }
  }

  deleteManufacturer(id: number): void {
    const current = this.manufacturersSubject.value;
    this.manufacturersSubject.next(current.filter((m) => m.id !== id));
  }

  // Helmet Products
  getHelmetProducts(): Observable<HelmetProduct[]> {
    return this.helmetProducts$;
  }

  addHelmetProduct(product: HelmetProduct): void {
    const current = this.helmetProductsSubject.value;
    product.id = Math.max(...current.map((p) => p.id), 0) + 1;
    product.createdAt = new Date();
    product.updatedAt = new Date();
    this.helmetProductsSubject.next([...current, product]);
  }

  updateHelmetProduct(id: number, product: HelmetProduct): void {
    const current = this.helmetProductsSubject.value;
    const index = current.findIndex((p) => p.id === id);
    if (index !== -1) {
      product.updatedAt = new Date();
      current[index] = product;
      this.helmetProductsSubject.next([...current]);
    }
  }

  deleteHelmetProduct(id: number): void {
    const current = this.helmetProductsSubject.value;
    this.helmetProductsSubject.next(current.filter((p) => p.id !== id));
  }

  // Product Details
  getProductDetails(): Observable<ProductDetail[]> {
    return this.productDetails$;
  }

  addProductDetail(detail: ProductDetail): void {
    const current = this.productDetailsSubject.value;
    detail.id = Math.max(...current.map((d) => d.id), 0) + 1;
    detail.createdAt = new Date();
    detail.updatedAt = new Date();
    this.productDetailsSubject.next([...current, detail]);
  }

  updateProductDetail(id: number, detail: ProductDetail): void {
    const current = this.productDetailsSubject.value;
    const index = current.findIndex((d) => d.id === id);
    if (index !== -1) {
      detail.updatedAt = new Date();
      current[index] = detail;
      this.productDetailsSubject.next([...current]);
    }
  }

  deleteProductDetail(id: number): void {
    const current = this.productDetailsSubject.value;
    this.productDetailsSubject.next(current.filter((d) => d.id !== id));
  }

  private getInitialManufacturers(): Manufacturer[] {
    return [
      {
        id: 1,
        code: 'AGV001',
        name: 'AGV',
        country: 'Italy',
        description:
          'Nhà sản xuất mũ bảo hiểm cao cấp từ Italy, chuyên về mũ bảo hiểm thể thao và đua xe',
        contactEmail: 'info@agv.com',
        contactPhone: '+39 02 1234567',
        address: 'Via Roma 123, Milan, Italy',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 2,
        code: 'SHO001',
        name: 'Shoei',
        country: 'Japan',
        description:
          'Thương hiệu mũ bảo hiểm nổi tiếng từ Nhật Bản, được biết đến với chất lượng và công nghệ tiên tiến',
        contactEmail: 'info@shoei.com',
        contactPhone: '+81 3 1234 5678',
        address: '1-2-3 Shibuya, Tokyo, Japan',
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      },
      {
        id: 3,
        code: 'ARA001',
        name: 'Arai',
        country: 'Japan',
        description:
          'Nhà sản xuất mũ bảo hiểm chất lượng cao từ Nhật Bản, chuyên về mũ bảo hiểm đua xe và thể thao',
        contactEmail: 'info@arai.com',
        contactPhone: '+81 6 1234 5678',
        address: '2-3-4 Osaka, Japan',
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
      },
      {
        id: 4,
        code: 'HJC001',
        name: 'HJC',
        country: 'South Korea',
        description:
          'Thương hiệu mũ bảo hiểm giá cả hợp lý từ Hàn Quốc, cung cấp sản phẩm chất lượng tốt với giá phải chăng',
        contactEmail: 'info@hjc.com',
        contactPhone: '+82 2 1234 5678',
        address: '123 Gangnam-gu, Seoul, South Korea',
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-04'),
      },
      {
        id: 5,
        code: 'BEL001',
        name: 'Bell',
        country: 'USA',
        description:
          'Nhà sản xuất mũ bảo hiểm thể thao từ Mỹ, chuyên về mũ bảo hiểm đua xe và mô tô',
        contactEmail: 'info@bellhelmets.com',
        contactPhone: '+1 555 123 4567',
        address: '456 Main St, Los Angeles, CA, USA',
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05'),
      },
    ];
  }

  private getInitialHelmetProducts(): HelmetProduct[] {
    return [
      {
        id: 1,
        image: 'https://via.placeholder.com/150x150/007bff/ffffff?text=AGV+K1',
        code: 'P001',
        name: 'AGV K1 Helmet',
        manufacturerId: 1,
        manufacturerName: 'AGV',
        color: 'Đen mờ',
        size: 'M',
        quantity: 15,
        price: 2500000,
        status: 'Còn hàng',
        description: 'Mũ bảo hiểm thể thao cao cấp với thiết kế hiện đại',
        specifications: 'Chất liệu: Carbon fiber, Trọng lượng: 1.2kg',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 2,
        image: 'https://via.placeholder.com/150x150/28a745/ffffff?text=Shoei+X14',
        code: 'P002',
        name: 'Shoei X-14',
        manufacturerId: 2,
        manufacturerName: 'Shoei',
        color: 'Trắng',
        size: 'L',
        quantity: 8,
        price: 3200000,
        status: 'Còn hàng',
        description: 'Mũ bảo hiểm racing chuyên nghiệp',
        specifications: 'Chất liệu: Carbon fiber, Trọng lượng: 1.1kg',
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      },
      {
        id: 3,
        image: 'https://via.placeholder.com/150x150/dc3545/ffffff?text=Arai+RX7V',
        code: 'P003',
        name: 'Arai RX-7V',
        manufacturerId: 3,
        manufacturerName: 'Arai',
        color: 'Đỏ',
        size: 'M',
        quantity: 12,
        price: 2800000,
        status: 'Còn hàng',
        description: 'Mũ bảo hiểm touring tiện nghi',
        specifications: 'Chất liệu: Composite, Trọng lượng: 1.3kg',
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
      },
    ];
  }

  private getInitialProductDetails(): ProductDetail[] {
    return [
      {
        id: 1,
        productId: 1,
        productName: 'AGV K1 Helmet',
        category: 'Mũ thể thao',
        material: 'Carbon fiber',
        weight: 1.2,
        dimensions: '30cm x 25cm x 20cm',
        safetyStandards: ['DOT', 'ECE', 'SNELL'],
        features: ['Pinlock', 'Ventilation', 'Removable liner'],
        warranty: '2 năm',
        careInstructions: 'Làm sạch bằng nước ấm và xà phòng nhẹ',
        compatibility: ['Mô tô thể thao', 'Mô tô touring'],
        colors: ['Đen mờ', 'Trắng', 'Đỏ'],
        sizes: ['S', 'M', 'L', 'XL'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 2,
        productId: 2,
        productName: 'Shoei X-14',
        category: 'Mũ racing',
        material: 'Carbon fiber',
        weight: 1.1,
        dimensions: '29cm x 24cm x 19cm',
        safetyStandards: ['DOT', 'ECE', 'SNELL'],
        features: ['Aerodynamic design', 'Advanced ventilation', 'Quick release'],
        warranty: '3 năm',
        careInstructions: 'Làm sạch bằng nước ấm và xà phòng nhẹ',
        compatibility: ['Mô tô racing', 'Mô tô thể thao'],
        colors: ['Trắng', 'Đen', 'Xanh'],
        sizes: ['S', 'M', 'L', 'XL'],
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      },
    ];
  }
}
