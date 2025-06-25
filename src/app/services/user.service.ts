import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';
import { User } from './user.model';
import { INCR } from './allservices';
export interface Kriteria {
  _id?: string;
  Kode: string;
  Deskripsi: string;
  Kategori: string;
  Referensi: string;
  Tingkat: string;
}
@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `${environment.apiUrl}/auth/user`;
  private auditorUrl = `${environment.apiUrl}/auditor`;
  private auditeeUrl = `${environment.apiUrl}/auditee`;
  private perusahaanUrl = `${environment.apiUrl}/perusahaan`;
  private kriteriaUrl = `${environment.apiUrl}/kriteria`;
  private prequalificationUrl = `${environment.apiUrl}/prequalification`;
  private uploadFileUrl = `${environment.apiUrl}/upload`;
  private temuanUrl = `${environment.apiUrl}/temuan`;
  private ncrUrl = `${environment.apiUrl}/ncr`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
 resetPassword(id: string, newPassword: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/${id}/reset-password`, { newPassword });
  }

  create(data: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrl, data);
  }

  update(id: string, data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // === Tambahkan method untuk auditor ===
  createAuditor(data: any): Observable<any> {
    // data: { nama, jabatan, lembagaAudit, email, telepon }
    return this.http.post<any>(this.auditorUrl, data);
  }
  getAllAuditor(): Observable<any[]> {
    return this.http.get<any[]>(`${this.auditorUrl}/alldata`);
  }
  // Untuk mengambil profil auditor milik user yang sedang login
  getAuditorProfile() {
    return this.http.get<any>(`${this.auditorUrl}`);
  }
  createPerusahaan(data: any): Observable<any> {
    return this.http.post<any>(this.perusahaanUrl, data);
  }
  getPerusahaan(): Observable<any[]> {
    return this.http.get<any[]>(`${this.perusahaanUrl}`);
  }
  createAuditee(data: any): Observable<any> {
    return this.http.post<any>(this.auditeeUrl, data);
  }
  getAuditee(): Observable<any[]> {
    return this.http.get<any[]>(`${this.auditeeUrl}`);
  }
  updateAuditee(id: string, data: any) {
    return this.http.put<any>(`${this.auditeeUrl}/${id}`, data);
  }
  deleteAuditee(id: string) {
    return this.http.delete<any>(`${this.auditeeUrl}/${id}`);
  }
  updatePerusahaan(id: string, data: any) {
    return this.http.put<any>(`${this.perusahaanUrl}/${id}`, data);
  }
  deletePerusahaan(id: string) {
    return this.http.delete<any>(`${this.perusahaanUrl}/${id}`);
  }
  getKriteria(): Observable<Kriteria[]> {
    return this.http.get<Kriteria[]>(this.kriteriaUrl);
  }

  addKriteria(kriteria: Kriteria): Observable<Kriteria> {
    return this.http.post<Kriteria>(this.kriteriaUrl, kriteria);
  }

  updateKriteria(id: string, kriteria: Kriteria): Observable<Kriteria> {
    return this.http.put<Kriteria>(`${this.kriteriaUrl}/${id}`, kriteria);
  }

  deleteKriteria(id: string): Observable<any> {
    return this.http.delete(`${this.kriteriaUrl}/${id}`);
  }
  saveJawabanPrequalification(auditeeId: string, perusahaanId: string, auditorId: string, Penanggung_Jawab: any, jawaban: any) {
    return this.http.post(this.prequalificationUrl, {
      Auditee: auditeeId,
      ID_Perusahaan: perusahaanId,
      ID_Auditor: auditorId,
      Penanggung_Jawab: Penanggung_Jawab,
      Jawaban: jawaban
    });
  }
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(this.uploadFileUrl, formData);
  }

  // user.service.ts
  getPrequalificationByAuditee(auditeeId: string, perusahaanId?: string, auditorId?: string) {
    let params = `?auditeeId=${auditeeId}`;
    if (perusahaanId) params += `&perusahaanId=${perusahaanId}`;
    if (auditorId) params += `&auditorId=${auditorId}`;
    return this.http.get(`${this.prequalificationUrl}/by-auditee` + params);
  }
  getPerusahaanByAuditee(auditeeId: string): Observable<any> {
    return this.http.get<any>(`${this.perusahaanUrl}/by-auditee?auditeeId=${auditeeId}`);
  }
  getPerusahaanByUserId(userId: string): Observable<any> {
    return this.http.get<any>(`${this.perusahaanUrl}/by-userId?userId=${userId}`);
  }

  // Simpan data perusahaan (create atau update)
  savePerusahaan(perusahaan: any): Observable<any> {
    // Jika perusahaan sudah ada (punya _id), update; jika belum, create
    if (perusahaan._id) {
      return this.http.put<any>(`${this.perusahaanUrl}/${perusahaan._id}`, perusahaan);
    } else {
      return this.http.post<any>(`${this.perusahaanUrl}`, perusahaan);
    }
  }

  // === Audit ===
  getAuditeeByPerusahaan(perusahaanId: string): Observable<any> {
    return this.http.get<any>(`${this.auditeeUrl}/by-perusahaan?perusahaanId=${perusahaanId}`);
  }
  // Ambil data audit berdasarkan auditee (dan filter lain jika perlu)
  getAuditByAuditee(auditeeId: string): Observable<any> {
    return this.http.get<any>(`${this.auditeeUrl}/by-auditee?auditeeId=${auditeeId}`);
  }

  // Simpan data audit (create atau update)
  saveAudit(audit: any): Observable<any> {
    if (audit._id) {
      return this.http.put<any>(`${this.auditeeUrl}/${audit._id}`, audit);
    } else {
      return this.http.post<any>(`${this.auditeeUrl}`, audit);
    }
  }
  getPrequalificationByPerusahaan(perusahaanId: string) {
    return this.http.get<any[]>(`${this.prequalificationUrl}/by-perusahaan?perusahaanId=${perusahaanId}`);
  }
  getPerusahaanByAuditor(auditorId: string) {
    return this.http.get<any[]>(`${this.perusahaanUrl}/by-auditor/${auditorId}`);
  }
  kirimTemuan(temuan: any) {
    return this.http.post<any>(`${this.temuanUrl}`, temuan);
  }
  getTemuanByAudit(auditId: string) {
    return this.http.get<any[]>(`${environment.apiUrl}/temuan/by-audit/${auditId}`);
  }
  // Simpan atau update laporan sementara
  simpanLaporanSementara(laporan: any) {
    return this.http.post(`${environment.apiUrl}/laporan-sementara`, laporan);
  }

  // Ambil laporan sementara berdasarkan ID Audit
  getLaporanSementaraByAudit(auditId: string) {
    return this.http.get<any>(`${environment.apiUrl}/laporan-sementara/by-audit/${auditId}`);
  }
  getNcrByUserId(userId: string): Observable<any> {
    return this.http.get<any>(`${this.ncrUrl}/${userId}`);
  }
    createNcr(data: any) {
    return this.http.post(`${this.ncrUrl}`, data);
  }
  syncLaporanTemuan(laporanId: string): Observable<any> {
    // Menggunakan PATCH dan tidak perlu mengirim body, karena backend yang melakukan semua logika.
    return this.http.patch(`${environment.apiUrl}/laporan-sementara/${laporanId}/sync-temuan`, {});
  }
  getNcrByUser(userId: string): Observable<any> {
    return this.http.get<any>(`${this.ncrUrl}/${userId}`);
  }
  updateNcr(id: string, data: any) {
    return this.http.put(`${this.ncrUrl}/${id}`, data);
  }
}
