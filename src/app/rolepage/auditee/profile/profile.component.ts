import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  activeTab: 'perusahaan' | 'audit' = 'perusahaan';

  perusahaan: any = {
    Nama: '',
    Alamat: '',
    Jenis_Usaha: '',
    Tanggal_Audit: ''
  };

  audit: any = {
    ID_Perusahaan: '',
    Tanggal_Audit: '',
    Tingkat_Audit: '',
    Status_Audit: '',
    ID_Auditor: ''
  };

  auditors: any[] = [];
  perusahaanList: any[] = [];
  provinces: any[] = [];
  cities: any[] = [];

  // Untuk tabel perusahaan
  showForm = false;
  allPerusahaan: any[] = [];
  filteredPerusahaan: any[] = [];
  pagedPerusahaan: any[] = [];
  searchTerm = '';
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  // Untuk tabel auditee
  allAuditee: any[] = [];
  filteredAuditee: any[] = [];
  pagedAuditee: any[] = [];
  searchTermAuditee = '';
  currentPageAuditee = 1;
  pageSizeAuditee = 5;
  totalPagesAuditee = 1;
  successAudit = '';
  errorAudit = '';
  loadingAudit = false;
  showAuditForm = false;
  isEditAudit = false;
  // Dropdown options
  tingkatAuditOptions = [
    { value: 'Awal', label: 'Awal (Initial Level)' },
    { value: 'Transisi', label: 'Transisi (Transition Level)' },
    { value: 'Lanjutan', label: 'Lanjutan (Advanced Level)' }
  ];
  statusAuditOptions = [
    { value: 'Selesai', label: 'Selesai' },
    { value: 'Berlangsung', label: 'Berlangsung' }
  ];

  constructor(private http: HttpClient, private userService: UserService,private authService: AuthService) { }
isEditPerusahaan = false;
editIdPerusahaan: string | null = null;

editPerusahaan(p: any) {
  const userId = this.authService.getUserId();
  // Pastikan field UserId pada perusahaan sama dengan user yang login
  if (!p.UserId || (typeof p.UserId === 'object' ? p.UserId._id : p.UserId) !== userId) {
    alert('Anda tidak berhak mengedit perusahaan ini!');
    return;
  }
  this.showForm = true;
  this.isEditPerusahaan = true;
  this.editIdPerusahaan = p._id;
  this.perusahaan = {
    Nama: p.Nama,
    Alamat: p.Alamat,
    Jenis_Usaha: p.Jenis_Usaha,
    Tanggal_Audit: p.Tanggal_Audit
  };
}



deletePerusahaan(p: any) {
  console.log(p);
  const userId = this.authService.getUserId();
  // Pastikan field UserId pada perusahaan sama dengan user yang login
  if (!p.UserId || (typeof p.UserId === 'object' ? p.UserId._id : p.UserId) !== userId) {
    alert('Anda tidak berhak menghapus perusahaan ini!');
    return;
  }
  if (!confirm('Yakin hapus perusahaan ini?')) return;
  this.userService.deletePerusahaan(p._id).subscribe({
    next: () => this.loadPerusahaan(),
    error: () => alert('Gagal menghapus perusahaan')
  });
}
  ngOnInit() {
    // this.getProvinces();
    this.getAllAuditors();
    this.loadPerusahaan();
    this.loadAuditee(); // Tambahkan ini
  }

  loadAuditee() {
    this.userService.getAuditee().subscribe({
      next: (data) => {
        this.allAuditee = data;
        this.filterAuditee();
      },
      error: () => {
        this.allAuditee = [];
        this.filterAuditee();
      }
    });
  }

  filterAuditee() {
    if (this.searchTermAuditee) {
      const term = this.searchTermAuditee.toLowerCase();
      this.filteredAuditee = this.allAuditee.filter(a =>
        (a.ID_Perusahaan?.Nama || '').toLowerCase().includes(term) ||
        (a.Tingkat_Audit || '').toLowerCase().includes(term) ||
        (a.Status_Audit || '').toLowerCase().includes(term) ||
        (a.ID_Auditor?.nama || a.ID_Auditor?.Nama || '').toLowerCase().includes(term)
      );
    } else {
      this.filteredAuditee = [...this.allAuditee];
    }
    this.currentPageAuditee = 1;
    this.updatePagedAuditee();
  }

  updatePagedAuditee() {
    this.totalPagesAuditee = Math.ceil(this.filteredAuditee.length / this.pageSizeAuditee);
    const start = (this.currentPageAuditee - 1) * this.pageSizeAuditee;
    this.pagedAuditee = this.filteredAuditee.slice(start, start + this.pageSizeAuditee);
  }

  goToPageAuditee(page: number) {
    if (page < 1 || page > this.totalPagesAuditee) return;
    this.currentPageAuditee = page;
    this.updatePagedAuditee();
  }


