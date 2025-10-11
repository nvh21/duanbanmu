import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HoaDonDTO, HoaDonPaginatedResponse, HoaDonFilter, HoaDonAdvancedFilter } from '../interfaces/hoa-don.interface';

@Injectable({
  providedIn: 'root'
})
export class HoaDonService {
  private apiUrl = `${environment.apiUrl}/hoa-don`;

  constructor(private http: HttpClient) { }

  getAllHoaDon(): Observable<HoaDonDTO[]> {
    return this.http.get<HoaDonDTO[]>(this.apiUrl);
  }

  getHoaDonPaginated(filter: HoaDonFilter): Observable<HoaDonPaginatedResponse> {
    let params = new HttpParams();
    if (filter.page !== undefined) params = params.append('page', filter.page.toString());
    if (filter.size !== undefined) params = params.append('size', filter.size.toString());
    if (filter.sortBy) params = params.append('sortBy', filter.sortBy);
    if (filter.sortDir) params = params.append('sortDir', filter.sortDir);
    if (filter.search) params = params.append('search', filter.search);
    if (filter.trangThai) params = params.append('trangThai', filter.trangThai);
    if (filter.paymentStatus) params = params.append('paymentStatus', filter.paymentStatus);
    if (filter.paymentMethod) params = params.append('paymentMethod', filter.paymentMethod);

    return this.http.get<HoaDonPaginatedResponse>(`${this.apiUrl}/paginated`, { params });
  }

  getHoaDonById(id: number): Observable<HoaDonDTO> {
    return this.http.get<HoaDonDTO>(`${this.apiUrl}/${id}`);
  }

  createHoaDon(hoaDon: Partial<HoaDonDTO>): Observable<HoaDonDTO> {
    return this.http.post<HoaDonDTO>(this.apiUrl, hoaDon);
  }

  updateHoaDon(id: number, hoaDon: Partial<HoaDonDTO>): Observable<HoaDonDTO> {
    return this.http.put<HoaDonDTO>(`${this.apiUrl}/${id}`, hoaDon);
  }

  deleteHoaDon(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateTrangThaiHoaDon(id: number, trangThai: string): Observable<HoaDonDTO> {
    let params = new HttpParams();
    params = params.append('trangThai', trangThai);
    return this.http.put<HoaDonDTO>(`${this.apiUrl}/${id}/trang-thai`, null, { params });
  }

  getHoaDonDashboard(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard`);
  }

  exportExcel(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/export/excel`);
  }

  // Additional API methods for complete CRUD operations
  getAllHoaDonSimple(): Observable<HoaDonDTO[]> {
    return this.http.get<HoaDonDTO[]>(`${this.apiUrl}/all`);
  }

  createHoaDonNew(hoaDon: Partial<HoaDonDTO>): Observable<HoaDonDTO> {
    return this.http.post<HoaDonDTO>(`${this.apiUrl}/create`, hoaDon);
  }

  updateHoaDonNew(id: number, hoaDon: Partial<HoaDonDTO>): Observable<HoaDonDTO> {
    return this.http.put<HoaDonDTO>(`${this.apiUrl}/update/${id}`, hoaDon);
  }

  deleteHoaDonNew(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  updateTrangThaiHoaDonNew(id: number, trangThai: string): Observable<HoaDonDTO> {
    let params = new HttpParams();
    params = params.append('trangThai', trangThai);
    return this.http.put<HoaDonDTO>(`${this.apiUrl}/update-status/${id}`, null, { params });
  }

  // Advanced search method
  getHoaDonAdvancedSearch(filter: HoaDonAdvancedFilter): Observable<HoaDonPaginatedResponse> {
    let params = new HttpParams();
    if (filter.page !== undefined) params = params.append('page', filter.page.toString());
    if (filter.size !== undefined) params = params.append('size', filter.size.toString());
    if (filter.sortBy) params = params.append('sortBy', filter.sortBy);
    if (filter.sortDir) params = params.append('sortDir', filter.sortDir);
    if (filter.searchTerm) params = params.append('searchTerm', filter.searchTerm);
    if (filter.trangThai) params = params.append('trangThai', filter.trangThai);
    if (filter.startDate) params = params.append('startDate', filter.startDate);
    if (filter.endDate) params = params.append('endDate', filter.endDate);
    if (filter.minAmount !== undefined) params = params.append('minAmount', filter.minAmount.toString());
    if (filter.maxAmount !== undefined) params = params.append('maxAmount', filter.maxAmount.toString());

    return this.http.get<HoaDonPaginatedResponse>(`${this.apiUrl}/advanced-search`, { params });
  }

  // Search suggestions
  getSearchSuggestions(query: string): Observable<string[]> {
    let params = new HttpParams();
    params = params.append('query', query);
    return this.http.get<string[]>(`${this.apiUrl}/search-suggestions`, { params });
  }

  // SanPham API methods
  getAllSanPham(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/san-pham/all`);
  }

  getActiveSanPham(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/san-pham/active`);
  }

  getAvailableSanPham(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/san-pham/available`);
  }

  createSanPham(sanPham: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/san-pham/create`, sanPham);
  }

  // Methods for DataService compatibility
  testApi(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/test`);
  }

  createSampleData(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/sample-data`, {});
  }

  // Get detailed invoice information
  getHoaDonDetail(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/detail`);
  }
}
