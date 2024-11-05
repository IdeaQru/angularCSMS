import { Component } from '@angular/core';

@Component({
  selector: 'app-certification',
  templateUrl: './certification.component.html',
  styleUrls: ['./certification.component.css']
})
export class CertificationComponent {
  selectedCompany: string = '';
  companies = [
    { id: '1', name: 'PT. A', score: 85, reportSummary: 'Evaluasi menunjukkan bahwa PT. A memiliki kepatuhan keselamatan kerja yang baik, namun masih perlu meningkatkan proses pelatihan.' },
    { id: '2', name: 'PT. B', score: 92, reportSummary: 'PT. B memiliki tingkat kepatuhan yang sangat baik dan sudah mengikuti semua standar kesehatan dan keselamatan yang diperlukan.' },
    { id: '3', name: 'PT. C', score: 78, reportSummary: 'Evaluasi PT. C menunjukkan beberapa aspek yang masih memerlukan peningkatan, terutama dalam hal pengendalian risiko dan pelaporan.' },
    // Tambahkan perusahaan lainnya di sini
  ];

  // Properti untuk menyimpan informasi perusahaan yang dipilih
  selectedCompanyDetails: any = null;

  // Metode untuk menangani perubahan pada dropdown pemilihan perusahaan
  onCompanyChange(): void {
    this.selectedCompanyDetails = this.companies.find(company => company.id === this.selectedCompany);
    console.log('Perusahaan terpilih:', this.selectedCompanyDetails);
    // Tambahkan logika yang sesuai untuk menangani perubahan perusahaan di sini
  }
}
