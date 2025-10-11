import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SanPhamResponse {
  id: number;
  maSanPham: string;
  tenSanPham: string;
  moTa: string;
  giaBan: number;
  trangThai: boolean;
  ngayTao: string;
  loaiMuBaoHiemId?: number | null;
  loaiMuBaoHiemTen?: string | null;
  nhaSanXuatId?: number | null;
  nhaSanXuatTen?: string | null;
  chatLieuVoId?: number | null;
  chatLieuVoTen?: string | null;
  trongLuongId?: number | null;
  trongLuongTen?: string | null;
  xuatXuId?: number | null;
  xuatXuTen?: string | null;
  kieuDangMuId?: number | null;
  kieuDangMuTen?: string | null;
  congNgheAnToanId?: number | null;
  congNgheAnToanTen?: string | null;
  mauSacId?: number | null;
  mauSacTen?: string | null;
  mauSacMa?: string | null;
  anhSanPham?: string | null;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface LookupItem {
  id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class ProductApiService {
  private baseUrl = environment.apiBaseUrl + '/san-pham';

  constructor(private http: HttpClient) {}

  search(params: {
    keyword?: string;
    trangThai?: boolean;
    page?: number;
    size?: number;
    sort?: string;
  }): Observable<PageResponse<SanPhamResponse>> {
    let httpParams = new HttpParams();
    if (params.keyword) httpParams = httpParams.set('keyword', params.keyword);
    if (params.trangThai !== undefined && params.trangThai !== null) {
      httpParams = httpParams.set('trangThai', String(params.trangThai));
    }
    httpParams = httpParams.set('page', String(params.page ?? 0));
    httpParams = httpParams.set('size', String(params.size ?? 10));
    httpParams = httpParams.set('sort', params.sort ?? 'id,desc');
    return this.http.get<PageResponse<SanPhamResponse>>(this.baseUrl, { params: httpParams });
  }

  getById(id: number): Observable<SanPhamResponse> {
    return this.http.get<SanPhamResponse>(`${this.baseUrl}/${id}`);
  }

  create(
    payload: Partial<SanPhamResponse> & {
      maSanPham: string;
      tenSanPham: string;
      giaBan: number;
      trangThai: boolean;
      loaiMuBaoHiemId?: number;
      nhaSanXuatId?: number;
      chatLieuVoId?: number;
      trongLuongId?: number;
      xuatXuId?: number;
      kieuDangMuId?: number;
      congNgheAnToanId?: number;
    }
  ): Observable<SanPhamResponse> {
    return this.http.post<SanPhamResponse>(this.baseUrl, payload);
  }

  update(id: number, payload: Partial<SanPhamResponse>): Observable<SanPhamResponse> {
    return this.http.put<SanPhamResponse>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // lookups
  getLoaiMuBaoHiemAll(): Observable<{ id: number; tenLoai: string; trangThai: boolean }[]> {
    return this.http.get<{ id: number; tenLoai: string; trangThai: boolean }[]>(
      `${environment.apiBaseUrl}/loai-mu/all`
    );
  }
  getNhaSanXuatAll(): Observable<any> {
    // reuse search endpoint first page large size, only active items
    return this.http.get(`${environment.apiBaseUrl}/nha-san-xuat`, {
      params: new HttpParams()
        .set('page', '0')
        .set('size', '1000')
        .set('trangThai', 'true'),
    });
  }
  getChatLieuVoAll(): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/chat-lieu-vo`, {
      params: new HttpParams()
        .set('page', '0')
        .set('size', '1000')
        .set('trangThai', 'true'),
    });
  }
  getTrongLuongAll(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/trong-luong/all`);
  }
  getXuatXuAll(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/xuat-xu/all`);
  }
  getKieuDangMuAll(): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/kieu-dang-mu`, {
      params: new HttpParams()
        .set('page', '0')
        .set('size', '1000')
        .set('trangThai', 'true'),
    });
  }
  getCongNgheAnToanAll(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/cong-nghe-an-toan/all`);
  }
}
