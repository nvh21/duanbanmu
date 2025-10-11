import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface MaterialResponse {
  id: number;
  tenChatLieu: string;
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
export class MaterialApiService {
  private baseUrl = environment.apiBaseUrl + '/chat-lieu-vo';
  constructor(private http: HttpClient) {}

  search(params: {
    keyword?: string;
    trangThai?: boolean;
    page?: number;
    size?: number;
    sort?: string;
  }): Observable<PageResponse<MaterialResponse>> {
    let p = new HttpParams();
    if (params.keyword) p = p.set('keyword', params.keyword);
    if (params.trangThai !== undefined && params.trangThai !== null)
      p = p.set('trangThai', String(params.trangThai));
    p = p.set('page', String(params.page ?? 0));
    p = p.set('size', String(params.size ?? 10));
    p = p.set('sort', params.sort ?? 'id,desc');
    return this.http.get<PageResponse<MaterialResponse>>(this.baseUrl, { params: p });
  }

  create(payload: {
    tenChatLieu: string;
    moTa?: string;
    trangThai: boolean;
  }): Observable<MaterialResponse> {
    return this.http.post<MaterialResponse>(this.baseUrl, payload);
  }
  update(
    id: number,
    payload: { tenChatLieu: string; moTa?: string; trangThai: boolean }
  ): Observable<MaterialResponse> {
    return this.http.put<MaterialResponse>(`${this.baseUrl}/${id}`, payload);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getAllActive(): Observable<MaterialResponse[]> {
    return this.search({ trangThai: true, page: 0, size: 1000 }).pipe(
      map(response => response.content)
    );
  }
}
