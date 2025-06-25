import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Modal } from 'bootstrap';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { NcrPdfService } from './ncr-pdf-service';
import { environment } from '../../../../environment/environment';

@Component({
  selector: 'app-ncr-form',
  templateUrl: './ncr-form.component.html',
  styleUrls: ['./ncr-form.component.css']
})
export class NcrFormComponent implements OnInit, AfterViewInit {
  // --- State Management ---
  isLoading = true;
  isSubmitting = false;
  userId: string | null = null;
  
  // --- Data Utama ---
  perusahaanData: any = null;
  selectedPrequalification: any = null;
  daftarTemuan: any[] = [];
  
  // --- Modal & Form NCR ---
  public ncrModal: Modal | undefined;
  modalMode: 'create' | 'edit' = 'create';
  selectedTemuan: any = null;
  modalErrorMsg = '';
  
  ncrForm = {
    _id: '',
    Deskripsi: '',
    Klasifikasi: '',
    Root_Cause: '',
    Rekomendasi: '',
    Batas_Waktu: '',
    Tanggapan: '',
    Tindak_Lanjut: ''
  };

  klasifikasiOptions = ['Minor', 'Major', 'Critical', 'Observation'];
  prequalifications: any[] = []; 

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private ncrPdfService: NcrPdfService
  ) {}

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.loadUserCompany(); 
  }

  ngAfterViewInit() {
    const modalElement = document.getElementById('ncrFormModal');
    if (modalElement) {
      this.ncrModal = new Modal(modalElement);
    }
  }

  loadUserCompany() {
    if (!this.userId) return;
    this.isLoading = true;
    this.userService.getPerusahaanByUserId(this.userId).subscribe({
      next: (res) => {
        this.perusahaanData = Array.isArray(res) ? res[0] : res;
        if (this.perusahaanData?._id) this.loadPrequalificationData();
        else { this.isLoading = false; this.modalErrorMsg = "Data perusahaan tidak ditemukan."; }
      },
      error: (err) => { this.isLoading = false; this.modalErrorMsg = "Gagal memuat data perusahaan."; }
    });
  }

  loadPrequalificationData() {
    if (!this.perusahaanData?._id) return;
    this.userService.getPrequalificationByPerusahaan(this.perusahaanData._id).subscribe({
      next: (res) => {
        this.prequalifications = Array.isArray(res) ? res : [res];
        this.selectedPrequalification = this.prequalifications.length ? this.prequalifications[0] : null;
        if (this.selectedPrequalification?._id) this.loadTemuanWithNcr(this.selectedPrequalification._id);
        else { this.isLoading = false; }
      },
      error: (err) => { this.isLoading = false; }
    });
  }
  
  /**
   * Memuat temuan dan NCR, lalu menggabungkannya berdasarkan struktur data yang benar
   */
