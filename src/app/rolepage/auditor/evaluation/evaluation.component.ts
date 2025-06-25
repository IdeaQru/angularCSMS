import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from '../../../../environment/environment';
declare var bootstrap: any;

import Swal from 'sweetalert2';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class EvaluationComponent {
  // Properti Anda yang lain...
  companies: any[] = [];
  selectedCompany: string = '';
  prequalifications: any[] = [];
  selectedPrequalification: any = null;
  isLoading = false;
  auditorId: any;
  previewUrl: string = '';
  editMode: boolean[] = [];
  editJawaban: any[] = [];

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit() {
    this.auditorId = this.authService.getUserId();
    if (this.auditorId) {
      this.userService.getPerusahaanByAuditor(this.auditorId).subscribe(res => {
        this.companies = res;
      });
    }
  }

  onCompanyChange() {
    // ... (kode ini tidak perlu diubah)
    if (!this.selectedCompany) { /* ... */ return; }
    this.isLoading = true;
    this.userService.getPrequalificationByPerusahaan(this.selectedCompany).subscribe({
      next: (res) => {
        this.prequalifications = Array.isArray(res) ? res : [res];
        this.selectedPrequalification = this.prequalifications.length ? this.prequalifications[0] : null;
        this.isLoading = false;
        if (this.selectedPrequalification) {
          this.loadTemuan(this.selectedPrequalification._id);
        }
      },
      error: () => { /* ... */ }
    });
  }

  loadTemuan(auditId: string) {
    // ... (kode ini tidak perlu diubah, sudah benar)
    this.userService.getTemuanByAudit(auditId).subscribe({
      next: (temuanList) => {
        if (this.selectedPrequalification && this.selectedPrequalification.Jawaban) {
          for (let j of this.selectedPrequalification.Jawaban) {
            const temuan = temuanList.find(t => (t.ID_Kriteria?._id || t.ID_Kriteria) === (j.Kriteria._id || j.Kriteria));
            if (temuan) {
              j.statusKoreksi = temuan.Status_TL;
              j.catatanKoreksi = temuan.Tindak_Lanjut;
              j.klasifikasiTemuan = temuan.Klasifikasi_Temuan;
              // Simpan ID temuan untuk update/delete di masa depan
              j.idTemuan = temuan._id; 
            }
          }
        }
      },
      error: () => {}
    });
  }

  startEdit(index: number, jawaban: any) {
    // ... (kode ini tidak perlu diubah)
    this.editMode[index] = true;
    this.editJawaban[index] = {
      statusKoreksi: jawaban.statusKoreksi || '',
      catatanKoreksi: jawaban.catatanKoreksi || '',
      klasifikasiTemuan: jawaban.klasifikasiTemuan || ''
    };
  }

  cancelEdit(index: number) {
    // ... (kode ini tidak perlu diubah)
    this.editMode[index] = false;
    this.editJawaban[index] = null;
  }

  saveRow(index: number, j: any) {
    const editedData = this.editJawaban[index];

      if (!editedData.klasifikasiTemuan) {
        // <<< PERUBAHAN: Ganti alert validasi dengan Swal
        Swal.fire({
          icon: 'warning',
          title: 'Data Tidak Lengkap',
          text: 'Klasifikasi Temuan wajib diisi jika status bukan "Diterima"!',
        });
        return;
      }

      const temuan = {
        _id: j.idTemuan, // Sertakan ID untuk update, jika ada
        ID_Audit: this.selectedPrequalification._id,
        ID_Kriteria: j.Kriteria._id || j.Kriteria,
        Deskripsi: j.Keterangan,
        Tanggal_Temuan: new Date().toISOString().slice(0, 10),
        Bukti: j.File_Bukti,
        Tindak_Lanjut: j.catatanKoreksi || '',
        Status_TL: editedData.statusKoreksi,
        Klasifikasi_Temuan: editedData.klasifikasiTemuan
      };

      this.userService.kirimTemuan(temuan).subscribe({
        next: (res) => {
          // <<< PERUBAHAN: Ganti alert sukses dengan Swal
          Swal.fire({
            icon: 'success',
            title: 'Berhasil Disimpan!',
            text: 'Temuan telah berhasil direkam.',
            timer: 1500,
            showConfirmButton: false
          });
          // Update data lokal dengan respons dari server
          Object.assign(j, {
            statusKoreksi: res.Status_TL,
            catatanKoreksi: res.Tindak_Lanjut,
            klasifikasiTemuan: res.Klasifikasi_Temuan,
            idTemuan: res._id
          });
          this.editMode[index] = false;
        },
        error: err => {
          // <<< PERUBAHAN: Ganti alert error dengan Swal
          Swal.fire({
            icon: 'error',
            title: 'Gagal Menyimpan',
            text: err.error?.message || err.message || 'Terjadi kesalahan pada server.'
          });
        }
      });
    
  }

  // Fungsi lain tidak perlu diubah...
   getFileUrl(filePath: string): string {
    if (!filePath) return '';
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    }
    return `${environment.apiUrl}/${filePath}`;
  }

  openPreview(filePath: string | undefined) {
    this.previewUrl = this.getFileUrl(filePath ?? '');
    const modal = new bootstrap.Modal(document.getElementById('filePreviewModal'));
    modal.show();
  }

  isImageFile(url: string): boolean {
    return /\.(jpg|jpeg|png|gif|bmp)$/i.test(url);
  }

  isPdfFile(url: string): boolean {
    return /\.pdf$/i.test(url);
  }
}