onSubmitAudit() {
  this.successAudit = '';
  this.errorAudit = '';
  this.loadingAudit = true;
  if (this.isEditAudit && this.audit._id) {
    // UPDATE
    this.userService.updateAuditee(this.audit._id, this.audit).subscribe({
      next: () => {
        this.successAudit = 'Data audit berhasil diupdate!';
        this.loadingAudit = false;
        this.resetAuditForm();
        this.loadAuditee();
        this.showAuditForm = false;
        this.isEditAudit = false;
      },
      error: () => {
        this.errorAudit = 'Gagal mengupdate data audit';
        this.loadingAudit = false;
      }
    });
  } else {
    // CREATE
    this.userService.createAuditee(this.audit).subscribe({
      next: () => {
        this.successAudit = 'Data audit berhasil disimpan!';
        this.loadingAudit = false;
        this.resetAuditForm();
        this.loadAuditee();
        this.showAuditForm = false;
      },
      error: () => {
        this.errorAudit = 'Gagal menyimpan data audit';
        this.loadingAudit = false;
      }
    });
  }
}


  resetAuditForm() {
    this.audit = {
      ID_Perusahaan: '',
      Tanggal_Audit: '',
      Tingkat_Audit: '',
      Status_Audit: '',
      ID_Auditor: ''
    };
  }



  loadPerusahaan() {
    this.userService.getPerusahaan().subscribe({
      next: (data) => {
        this.allPerusahaan = data;
        this.perusahaanList = data; // untuk dropdown audit
        this.filterPerusahaan();
      },
      error: () => {
        this.allPerusahaan = [];
        this.perusahaanList = [];
        this.filterPerusahaan();
      }
    });
  }


editAuditee(auditee: any) {
  // Tampilkan form edit, atau isi form audit dengan data auditee yang dipilih
  this.showAuditForm = true;
  this.audit = {
    ID_Perusahaan: auditee.ID_Perusahaan?._id || auditee.ID_Perusahaan,
    Tanggal_Audit: auditee.Tanggal_Audit,
    Tingkat_Audit: auditee.Tingkat_Audit,
    Status_Audit: auditee.Status_Audit,
    ID_Auditor: auditee.ID_Auditor?._id || auditee.ID_Auditor,
    _id: auditee._id // simpan id untuk update
  };
  this.isEditAudit = true;
}

deleteAuditee(id: string) {
  if (!confirm('Yakin hapus data audit ini?')) return;
  this.userService.deleteAuditee(id).subscribe({
    next: () => {
      this.loadAuditee();
    },
    error: () => alert('Gagal menghapus data audit')
  });
}

  filterPerusahaan() {
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      this.filteredPerusahaan = this.allPerusahaan.filter(p =>
        (p.Nama || '').toLowerCase().includes(term) ||
        (p.Alamat || '').toLowerCase().includes(term) ||
        (p.Jenis_Usaha || '').toLowerCase().includes(term)
      );
      
    } else {
      this.filteredPerusahaan = [...this.allPerusahaan];
    }
    this.currentPage = 1;
    this.updatePagedPerusahaan();
  }

  updatePagedPerusahaan() {
    this.totalPages = Math.ceil(this.filteredPerusahaan.length / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedPerusahaan = this.filteredPerusahaan.slice(start, start + this.pageSize);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedPerusahaan();
  }



  getAllAuditors() {
    this.userService.getAllAuditor()
      .subscribe((auditors: any[]) => {
        this.auditors = auditors;
      });
  }

onSubmitPerusahaan() {
  const userId = this.authService.getUserId();
  if (!userId) {
    alert('User tidak ditemukan. Silakan login ulang.');
    return;
  }
  const payload = {
    ...this.perusahaan,
    UserId: userId // field ini harus sesuai dengan schema backend Anda
  };
  console.log(payload);
  this.userService.createPerusahaan(payload).subscribe({
    next: () => {
      this.showForm = false;
      this.perusahaan = { Nama: '', Alamat: '', Jenis_Usaha: '', Tanggal_Audit: '' };
      this.loadPerusahaan();
    },
    error: () => alert('Gagal menambah perusahaan')
  });
}





  setTab(tab: 'perusahaan' | 'audit') {
    this.activeTab = tab;
  }
}
