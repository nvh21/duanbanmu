import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface CongNgheAnToanResponse {
  id: number;
  tenCongNghe: string;
  moTa: string;
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
export class CongNgheAnToanApiService {
  private baseUrl = environment.apiBaseUrl + '/api/cong-nghe-an-toan';
  constructor(private http: HttpClient) {}

  search(params: {
    keyword?: string;
    trangThai?: boolean;
    page?: number;
    size?: number;
    sort?: string;
  }): Observable<PageResponse<CongNgheAnToanResponse>> {
    let httpParams = new HttpParams();
    if (params.keyword) httpParams = httpParams.set('keyword', params.keyword);
    if (params.trangThai !== undefined && params.trangThai !== null)
      httpParams = httpParams.set('trangThai', String(params.trangThai));
    httpParams = httpParams.set('page', String(params.page ?? 0));
    httpParams = httpParams.set('size', String(params.size ?? 10));
    httpParams = httpParams.set('sort', params.sort ?? 'id,desc');
    return this.http.get<PageResponse<CongNgheAnToanResponse>>(this.baseUrl, {
      params: httpParams,
    });
  }

  create(payload: {
    tenCongNghe: string;
    moTa?: string;
    trangThai: boolean;
  }): Observable<CongNgheAnToanResponse> {
    return this.http.post<CongNgheAnToanResponse>(this.baseUrl, payload);
  }

  update(
    id: number,
    payload: { tenCongNghe: string; moTa?: string; trangThai: boolean }
  ): Observable<CongNgheAnToanResponse> {
    return this.http.put<CongNgheAnToanResponse>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getAllActive(): Observable<CongNgheAnToanResponse[]> {
    return this.search({ trangThai: true, page: 0, size: 1000 }).pipe(
      map((response) => response.content)
    );
  }
}
