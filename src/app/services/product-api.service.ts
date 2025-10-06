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
  loaiMuBaoHiem?: string | null;
  nhaSanXuat?: string | null;
  chatLieuVo?: string | null;
  trongLuong?: string | null;
  xuatXu?: string | null;
  kieuDangMu?: string | null;
  congNgheAnToan?: string | null;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
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
}
