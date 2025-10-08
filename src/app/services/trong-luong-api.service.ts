import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TrongLuongRequest {
  giaTriTrongLuong: number;
  donVi: string;
  moTa?: string | null;
  trangThai?: boolean | null;
}

export interface TrongLuongResponse {
  id: number;
  giaTriTrongLuong: number;
  donVi: string;
  moTa?: string | null;
  trangThai?: boolean | null;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({ providedIn: 'root' })
export class TrongLuongApiService {
  private baseUrl = environment.apiBaseUrl + '/trong-luong';

  constructor(private http: HttpClient) {}

  create(payload: TrongLuongRequest): Observable<TrongLuongResponse> {
    return this.http.post<TrongLuongResponse>(this.baseUrl, payload);
  }

  update(id: number, payload: TrongLuongRequest): Observable<TrongLuongResponse> {
    return this.http.put<TrongLuongResponse>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getById(id: number): Observable<TrongLuongResponse> {
    return this.http.get<TrongLuongResponse>(`${this.baseUrl}/${id}`);
  }

  search(params: {
    keyword?: string;
    trangThai?: boolean;
    page?: number;
    size?: number;
    sort?: string;
  }): Observable<PageResponse<TrongLuongResponse>> {
    let httpParams = new HttpParams();
    if (params.keyword) httpParams = httpParams.set('keyword', params.keyword);
    if (params.trangThai !== undefined && params.trangThai !== null) {
      httpParams = httpParams.set('trangThai', String(params.trangThai));
    }
    httpParams = httpParams.set('page', String(params.page ?? 0));
    httpParams = httpParams.set('size', String(params.size ?? 10));
    httpParams = httpParams.set('sort', params.sort ?? 'id,desc');
    return this.http.get<PageResponse<TrongLuongResponse>>(this.baseUrl, { params: httpParams });
  }

  getAllActive(): Observable<TrongLuongResponse[]> {
    return this.http.get<TrongLuongResponse[]>(`${this.baseUrl}/all`);
  }
}

