import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-laporan-sementara-pdf',
  templateUrl: './laporan-sementara-pdf.component.html',
  styleUrls: ['./laporan-sementara-pdf.component.css']
})
export class LaporanSementaraPdfComponent implements AfterViewInit {
  @Input() laporan: any;
  @ViewChild('pdfContent') pdfContent!: ElementRef;
  today = new Date();
  
  isGenerating = false;
  isViewReady = false;

  constructor() { }

  ngAfterViewInit(): void {
    // Memberi jeda sesaat memastikan semua rendering Angular selesai
    setTimeout(() => this.isViewReady = true, 0);
  }

  /**
   * Fungsi krusial untuk menunggu semua aset (gambar & font) selesai dimuat
   * sebelum memulai html2canvas. Ini mencegah error dan PDF yang rusak.
   */
  private async waitForAssets(): Promise<void> {
    const promises: Promise<any>[] = [];

    // 1. Tunggu font kustom selesai dimuat
    promises.push(document.fonts.ready);

    // 2. Tunggu semua gambar di dalam konten PDF selesai dimuat
    const images = this.pdfContent.nativeElement.querySelectorAll('img');
    images.forEach((img: HTMLImageElement) => {
      if (!img.complete) {
        promises.push(new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        }));
      }
    });

    await Promise.all(promises);
  }

  /**
   * Fungsi utama untuk men-generate PDF.
   * Menggunakan metode render halaman-per-halaman yang stabil dan optimal.
   */
  async generatePDF(): Promise<void> {
    if (!this.isViewReady || this.isGenerating) {
      return;
    }

    this.isGenerating = true;

    try {
      // Langkah 1: Tunggu semua aset siap
      await this.waitForAssets();

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      // Langkah 2: Ambil semua elemen halaman individual
      const pageElements = this.pdfContent.nativeElement.querySelectorAll('.pdf-page');

      // Langkah 3: Render setiap halaman secara berurutan
      for (let i = 0; i < pageElements.length; i++) {
        const page = pageElements[i] as HTMLElement;
        
        const canvas = await html2canvas(page, {
          // Opsi untuk kualitas dan akurasi terbaik
          scale: 1.5, // Keseimbangan baik antara kualitas dan ukuran file
          useCORS: true,
          allowTaint: true,
          logging: false,
          // Opsi kunci untuk mencegah konten terpotong
          width: page.scrollWidth,
          height: page.scrollHeight,
          windowWidth: page.scrollWidth,
          windowHeight: page.scrollHeight,
        });

        // Gunakan kompresi JPEG untuk ukuran file yang jauh lebih kecil
        const imgData = canvas.toDataURL('image/jpeg', 0.8); // Kualitas 0.8
        
        // Hitung rasio aspek untuk menjaga gambar tidak penyok
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        // Tambahkan halaman baru jika ini bukan halaman pertama
        if (i > 0) {
          pdf.addPage();
        }

        // Tambahkan gambar halaman ke PDF
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, imgHeight);
      }
      
      // Langkah 4: Simpan file PDF
      pdf.save(`Laporan-Sementara-${this.laporan.Nama_Perusahaan}.pdf`);

    } catch (err) {
      console.error("Error saat membuat PDF:", err);
      alert("Gagal membuat PDF. Silakan periksa konsol untuk detail teknis.");
    } finally {
      // Langkah 5: Pastikan tombol kembali normal
      this.isGenerating = false;
    }
  }
}
