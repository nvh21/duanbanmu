import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SizeResponse {
  id: number;
  tenKichThuoc: string;
  moTa?: string;
  trangThai: boolean;
}
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({ providedIn: 'root' })
export class SizeApiService {
  private baseUrl = environment.apiBaseUrl + '/kich-thuoc';
  constructor(private http: HttpClient) {}

  search(params: {
    keyword?: string;
    trangThai?: boolean;
    page?: number;
    size?: number;
    sort?: string;
  }): Observable<PageResponse<SizeResponse>> {
    let p = new HttpParams();
    if (params.keyword) p = p.set('keyword', params.keyword);
    if (params.trangThai !== undefined && params.trangThai !== null)
      p = p.set('trangThai', String(params.trangThai));
    p = p.set('page', String(params.page ?? 0));
    p = p.set('size', String(params.size ?? 10));
    p = p.set('sort', params.sort ?? 'id,desc');
    return this.http.get<PageResponse<SizeResponse>>(this.baseUrl, { params: p });
  }

  create(payload: {
    tenKichThuoc: string;
    moTa?: string;
    trangThai: boolean;
  }): Observable<SizeResponse> {
    return this.http.post<SizeResponse>(this.baseUrl, payload);
  }
  update(
    id: number,
    payload: { tenKichThuoc: string; moTa?: string; trangThai: boolean }
  ): Observable<SizeResponse> {
    return this.http.put<SizeResponse>(`${this.baseUrl}/${id}`, payload);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
