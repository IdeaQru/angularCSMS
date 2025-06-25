import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

// =======================================================
// INTERFACES (Struktur Data dari Backend)
// =======================================================

export interface IUser {
  _id?: string;
  username: string;
  password?: string; // Password bersifat opsional di frontend, terutama saat mengirim data
  role: 'admin' | 'auditor' | 'perusahaan';
  nama: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPerusahaan {
  _id?: string;
  nama: string;
  alamat: string;
  jenisUsaha: string;
  userId: string; // Bisa juga bertipe IUser jika Anda melakukan populate di backend
  statusAudit: 'Belum Audit' | 'Sedang Audit' | 'Selesai';
}

export interface IKriteria {
  _id?: string;
  Kode: string;
  Deskripsi: string;
  Kategori: string;
  Referensi: string;
  Tingkat: 'Awal' | 'Transisi' | 'Lanjutan';
}

export interface ITemuan {
  _id?: string;
  prequalificationId: string;
  kriteriaId: string | IKriteria; // Bisa string atau objek Kriteria setelah populate
  deskripsi: string;
  klasifikasi: 'Minor' | 'Mayor' | 'Kritikal';
  status: 'Open' | 'Close';
  tindakLanjut?: string;
}

export interface INCR {
  _id?: string;
  nomorNCR?: string;
  temuanId: string | ITemuan; // Bisa string atau objek Temuan setelah populate
  deskripsi: string;
  klasifikasi: 'Minor' | 'Mayor' | 'Kritikal';
  akarMasalah: string;
  tindakanKoreksi: string;
  penanggungJawab: string;
  batasWaktu: Date;
  status: 'Open' | 'In Progress' | 'Close';
  tanggapanAuditee?: string;
  tanggalPenyelesaian?: Date;
}

export interface ILaporan {
  _id?: string;
  nomorLaporan?: string;
  prequalificationId: string;
  perusahaanId: string | IPerusahaan;
  auditorId: string | IUser;
  jenisLaporan: 'Sementara' | 'Final';
  tanggalLaporan: Date;
  tujuanAudit: string;
  lingkupAudit: string;
  ringkasanHasil: string;
  daftarTemuan: string[] | ITemuan[];
  kesimpulan: string;
  rekomendasi: string;
  status: 'Draft' | 'Final';
}


// =======================================================
// SERVICES (Logika untuk berinteraksi dengan API)
// =======================================================

// --- User Service ---
@Injectable({ providedIn: 'root' })
export class allservices {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.apiUrl);
  }
  resetPassword(id: string, newPassword: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/${id}/reset-password`, { newPassword });
  }
  changePassword(passwords: { oldPassword: string, newPassword: string }): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/change-password`, passwords);
  }
  getById(id: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.apiUrl}/${id}`);
  }

  create(user: Omit<IUser, '_id'>): Observable<IUser> {
    return this.http.post<IUser>(this.apiUrl, user);
  }

  update(id: string, user: Partial<IUser>): Observable<IUser> {
    return this.http.put<IUser>(`${this.apiUrl}/${id}`, user);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}

// --- Perusahaan Service ---
@Injectable({ providedIn: 'root' })
export class PerusahaanService {
  private apiUrl = `${environment.apiUrl}/perusahaan`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<IPerusahaan[]> {
    return this.http.get<IPerusahaan[]>(this.apiUrl);
  }

  getById(id: string): Observable<IPerusahaan> {
    return this.http.get<IPerusahaan>(`${this.apiUrl}/${id}`);
  }

  create(data: Omit<IPerusahaan, '_id'>): Observable<IPerusahaan> {
    return this.http.post<IPerusahaan>(this.apiUrl, data);
  }

  update(id: string, data: Partial<IPerusahaan>): Observable<IPerusahaan> {
    return this.http.put<IPerusahaan>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}

// --- Kriteria Service ---
@Injectable({ providedIn: 'root' })
export class KriteriaService {
  private apiUrl = `${environment.apiUrl}/kriteria`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<IKriteria[]> {
    return this.http.get<IKriteria[]>(this.apiUrl);
  }

  getById(id: string): Observable<IKriteria> {
    return this.http.get<IKriteria>(`${this.apiUrl}/${id}`);
  }

  create(data: Omit<IKriteria, '_id'>): Observable<IKriteria> {
    return this.http.post<IKriteria>(this.apiUrl, data);
  }

  update(id: string, data: Partial<IKriteria>): Observable<IKriteria> {
    return this.http.put<IKriteria>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}

// --- Temuan Service ---
@Injectable({ providedIn: 'root' })
export class TemuanService {
  private apiUrl = `${environment.apiUrl}/temuan`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<ITemuan[]> {
    return this.http.get<ITemuan[]>(this.apiUrl);
  }

  getById(id: string): Observable<ITemuan> {
    return this.http.get<ITemuan>(`${this.apiUrl}/${id}`);
  }

  create(data: Omit<ITemuan, '_id'>): Observable<ITemuan> {
    return this.http.post<ITemuan>(this.apiUrl, data);
  }

  update(id: string, data: Partial<ITemuan>): Observable<ITemuan> {
    return this.http.put<ITemuan>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}

// --- NCR Service ---
@Injectable({ providedIn: 'root' })
export class NcrService {
  private apiUrl = `${environment.apiUrl}/ncr`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<INCR[]> {
    return this.http.get<INCR[]>(this.apiUrl);
  }

  getById(id: string): Observable<INCR> {
    return this.http.get<INCR>(`${this.apiUrl}/${id}`);
  }

  create(data: Omit<INCR, '_id' | 'nomorNCR'>): Observable<INCR> {
    return this.http.post<INCR>(this.apiUrl, data);
  }

  update(id: string, data: Partial<INCR>): Observable<INCR> {
    return this.http.put<INCR>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}

// --- Laporan Service ---
@Injectable({ providedIn: 'root' })
export class LaporanService {
  private apiUrl = `${environment.apiUrl}/laporan`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<ILaporan[]> {
    return this.http.get<ILaporan[]>(this.apiUrl);
  }

  getById(id: string): Observable<ILaporan> {
    return this.http.get<ILaporan>(`${this.apiUrl}/${id}`);
  }

  create(data: Omit<ILaporan, '_id' | 'nomorLaporan'>): Observable<ILaporan> {
    return this.http.post<ILaporan>(this.apiUrl, data);
  }

  update(id: string, data: Partial<ILaporan>): Observable<ILaporan> {
    return this.http.put<ILaporan>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}

