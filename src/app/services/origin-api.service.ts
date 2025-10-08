import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface OriginRequest {
  tenXuatXu: string;
  moTa?: string | null;
  trangThai?: boolean | null;
}

export interface OriginResponse {
  id: number;
  tenXuatXu: string;
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
export class OriginApiService {
  private baseUrl = environment.apiBaseUrl + '/xuat-xu';

  constructor(private http: HttpClient) {}

  create(payload: OriginRequest): Observable<OriginResponse> {
    return this.http.post<OriginResponse>(this.baseUrl, payload);
  }

  update(id: number, payload: OriginRequest): Observable<OriginResponse> {
    return this.http.put<OriginResponse>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getById(id: number): Observable<OriginResponse> {
    return this.http.get<OriginResponse>(`${this.baseUrl}/${id}`);
  }

  search(params: {
    keyword?: string;
    trangThai?: boolean;
    page?: number;
    size?: number;
    sort?: string;
  }): Observable<PageResponse<OriginResponse>> {
    let httpParams = new HttpParams();
    if (params.keyword) httpParams = httpParams.set('keyword', params.keyword);
    if (params.trangThai !== undefined && params.trangThai !== null) {
      httpParams = httpParams.set('trangThai', String(params.trangThai));
    }
    httpParams = httpParams.set('page', String(params.page ?? 0));
    httpParams = httpParams.set('size', String(params.size ?? 10));
    httpParams = httpParams.set('sort', params.sort ?? 'id,desc');
    return this.http.get<PageResponse<OriginResponse>>(this.baseUrl, { params: httpParams });
  }

  getAllActive(): Observable<OriginResponse[]> {
    return this.http.get<OriginResponse[]>(`${this.baseUrl}/all`);
  }
}

