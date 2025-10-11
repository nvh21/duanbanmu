import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ColorResponse {
  id: number;
  tenMau: string;
  maMau: string;
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
export class ColorApiService {
  private baseUrl = environment.apiBaseUrl + '/mau-sac';
  constructor(private http: HttpClient) {}

  search(params: {
    keyword?: string;
    trangThai?: boolean;
    page?: number;
    size?: number;
    sort?: string;
  }): Observable<PageResponse<ColorResponse>> {
    let httpParams = new HttpParams();
    if (params.keyword) httpParams = httpParams.set('keyword', params.keyword);
    if (params.trangThai !== undefined && params.trangThai !== null)
      httpParams = httpParams.set('trangThai', String(params.trangThai));
    httpParams = httpParams.set('page', String(params.page ?? 0));
    httpParams = httpParams.set('size', String(params.size ?? 10));
    httpParams = httpParams.set('sort', params.sort ?? 'id,desc');
    return this.http.get<PageResponse<ColorResponse>>(this.baseUrl, { params: httpParams });
  }

  create(payload: {
    tenMau: string;
    maMau?: string;
    trangThai: boolean;
  }): Observable<ColorResponse> {
    return this.http.post<ColorResponse>(this.baseUrl, payload);
  }

  update(
    id: number,
    payload: { tenMau: string; maMau?: string; trangThai: boolean }
  ): Observable<ColorResponse> {
    return this.http.put<ColorResponse>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getAllActive(): Observable<ColorResponse[]> {
    return this.search({ trangThai: true, page: 0, size: 1000 }).pipe(
      map((response) => response.content)
    );
  }
}
