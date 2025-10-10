import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface NhaSanXuatRequest {
  maNhaSanXuat: string;
  tenNhaSanXuat: string;
  quocGia: string;
  moTa?: string;
  emailLienHe?: string;
  soDienThoaiLienHe?: string;
  diaChi?: string;
  trangThai?: boolean;
}

export interface NhaSanXuatResponse {
  id: number;
  maNhaSanXuat: string;
  tenNhaSanXuat: string;
  quocGia: string;
  moTa?: string;
  emailLienHe?: string;
  soDienThoaiLienHe?: string;
  diaChi?: string;
  trangThai: boolean;
  ngayTao: string;
  ngayCapNhat: string;
}

export interface MauSacRequest {
  maMauSac: string;
  tenMauSac: string;
  moTa?: string;
  trangThai?: boolean;
}

export interface MauSacResponse {
  id: number;
  maMauSac: string;
  tenMauSac: string;
  moTa?: string;
  trangThai: boolean;
  ngayTao: string;
  ngayCapNhat: string;
}

export interface KichThuocRequest {
  maKichThuoc: string;
  tenKichThuoc: string;
  moTa?: string;
  trangThai?: boolean;
}

export interface KichThuocResponse {
  id: number;
  maKichThuoc: string;
  tenKichThuoc: string;
  moTa?: string;
  trangThai: boolean;
  ngayTao: string;
  ngayCapNhat: string;
}

export interface KieuDangMuRequest {
  maKieuDangMu: string;
  tenKieuDangMu: string;
  moTa?: string;
  trangThai?: boolean;
}

export interface KieuDangMuResponse {
  id: number;
  maKieuDangMu: string;
  tenKieuDangMu: string;
  moTa?: string;
  trangThai: boolean;
  ngayTao: string;
  ngayCapNhat: string;
}

export interface ChatLieuVoRequest {
  maChatLieuVo: string;
  tenChatLieuVo: string;
  moTa?: string;
  trangThai?: boolean;
}

export interface ChatLieuVoResponse {
  id: number;
  maChatLieuVo: string;
  tenChatLieuVo: string;
  moTa?: string;
  trangThai: boolean;
  ngayTao: string;
  ngayCapNhat: string;
}

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {
  constructor(private apiService: ApiService) {}

  // Nhà sản xuất
  getAllNhaSanXuat(): Observable<any> {
    return this.apiService.get<any>('/nha-san-xuat');
  }

  getNhaSanXuatById(id: number): Observable<NhaSanXuatResponse> {
    return this.apiService.get<NhaSanXuatResponse>(`/nha-san-xuat/${id}`);
  }

  createNhaSanXuat(request: NhaSanXuatRequest): Observable<NhaSanXuatResponse> {
    return this.apiService.post<NhaSanXuatResponse>('/nha-san-xuat', request);
  }

  updateNhaSanXuat(id: number, request: NhaSanXuatRequest): Observable<NhaSanXuatResponse> {
    return this.apiService.put<NhaSanXuatResponse>(`/nha-san-xuat/${id}`, request);
  }

  deleteNhaSanXuat(id: number): Observable<void> {
    return this.apiService.delete<void>(`/nha-san-xuat/${id}`);
  }

  // Màu sắc
  getAllMauSac(): Observable<any> {
    return this.apiService.get<any>('/mau-sac');
  }

  getMauSacById(id: number): Observable<MauSacResponse> {
    return this.apiService.get<MauSacResponse>(`/mau-sac/${id}`);
  }

  createMauSac(request: MauSacRequest): Observable<MauSacResponse> {
    return this.apiService.post<MauSacResponse>('/mau-sac', request);
  }

  updateMauSac(id: number, request: MauSacRequest): Observable<MauSacResponse> {
    return this.apiService.put<MauSacResponse>(`/mau-sac/${id}`, request);
  }

  deleteMauSac(id: number): Observable<void> {
    return this.apiService.delete<void>(`/mau-sac/${id}`);
  }

  // Kích thước
  getAllKichThuoc(): Observable<any> {
    return this.apiService.get<any>('/kich-thuoc');
  }

  getKichThuocById(id: number): Observable<KichThuocResponse> {
    return this.apiService.get<KichThuocResponse>(`/kich-thuoc/${id}`);
  }

  createKichThuoc(request: KichThuocRequest): Observable<KichThuocResponse> {
    return this.apiService.post<KichThuocResponse>('/kich-thuoc', request);
  }

  updateKichThuoc(id: number, request: KichThuocRequest): Observable<KichThuocResponse> {
    return this.apiService.put<KichThuocResponse>(`/kich-thuoc/${id}`, request);
  }

  deleteKichThuoc(id: number): Observable<void> {
    return this.apiService.delete<void>(`/kich-thuoc/${id}`);
  }

  // Kiểu dáng mũ
  getAllKieuDangMu(): Observable<any> {
    return this.apiService.get<any>('/kieu-dang-mu');
  }

  getKieuDangMuById(id: number): Observable<KieuDangMuResponse> {
    return this.apiService.get<KieuDangMuResponse>(`/kieu-dang-mu/${id}`);
  }

  createKieuDangMu(request: KieuDangMuRequest): Observable<KieuDangMuResponse> {
    return this.apiService.post<KieuDangMuResponse>('/kieu-dang-mu', request);
  }

  updateKieuDangMu(id: number, request: KieuDangMuRequest): Observable<KieuDangMuResponse> {
    return this.apiService.put<KieuDangMuResponse>(`/kieu-dang-mu/${id}`, request);
  }

  deleteKieuDangMu(id: number): Observable<void> {
    return this.apiService.delete<void>(`/kieu-dang-mu/${id}`);
  }

  // Chất liệu vỏ
  getAllChatLieuVo(): Observable<any> {
    return this.apiService.get<any>('/chat-lieu-vo');
  }

  getChatLieuVoById(id: number): Observable<ChatLieuVoResponse> {
    return this.apiService.get<ChatLieuVoResponse>(`/chat-lieu-vo/${id}`);
  }

  createChatLieuVo(request: ChatLieuVoRequest): Observable<ChatLieuVoResponse> {
    return this.apiService.post<ChatLieuVoResponse>('/chat-lieu-vo', request);
  }

  updateChatLieuVo(id: number, request: ChatLieuVoRequest): Observable<ChatLieuVoResponse> {
    return this.apiService.put<ChatLieuVoResponse>(`/chat-lieu-vo/${id}`, request);
  }

  deleteChatLieuVo(id: number): Observable<void> {
    return this.apiService.delete<void>(`/chat-lieu-vo/${id}`);
  }
}
