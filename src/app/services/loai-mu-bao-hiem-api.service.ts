import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoaiMuBaoHiemRequest {
  tenLoai: string;
  moTa?: string | null;
  trangThai?: boolean | null;
}

export interface LoaiMuBaoHiemResponse {
  id: number;
  tenLoai: string;
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
export class LoaiMuBaoHiemApiService {
  private baseUrl = environment.apiBaseUrl + '/loai-mu';

  constructor(private http: HttpClient) {}

  create(payload: LoaiMuBaoHiemRequest): Observable<LoaiMuBaoHiemResponse> {
    return this.http.post<LoaiMuBaoHiemResponse>(this.baseUrl, payload);
  }

  update(id: number, payload: LoaiMuBaoHiemRequest): Observable<LoaiMuBaoHiemResponse> {
    return this.http.put<LoaiMuBaoHiemResponse>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getById(id: number): Observable<LoaiMuBaoHiemResponse> {
    return this.http.get<LoaiMuBaoHiemResponse>(`${this.baseUrl}/${id}`);
  }

  search(params: {
    keyword?: string;
    trangThai?: boolean | null;
    page?: number;
    size?: number;
    sort?: string;
  }): Observable<PageResponse<LoaiMuBaoHiemResponse>> {
    let httpParams = new HttpParams();
    if (params.keyword) httpParams = httpParams.set('keyword', params.keyword);
    if (params.trangThai !== undefined && params.trangThai !== null) {
      httpParams = httpParams.set('trangThai', String(params.trangThai));
    }
    httpParams = httpParams.set('page', String(params.page ?? 0));
    httpParams = httpParams.set('size', String(params.size ?? 10));
    httpParams = httpParams.set('sort', params.sort ?? 'id,desc');
    return this.http.get<PageResponse<LoaiMuBaoHiemResponse>>(this.baseUrl, { params: httpParams });
  }

  getAllActive(): Observable<LoaiMuBaoHiemResponse[]> {
    return this.http.get<LoaiMuBaoHiemResponse[]>(`${this.baseUrl}/all`);
  }
}
