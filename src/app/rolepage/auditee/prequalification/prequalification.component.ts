import { Component, OnInit } from '@angular/core';
import { UserService, Kriteria } from '../../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from '../../../../environment/environment';
declare var bootstrap: any; // Untuk Bootstrap 5 Modal

interface JawabanTersimpan {
  Pilihan: string;
  Keterangan: string;
  File_Bukti?: string;
}
interface AuditeeAnswer {
  pilihan?: string;
  keterangan?: string;
  fileLink?: string;
}


@Component({
  selector: 'app-prequalification',
  templateUrl: './prequalification.component.html',
  styleUrls: ['./prequalification.component.css']
})
export class PrequalificationComponent implements OnInit {
  auditeeList: any[] = [];
  selectedAuditeeId: string | null = null;
  selectedAuditee: any | null = null;

  kriteriaList: Kriteria[] = [];
  groupedKriteria: { [key: string]: Kriteria[] } = {};
  collapsedGroups: { [key: string]: boolean } = {};
  files: { [kode: string]: File | null } = {};
  auditeeData: { [kode: string]: AuditeeAnswer } = {};
  showMore: { [kode: string]: boolean } = {};
  pilihanList = ['Ya', 'Tidak', 'Tidak Berlaku'];
  previewUrl: string = '';
  // Tambahan untuk fitur edit
  jawabanTersimpan: { [kode: string]: JawabanTersimpan } = {};
  editMode: { [kode: string]: boolean } = {};

  constructor(private userService: UserService, private snackBar: MatSnackBar, private authService: AuthService

  ) { }
  openPreview(filePath: string | undefined) {
    this.previewUrl = this.getFileUrl(filePath ?? '');
    console.log(this.previewUrl);
    // Tampilkan modal (Bootstrap 5)
    const modal = new bootstrap.Modal(document.getElementById('filePreviewModal'));
    modal.show();
  }

  isImageFile(url: string): boolean {
    return /\.(jpg|jpeg|png|gif|bmp)$/i.test(url);
  }

  isPdfFile(url: string): boolean {
    return /\.pdf$/i.test(url);
  }
getFileUrl(filePath: string): string {
  if (!filePath) return '';
  // Pastikan path selalu pakai slash
  const safePath = filePath.replace(/\\/g, '/');
  if (safePath.startsWith('http://') || safePath.startsWith('https://')) {
    return safePath;
  }
  return `${environment.apiUrl}/${safePath}`;
}

  ngOnInit(): void {
    this.userService.getAuditee().subscribe(data => {
      this.auditeeList = data;
    });
  }

  onAuditeeSelected() {
    this.selectedAuditee = this.auditeeList.find(a => a._id === this.selectedAuditeeId) || null;
    if (this.selectedAuditee) {
      this.userService.getKriteria().subscribe(data => {
        this.kriteriaList = data;
        this.groupedKriteria = this.groupByKodeHeader(this.kriteriaList);
        for (const key of Object.keys(this.groupedKriteria)) {
          this.collapsedGroups[key] = true;
        }
        for (const k of this.kriteriaList) {
          this.showMore[k.Kode] = false;
          this.auditeeData[k.Kode] = {};
          this.editMode[k.Kode] = false;
        }
        // Load jawaban tersimpan dari backend
        this.loadJawabanTersimpan();
      });
    }
  }

  loadJawabanTersimpan() {
    this.userService.getPrequalificationByAuditee(this.selectedAuditee._id)
      .subscribe((prequal: any) => {
        if (prequal && prequal.Jawaban) {
          for (const j of prequal.Jawaban) {
            // Jika field Kode tidak ada, mapping via _id ke kriteriaList
            let kode = j.Kode;
            if (!kode && j.Kriteria) {
              // Jika Kriteria adalah ObjectId, cari di kriteriaList
              const kriteriaObj = this.kriteriaList.find(k => k._id === j.Kriteria || k._id === j.Kriteria._id);
              kode = kriteriaObj ? kriteriaObj.Kode : undefined;
            }
            if (kode) {
              this.jawabanTersimpan[kode] = {
                Pilihan: j.Pilihan,
                Keterangan: j.Keterangan,
                File_Bukti: j.File_Bukti
              };
              this.editMode[kode] = false;
              this.auditeeData[kode] = {
                pilihan: j.Pilihan,
                keterangan: j.Keterangan
              };
            }
          }
        }
      });
  }


