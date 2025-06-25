import { Component, OnInit } from '@angular/core';
import { UserService, Kriteria } from '../../../services/user.service';

@Component({
  selector: 'app-kriteria',
  templateUrl: './kriteria.component.html',
  styleUrls: ['./kriteria.component.css']
})
export class KriteriaComponent implements OnInit {
  kriteriaList: Kriteria[] = [];
  groupedKriteria: { [key: string]: Kriteria[] } = {};
  collapsedGroups: { [key: string]: boolean } = {}; // <--- Tambahan
  form: Kriteria = { Kode: '', Deskripsi: '', Kategori: '', Referensi: '', Tingkat: 'Awal' };
  editId: string | null = null;
  showForm = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadKriteria();
  }

  loadKriteria() {
    this.userService.getKriteria().subscribe(data => {
      this.kriteriaList = data;
      this.groupedKriteria = this.groupByKodeHeader(this.kriteriaList);
      // Inisialisasi semua grup terbuka
      for (const key of Object.keys(this.groupedKriteria)) {
        if (!(key in this.collapsedGroups)) {
          this.collapsedGroups[key] = true;
        }
      }
    });
  }

  tambahKriteria() {
    if (this.editId === null) {
      this.userService.addKriteria(this.form).subscribe(() => {
        this.loadKriteria();
        this.resetForm();
      });
    } else {
      this.userService.updateKriteria(this.editId, this.form).subscribe(() => {
        this.loadKriteria();
        this.resetForm();
      });
    }
  }

  editKriteria(groupKey: string, idx: number) {
    const k = this.groupedKriteria[groupKey][idx];
    this.form = { ...k };
    this.editId = k._id || null;
    this.showForm = true;
  }

  hapusKriteria(groupKey: string, idx: number) {
    const id = this.groupedKriteria[groupKey][idx]._id;
    if (id && confirm('Yakin hapus kriteria ini?')) {
      this.userService.deleteKriteria(id).subscribe(() => {
        this.loadKriteria();
        this.resetForm();
      });
    }
  }

  batalEdit() {
    this.resetForm();
  }

  resetForm() {
    this.form = { Kode: '', Deskripsi: '', Kategori: '', Referensi: '', Tingkat: 'Awal' };
    this.editId = null;
    this.showForm = false;
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

  sortGroup = (a: any, b: any) => +a.key - +b.key;

  toggleGroup(key: string) {
    this.collapsedGroups[key] = !this.collapsedGroups[key];
  }
}
