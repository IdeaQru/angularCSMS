import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from '../../../../environment/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-laporan-sementara2',
  templateUrl: './laporan-sementara.component.html',
  styleUrls: ['./laporan-sementara.component.css']
})
export class AuditorLaporanSementaraComponent implements OnInit {
  companies: any[] = [];
  selectedCompany: string = '';
  prequalifications: any[] = [];
  selectedPrequalification: any = null;
  isLoading = false;
  laporan: any = null;
  isEdit = false;
  daftarTemuan: any[] = [];
  auditorId: any;
  showTemuanTable: boolean = false;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.auditorId = this.authService.getUserId();
    if (this.auditorId) {
      this.userService.getPerusahaanByAuditor(this.auditorId).subscribe(res => {
        this.companies = res;
        // console.log(res);

      });
    }
    console.log('Temuan data:', this.daftarTemuan);
  }
  synchronizeTemuanLaporan() {
    // 1. Pastikan ada laporan yang sudah di-load untuk disinkronkan.
    if (!this.laporan || !this.laporan._id) {
      Swal.fire('Info', 'Tidak ada laporan yang dipilih untuk disinkronkan.', 'info');
      return;
    }

    // 2. Beri feedback ke pengguna bahwa proses sedang berjalan.
    Swal.fire({
      title: 'Sinkronisasi Temuan...',
      text: 'Sedang memperbarui daftar temuan pada laporan. Mohon tunggu.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // 3. Panggil fungsi service yang baru dibuat.
    this.userService.syncLaporanTemuan(this.laporan._id).subscribe({
      next: (updatedLaporan) => {
        // 4. Jika berhasil, perbarui data laporan di frontend dan beri notifikasi sukses.
        this.laporan = updatedLaporan;

        // "Populate" kembali daftar temuan dengan objek lengkap untuk ditampilkan
        const temuanIdsInLaporan = this.laporan.Daftar_Temuan || [];
        this.laporan.Daftar_Temuan = this.daftarTemuan.filter(t => temuanIdsInLaporan.includes(t._id));

        Swal.fire({
          icon: 'success',
          title: 'Sinkronisasi Berhasil!',
          text: 'Daftar temuan pada laporan telah berhasil diperbarui.',
        });
      },
      error: (err:any) => {
        // 5. Jika gagal, tampilkan notifikasi error.
        Swal.fire({
          icon: 'error',
          title: 'Gagal Sinkronisasi',
          text: err.error?.message || 'Terjadi kesalahan saat mencoba memperbarui laporan.',
        });
      }
    });
  }
  onCompanyChange() {
    if (!this.selectedCompany) {
      this.prequalifications = [];
      this.selectedPrequalification = null;
      this.laporan = null;
      this.daftarTemuan = [];
      return;
    }
    this.isLoading = true;
    this.userService.getPrequalificationByPerusahaan(this.selectedCompany).subscribe({
      next: (res) => {
        this.prequalifications = Array.isArray(res) ? res : [res];
        this.selectedPrequalification = this.prequalifications.length ? this.prequalifications[0] : null;
        this.isLoading = false;
        if (this.selectedPrequalification) {
          this.loadLaporan(this.selectedPrequalification._id);
          this.loadTemuan(this.selectedPrequalification._id);
        }
      },
      error: () => {
        this.prequalifications = [];
        this.selectedPrequalification = null;
        this.laporan = null;
        this.daftarTemuan = [];
        this.isLoading = false;
      }
    });
  }

  loadLaporan(auditId: string) {
    this.userService.getLaporanSementaraByAudit(auditId).subscribe({
      next: (res) => {
        this.laporan = res && res._id ? res : null;
      },
      error: () => {
        this.laporan = null;
      }
    });
  }

  loadTemuan(auditId: string) {
    this.userService.getTemuanByAudit(auditId).subscribe({
      next: (res) => {
        this.daftarTemuan = res || [];

      },
      error: () => {
        this.daftarTemuan = [];
      }
    });

  }

  buatLaporanSementara() {
    // Filter temuan: hanya yang status koreksi selain "Diterima"
    const daftarTemuanFiltered = (this.daftarTemuan || []).filter(
      t => t.Status_TL !== 'Diterima' && t.Status_Koreksi !== 'Diterima' && t.statusKoreksi !== 'Diterima'
    );
    // Catatan: field status bisa Status_TL, Status_Koreksi, atau statusKoreksi tergantung struktur datamu

    // Hanya kirim array of _id
    const daftarTemuanId = daftarTemuanFiltered.map(t => t._id);

    this.laporan = {
      Nama_Perusahaan: this.selectedPrequalification?.ID_Perusahaan?.Nama || '',
      Pelaksanaan_Audit: this.selectedPrequalification?.Tanggal_Pengisian || '',
      Auditor: this.selectedPrequalification?.ID_Auditor?._id.Nama || this.selectedPrequalification?.ID_Auditor || '',
      Daftar_Temuan: daftarTemuanId,
      Lingkup_Audit: '',
      Tujuan_Audit: '',
      Tingkat_Pencapaian: '',
      Ringkasan_Hasil: '',
      ID_Audit: this.selectedPrequalification?._id
    };
    // console.log("njayy : ",this.laporan);
    this.isEdit = true;
  }



  simpanLaporan() {
    if (!this.laporan.Lingkup_Audit || !this.laporan.Tujuan_Audit) {
      alert('Lingkup Audit dan Tujuan Audit wajib diisi!');
      return;
    }
    this.laporan.ID_Audit = this.selectedPrequalification?._id;
    this.laporan.Nama_Perusahaan = this.selectedPrequalification?.ID_Perusahaan?.Nama || '';
    // Daftar_Temuan hanya array of _id (antisipasi jika user edit sebelum submit)
    this.laporan.Daftar_Temuan = (this.laporan.Daftar_Temuan || []).map((t: any) => typeof t === 'string' ? t : t._id);

    // Auditor harus ObjectId, bukan nama
    this.laporan.Auditor = this.selectedPrequalification?.ID_Auditor?._id || this.selectedPrequalification?.ID_Auditor || '';

    // Debug: cek data sebelum submit
    // console.log('Data laporan yang dikirim:', this.laporan);

    this.userService.simpanLaporanSementara(this.laporan).subscribe({
      next: (res) => {
        this.laporan = res;
        this.isEdit = false;
        this.loadLaporan(this.selectedPrequalification._id);
        this.loadTemuan(this.selectedPrequalification._id); // reload data laporan setelah simpan
      },
      error: (err) => {
        alert('Gagal menyimpan: ' + (err.error?.message || err.message));
      }
    });
  }
  getTemuanBelumDiterima(): any[] {
    // Jika sedang edit, ambil dari this.daftarTemuan (array temuan dari backend)
    // Jika sedang tampilkan laporan, ambil dari laporan.Daftar_Temuan
    const sumber = this.isEdit ? this.daftarTemuan : (this.laporan?.Daftar_Temuan || []);
    // Hanya tampilkan temuan dengan status TL selain "Diterima"
    return sumber.filter((t: { Status_TL: string; }) => t.Status_TL !== 'Diterima');
  }


  getFileUrl(filePath: string): string {
    if (!filePath) return '';
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    }
    return `${environment.apiUrl}/${filePath.replace(/\\/g, '/')}`;
  }

  editLaporan() {
    this.isEdit = true;
  }
}
