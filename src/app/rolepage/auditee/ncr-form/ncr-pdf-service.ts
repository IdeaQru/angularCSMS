import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class NcrPdfService {

  constructor() { }

  generateNcrPdf(ncrData: any, perusahaanData: any, selectedPrequalification: any, daftarTemuan: any[]): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // ========== HALAMAN 1: NCR FORM ==========
    this.generateNcrPage(doc, pageWidth, ncrData, perusahaanData, selectedPrequalification, daftarTemuan);

    // ========== HALAMAN 2: LAMPIRAN TEMUAN ==========
    if (daftarTemuan && daftarTemuan.length > 0) {
      doc.addPage();
      this.generateTemuanPages(doc, pageWidth, pageHeight, daftarTemuan, perusahaanData, selectedPrequalification);
    }

    const fileName = `NCR-${ncrData._id || 'Report'}-${new Date().getTime()}.pdf`;
    doc.save(fileName);
  }

  private safeText(text: any): string {
    return text ? String(text) : '-';
  }

  private generateNcrPage(
    doc: jsPDF,
    pageWidth: number,
    ncr: any,
    perusahaanData: any,
    selectedPrequalification: any,
    daftarTemuan: any[]
  ) {
    let yPos = 15;

    // Header dengan border
    doc.setLineWidth(1);
    doc.rect(10, 10, pageWidth - 20, 25);

    // Judul Form
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('FORM KETIDAKSESUAIAN', 15, 25);
    doc.text('Non Conformity Report (NCR)', 15, 30);

    // Nomor NCR di kanan atas
    doc.setFontSize(10);
    doc.text(`NCR No: ${this.safeText(ncr._id?.slice(-8) || 'NCR-001')}`, pageWidth - 60, 25);
    doc.text(`Hal: 1 dari ${daftarTemuan.length > 0 ? '2' : '1'}`, pageWidth - 60, 30);

    yPos = 45;

    // Informasi Proyek dalam tabel
    this.drawTable(doc, [
      ['Nama Proyek/Audit', this.safeText(perusahaanData?.Nama)],
      ['Lokasi', this.safeText(perusahaanData?.Alamat)],
      ['Tanggal Audit', this.safeText(new Date(perusahaanData?.Tanggal_Audit).toLocaleDateString('id-ID'))],
      ['Auditor', this.safeText(selectedPrequalification?.ID_Auditor?.Nama)]
    ], 15, yPos, pageWidth - 30, 8);

    yPos += 40;

    // Kriteria Ketidaksesuaian
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Kriteria Ketidaksesuaian (Ketidaksesuaian/Observasi):', 15, yPos);
    yPos += 8;

    doc.setLineWidth(0.5);
    doc.rect(15, yPos, pageWidth - 30, 20);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const deskripsiLines = doc.splitTextToSize(this.safeText(ncr.Deskripsi), pageWidth - 40);
    doc.text(deskripsiLines, 20, yPos + 5);

    yPos += 30;

    // Klasifikasi
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Klasifikasi:', 15, yPos);

    // Checkbox untuk klasifikasi
    const klasifikasi = ncr.Klasifikasi;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    doc.rect(15, yPos + 5, 4, 4);
    if (klasifikasi === 'Minor') doc.text('V', 16, yPos + 8);
    doc.text('Minor', 25, yPos + 8);

    doc.rect(60, yPos + 5, 4, 4);
    if (klasifikasi === 'Major') doc.text('V', 61, yPos + 8);
    doc.text('Major', 70, yPos + 8);

    doc.rect(105, yPos + 5, 4, 4);
    if (klasifikasi === 'Critical') doc.text('V', 106, yPos + 8);
    doc.text('Critical', 115, yPos + 8);

    doc.rect(150, yPos + 5, 4, 4);
    if (klasifikasi === 'Observation') doc.text('V', 151, yPos + 8);
    doc.text('Observation', 160, yPos + 8);

    yPos += 20;

    // Analisis Akar Penyebab
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Analisis Akar Penyebab:', 15, yPos);
    yPos += 8;

    doc.setLineWidth(0.5);
    doc.rect(15, yPos, pageWidth - 30, 25);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const rootCauseLines = doc.splitTextToSize(this.safeText(ncr.Root_Cause), pageWidth - 40);
    doc.text(rootCauseLines, 20, yPos + 5);

    yPos += 35;

    // Tindakan Koreksi
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Tindakan Koreksi:', 15, yPos);
    yPos += 8;

    doc.setLineWidth(0.5);
    doc.rect(15, yPos, pageWidth - 30, 25);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const rekomendasiLines = doc.splitTextToSize(this.safeText(ncr.Rekomendasi), pageWidth - 40);
    doc.text(rekomendasiLines, 20, yPos + 5);

    yPos += 35;

    // Tindak Lanjut
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Tindak Lanjut:', 15, yPos);
    yPos += 8;

    doc.setLineWidth(0.5);
    doc.rect(15, yPos, pageWidth - 30, 20);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const tindakLanjutLines = doc.splitTextToSize(this.safeText(ncr.Tindak_Lanjut), pageWidth - 40);
    doc.text(tindakLanjutLines, 20, yPos + 5);

    yPos += 30;

    // Target Penyelesaian dan Tanggapan
    this.drawTable(doc, [
      ['Target Penyelesaian', this.safeText(ncr.Batas_Waktu)],
      ['Tanggapan', this.safeText(ncr.Tanggapan)]
    ], 15, yPos, pageWidth - 30, 8);

    yPos += 25;

    // Verifikasi
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('VERIFIKASI:', 15, yPos);
    yPos += 10;

    // Tabel verifikasi
    const verifikasiData = [
      ['Dibuat oleh:', 'Tanggal:', 'Diverifikasi oleh:', 'Tanggal:'],
      ['', new Date().toLocaleDateString('id-ID'), '', ''],
      ['', '', '', ''],
      ['Tanda tangan:', '', 'Tanda tangan:', '']
    ];

    this.drawVerificationTable(doc, verifikasiData, 15, yPos, pageWidth - 30);
    const pageHeight = doc.internal.pageSize.height;
    // Footer
    doc.setFontSize(8);
    doc.text(`Dibuat: ${new Date().toLocaleDateString('id-ID')}`, 15, pageHeight - 10);
    doc.text(`NCR-${ncr._id?.slice(-8) || '001'}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  }

  private generateTemuanPages(doc: jsPDF, pageWidth: number, pageHeight: number, daftarTemuan: any[], perusahaanData: any, selectedPrequalification: any) {
    let yPos = 15;

    // Header lampiran
    doc.setLineWidth(1);
    doc.rect(10, 10, pageWidth - 20, 25);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('LAMPIRAN', 15, 25);
    doc.text('Temuan Ketidaksesuaian', 15, 30);

    doc.setFontSize(10);
    doc.text('Hal: 2 dari 2', pageWidth - 60, 25);

    yPos = 45;

    // Info audit
    this.drawTable(doc, [
      ['Perusahaan', this.safeText(perusahaanData?.Nama)],
      ['Tanggal Audit', this.safeText(new Date(perusahaanData?.Tanggal_Audit).toLocaleDateString('id-ID'))],
      ['Total Temuan', this.safeText(daftarTemuan.length)]
    ], 15, yPos, pageWidth - 30, 8);

    yPos += 35;

    // Header tabel temuan
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('DAFTAR TEMUAN KETIDAKSESUAIAN:', 15, yPos);
    yPos += 10;

    // Tabel temuan - tambahkan parameter pageHeight
    const headers = ['No', 'Kode', 'Kategori', 'Deskripsi Temuan', 'Status'];
    const colWidths = [15, 25, 35, 70, 25, 25];

    this.drawTemuanTable(doc, headers, colWidths, 15, yPos, daftarTemuan, pageHeight);

    // Footer
    doc.setFontSize(8);
    doc.text(`Lampiran Temuan - ${new Date().toLocaleDateString('id-ID')}`, 15, pageHeight - 10);
  }


  private drawTable(doc: jsPDF, data: string[][], x: number, y: number, width: number, rowHeight: number) {
    const colWidth = width / 2;

    data.forEach((row, rowIndex) => {
      const currentY = y + (rowIndex * rowHeight);

      // Draw cells
      doc.setLineWidth(0.5);
      doc.rect(x, currentY, colWidth, rowHeight);
      doc.rect(x + colWidth, currentY, colWidth, rowHeight);

      // Add text
      doc.setFontSize(10);
      doc.setFont('helvetica', rowIndex === 0 ? 'bold' : 'normal');
      doc.text(row[0], x + 2, currentY + 5);
      doc.text(row[1], x + colWidth + 2, currentY + 5);
    });
  }

  private drawVerificationTable(doc: jsPDF, data: string[][], x: number, y: number, width: number) {
    const colWidth = width / 4;
    const rowHeight = 12;

    data.forEach((row, rowIndex) => {
      const currentY = y + (rowIndex * rowHeight);

      row.forEach((cell, colIndex) => {
        const currentX = x + (colIndex * colWidth);

        // Draw cell
        doc.setLineWidth(0.5);
        doc.rect(currentX, currentY, colWidth, rowHeight);

        // Add text
        doc.setFontSize(9);
        doc.setFont('helvetica', rowIndex === 0 ? 'bold' : 'normal');
        doc.text(cell, currentX + 2, currentY + 8);
      });
    });
  }

  private drawTemuanTable(doc: jsPDF, headers: string[], colWidths: number[], x: number, y: number, daftarTemuan: any[], pageHeight: number) {
    let currentY = y;

    // Draw headers
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setLineWidth(0.5);

    let currentX = x;
    headers.forEach((header, index) => {
      doc.rect(currentX, currentY, colWidths[index], 10);
      doc.text(header, currentX + 2, currentY + 7);
      currentX += colWidths[index];
    });

    currentY += 10;

    // Draw data rows dengan text wrapping
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);

    daftarTemuan.forEach((temuan, index) => {
      if (currentY > pageHeight - 50) return;

      currentX = x;

      // Prepare row data
      const rowData = [
        (index + 1).toString(),
        this.safeText(temuan.ID_Kriteria?.Kode),
        this.safeText(temuan.ID_Kriteria?.Kategori),
        this.safeText(temuan.ID_Kriteria?.Deskripsi), // Deskripsi lengkap
        this.safeText(temuan.Status_TL || 'Pending')
      ];

      // Calculate row height berdasarkan deskripsi terpanjang
      const deskripsiText = rowData[3];
      const maxWidth = colWidths[3] - 4; // Width kolom deskripsi minus padding
      const wrappedLines = doc.splitTextToSize(deskripsiText, maxWidth);
      const rowHeight = Math.max(8, wrappedLines.length * 4 + 4); // Minimum 8, atau sesuai jumlah baris

      // Draw cells dengan height yang dinamis
      rowData.forEach((data, colIndex) => {
        doc.rect(currentX, currentY, colWidths[colIndex], rowHeight);

        if (colIndex === 3) {
          // Kolom deskripsi - gunakan wrapped text
          doc.text(wrappedLines, currentX + 2, currentY + 4);
        } else {
          // Kolom lain - text biasa
          doc.text(data, currentX + 2, currentY + 6);
        }

        currentX += colWidths[colIndex];
      });

      currentY += rowHeight;
    });
  }
}
