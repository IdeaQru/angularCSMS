import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-prequalification',
  templateUrl: './prequalification.component.html',
  styleUrls: ['./prequalification.component.css']
})
export class PrequalificationComponent implements OnInit {
  sections = [
    { name: 'A - Audit, Assessment, dan Inspeksi', questions: ['Apakah perusahaan memiliki audit tahunan?', 'Apakah terdapat inspeksi reguler?', 'Apakah perusahaan melakukan assessment risiko?'] },
    { name: 'B - Penerapan Identifikasi Bahaya, Penilaian dan Pengendalian Risiko', questions: ['Apakah perusahaan mengidentifikasi bahaya?', 'Apakah perusahaan memiliki penilaian risiko?', 'Apakah ada pengendalian risiko?'] },
    { name: 'C - Safety Training and Education', questions: ['Apakah perusahaan menyediakan pelatihan keselamatan?', 'Apakah terdapat pelatihan rutin untuk karyawan?', 'Apakah ada dokumentasi pelatihan?'] },
    { name: 'D - Safety Campaign and Communication', questions: ['Apakah perusahaan melakukan kampanye keselamatan?', 'Apakah ada komunikasi risiko yang baik?', 'Apakah ada pelaporan insiden?'] },
    { name: 'E - Reporting', questions: ['Apakah perusahaan melakukan pelaporan insiden?', 'Apakah ada pelaporan berkala?', 'Apakah laporan diarsipkan dengan baik?'] },
    { name: 'F - Sertifikasi', questions: ['Apakah perusahaan memiliki sertifikasi OHSAS?', 'Apakah ada audit eksternal?', 'Apakah perusahaan telah memenuhi standar keselamatan terbaru?'] }
  ];

  selectedFiles: File[] = [];

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer && event.dataTransfer.files) {
      this.selectedFiles = Array.from(event.dataTransfer.files);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const target = event.currentTarget as HTMLElement;
    target.style.backgroundColor = '#e0ffe0'; // Mengubah warna saat dragging
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const target = event.currentTarget as HTMLElement;
    target.style.backgroundColor = ''; // Mengembalikan warna default
  }
  constructor() {}

  ngOnInit(): void {}
}