loadTemuanWithNcr(prequalificationId: string) {
  this.isLoading = true;
  
  const getTemuan$ = this.userService.getTemuanByAudit(prequalificationId);
  const getAllNcr$ = this.userService.getNcrByUser(this.userId!);
  
  forkJoin([getTemuan$, getAllNcr$]).subscribe({
    next: ([temuanList, ncrResponse]) => {
      console.log('=== DEBUG START ===');
      console.log('Raw temuanList:', JSON.stringify(temuanList, null, 2));
      console.log('Raw ncrResponse:', JSON.stringify(ncrResponse, null, 2));
      
      const semuaTemuan = Array.isArray(temuanList) ? temuanList : [];
      const semuaNcr = Array.isArray(ncrResponse) ? ncrResponse : (ncrResponse ? [ncrResponse] : []);
      
      console.log('Processed semuaTemuan count:', semuaTemuan.length);
      console.log('Processed semuaNcr count:', semuaNcr.length);
      
      // Log semua ID untuk debugging
      console.log('=== TEMUAN IDs ===');
      semuaTemuan.forEach((temuan, index) => {
        const id = this.extractId(temuan._id);
        console.log(`Temuan ${index + 1}: ${id}`);
      });
      
      console.log('=== NCR IDs ===');
      semuaNcr.forEach((ncr, index) => {
        const id = this.extractId(ncr.ID_Temuan._id);
        console.log(`NCR ${index + 1} -> Temuan ID: ${id}`);
      });
      
      // Proses penggabungan dengan logging detail
      this.daftarTemuan = semuaTemuan.map((temuan, temuanIndex) => {
        const temuanId = this.extractId(temuan._id);
        console.log(`\n--- Processing Temuan ${temuanIndex + 1} (ID: ${temuanId}) ---`);
        
        let ncrTerkait = null;
        semuaNcr.forEach((ncr, ncrIndex) => {
          const ncrTemuanId = this.extractId(ncr.ID_Temuan?._id);
          console.log(`  Checking NCR ${ncrIndex }: ${ncrTemuanId} === ${temuanId} ? ${ncrTemuanId === temuanId}`);
          
          if (ncrTemuanId === temuanId) {
            ncrTerkait = ncr;
            console.log(`  ✅ MATCH FOUND! NCR ${ncrIndex + 1} matches Temuan ${temuanIndex + 1}`);
          }
        });
        
        if (!ncrTerkait) {
          console.log(`  ❌ No NCR found for Temuan ${temuanIndex + 1}`);
        }
        
        return {
          ...temuan,
          ncrData: ncrTerkait
        };
      });
      
      // Summary
      const temuanWithNcr = this.daftarTemuan.filter(t => t.ncrData);
      console.log(`\n=== SUMMARY ===`);
      console.log(`Total Temuan: ${this.daftarTemuan.length}`);
      console.log(`Temuan with NCR: ${temuanWithNcr.length}`);
      console.log(`Temuan without NCR: ${this.daftarTemuan.length - temuanWithNcr.length}`);
      console.log('=== DEBUG END ===');
      
      this.isLoading = false;
    },
    error: (err) => {
      console.error("Error loading temuan with NCR:", err);
      this.isLoading = false;
      this.modalErrorMsg = "Gagal memuat data temuan dan NCR.";
    }
  });
}
  extractId(_id: any) {
    if (typeof _id === 'string') {
      return _id;
    } else if (_id?.$oid) {
      return _id.$oid;
    } else {
      return null;
    }
  }

  
  openNcrModal(temuan: any, mode: 'create' | 'edit'): void {
    this.resetNcrFormState();
    this.modalMode = mode;
    this.selectedTemuan = temuan;

    if (mode === 'create') {
      // Mode BUAT: Isi form dari data temuan
      this.ncrForm.Deskripsi = temuan.Deskripsi || '';
      this.ncrForm.Klasifikasi = temuan.Klasifikasi_Temuan || '';
    } else if (temuan.ncrData) {
      // Mode EDIT: Isi form dari data NCR yang sudah ada
      const ncrData = temuan.ncrData;
      this.ncrForm = {
        _id: ncrData._id?.$oid || ncrData._id,
        Deskripsi: ncrData.Deskripsi,
        Klasifikasi: ncrData.Klasifikasi,
        Root_Cause: ncrData.Root_Cause || '',
        Rekomendasi: ncrData.Rekomendasi || '',
        Batas_Waktu: ncrData.Batas_Waktu ? new Date(ncrData.Batas_Waktu).toISOString().split('T')[0] : '',
        Tanggapan: ncrData.Tanggapan || '',
        Tindak_Lanjut: ncrData.Tindak_Lanjut || ''
      };
    }
    this.ncrModal?.show();
  }

  submitNCR(): void {
    if (!this.ncrForm.Deskripsi || !this.ncrForm.Klasifikasi) {
      this.modalErrorMsg = 'Deskripsi dan Klasifikasi wajib diisi!';
      return;
    }
    this.isSubmitting = true;
    this.modalErrorMsg = '';

    if (this.modalMode === 'create') this.createNcr();
    else this.updateNcr();
  }

  private createNcr(): void {
    const { _id, ...payload } = this.ncrForm;
    // Pastikan ID_Temuan menggunakan format yang benar
    const temuanId = this.selectedTemuan._id?.$oid || this.selectedTemuan._id;
    const dataToSend = { 
      ...payload, 
      ID_Temuan: temuanId,
      Penanggung_Jawab: this.userId 
    };
    
    console.log('Creating NCR with data:', dataToSend);
    
    this.userService.createNcr(dataToSend).subscribe({
      next: () => this.handleSuccess('NCR berhasil dibuat!'),
      error: (err) => this.handleError(err, 'Gagal membuat NCR.')
    });
  }

  private updateNcr(): void {
    const { _id, ...payload } = this.ncrForm;
    console.log('Updating NCR with ID:', _id, 'and payload:', payload);
    
    this.userService.updateNcr(_id, payload).subscribe({
      next: () => this.handleSuccess('NCR berhasil diperbarui!'),
      error: (err) => this.handleError(err, 'Gagal memperbarui NCR.')
    });
  }
  
  private handleSuccess(message: string): void {
    this.isSubmitting = false;
    this.ncrModal?.hide();
    alert(message);
    if (this.selectedPrequalification?._id) {
      this.loadTemuanWithNcr(this.selectedPrequalification._id);
    }
  }

  private handleError(error: any, defaultMessage: string): void {
    this.isSubmitting = false;
    this.modalErrorMsg = defaultMessage;
    console.error('API Error:', error);
  }

  resetNcrFormState(): void {
    this.modalMode = 'create';
    this.selectedTemuan = null;
    this.modalErrorMsg = '';
    this.isSubmitting = false;
    this.ncrForm = { _id: '', Deskripsi: '', Klasifikasi: '', Root_Cause: '', Rekomendasi: '', Batas_Waktu: '', Tanggapan: '', Tindak_Lanjut: '' };
  }
  
  downloadNcrFromTable(temuan: any): void {
    if (!temuan.ncrData) {
        alert('Data NCR untuk temuan ini tidak ada.');
        return;
    }
    this.ncrPdfService.generateNcrPdf(
      temuan.ncrData, 
      this.perusahaanData, 
      this.selectedPrequalification, 
      [temuan]
    );
  }

  getFileUrl(filePath: string): string {
    if (!filePath) return '';
    return `${environment.apiUrl}/${filePath.replace(/\\/g, '/')}`;
  }
}