  groupByKodeHeader(list: Kriteria[]): { [key: string]: Kriteria[] } {
    const groups: { [key: string]: Kriteria[] } = {};
    for (const k of list) {
      const header = k.Kode.split('.')[0];
      if (!groups[header]) groups[header] = [];
      groups[header].push(k);
    }
    return groups;
  }

  toggleGroup(key: string) {
    this.collapsedGroups[key] = !this.collapsedGroups[key];
  }

  onFileSelected(event: Event, kode: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.files[kode] = input.files[0];
    }
  }

  toggleShowMore(kode: string) {
    this.showMore[kode] = !this.showMore[kode];
  }
  get progressPercent(): number {
    const total = this.kriteriaList.length;
    const filled = this.kriteriaList.filter(
      k => !!this.auditeeData[k.Kode]?.pilihan
    ).length;
    return total === 0 ? 0 : Math.round((filled / total) * 100);
  }
  editJawaban(kode: string) {
    this.editMode[kode] = true;
    // Saat masuk edit, isi input dengan jawaban lama
    const jawaban = this.jawabanTersimpan[kode];
    if (jawaban) {
      this.auditeeData[kode] = {
        pilihan: jawaban.Pilihan,
        keterangan: jawaban.Keterangan
      };
    }
  }

  cancelEdit(kode: string) {
    this.editMode[kode] = false;
    // Reset input ke jawaban lama
    const jawaban = this.jawabanTersimpan[kode];
    if (jawaban) {
      this.auditeeData[kode] = {
        pilihan: jawaban.Pilihan,
        keterangan: jawaban.Keterangan
      };
    } else {
      this.auditeeData[kode] = {};
    }
    this.files[kode] = null;
  }

simpanJawaban(k: Kriteria) {
  if (!this.selectedAuditee) return;
  const jawaban = {
    Kriteria: k._id,
    Pilihan: this.auditeeData[k.Kode].pilihan,
    Keterangan: this.auditeeData[k.Kode].keterangan ?? '',
    File_Bukti: ''
  };
  let file = this.files[k.Kode];

  if (file) {
    // Rename file sebelum upload
    file = this.renameFile(file, k);
    this.userService.uploadFile(file).subscribe({
      next: (res: any) => {
        jawaban.File_Bukti = res.filePath;
        this.saveJawabanToDb(k, jawaban);
      },
      error: err => {
        alert('Gagal upload file: ' + (err.error?.error || err.message));
      }
    });
  } else {
    this.saveJawabanToDb(k, jawaban);
  }
}

renameFile(originalFile: File, k: Kriteria): File {
  // Ambil ekstensi file
  const ext = originalFile.name.split('.').pop();
  // Nama file: kode_kriteria-timestamp.ext (tanpa spasi/karakter aneh)
  const cleanKode = k.Kode.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\-]/g, '');
  const timestamp = Date.now();
  const newName = `${cleanKode}_${timestamp}.${ext}`;
  // Buat file baru dengan nama baru
  return new File([originalFile], newName, { type: originalFile.type });
}

  saveJawabanToDb(k: Kriteria, jawaban: any) {
    const Penanggung_Jawab = this.authService.getUserId();

    this.userService.saveJawabanPrequalification(
      this.selectedAuditee._id,
      this.selectedAuditee.ID_Perusahaan._id,
      this.selectedAuditee.ID_Auditor._id,
      Penanggung_Jawab,
      jawaban
    ).subscribe({
      next: () => {
        this.jawabanTersimpan[k.Kode] = {
          Pilihan: jawaban.Pilihan,
          Keterangan: jawaban.Keterangan,
          File_Bukti: jawaban.File_Bukti
        };
        this.editMode[k.Kode] = false;
        this.files[k.Kode] = null;
        // Snackbar notifikasi sukses
        this.snackBar.open('✅ Jawaban berhasil disimpan!', 'Tutup', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      },
      error: err => {
        this.snackBar.open('❌ Gagal menyimpan jawaban: ' + (err.error?.error || err.message), 'Tutup', {
          duration: 4000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }




  sortGroup = (a: any, b: any) => +a.key - +b.key;
}
