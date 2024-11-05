import { Component } from '@angular/core';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class EvaluationComponent {
  // Define the list of companies
  companies = [
    { id: '1', name: 'PT. A' },
    { id: '2', name: 'PT. B' },
    { id: '3', name: 'PT. C' },
    // Add more companies as needed
  ];

  // Define the selectedCompany property
  selectedCompany: string = '';
  selectedCompanyDetails: { score: number, summary: string } | null = null;

  // Define the evaluation scores and summaries for each company
  companyDetails: { [key: string]: { score: number, summary: string } } = {
    '1': { score: 85, summary: 'Perusahaan memiliki audit tahunan yang baik, dan risiko keselamatan dikendalikan dengan baik.' },
    '2': { score: 92, summary: 'Pelatihan keselamatan rutin dan komunikasi risiko efektif, dengan audit eksternal dilakukan.' },
    '3': { score: 78, summary: 'Perusahaan memiliki sertifikasi OHSAS, tetapi membutuhkan peningkatan dalam pengendalian risiko.' },
    // Add more company details as needed
  };

  // Method to handle changes in company selection
  onCompanyChange(): void {
    console.log('Selected Company:', this.selectedCompany);
    // Update the selected company details based on the selectedCompany ID
    this.selectedCompanyDetails = this.companyDetails[this.selectedCompany];
  }

  // Sections and questions data for evaluation
  sections = [
    { name: 'A - Audit, Assessment, dan Inspeksi', questions: ['Apakah perusahaan memiliki audit tahunan?', 'Apakah terdapat inspeksi reguler?', 'Apakah perusahaan melakukan assessment risiko?'] },
    { name: 'B - Penerapan Identifikasi Bahaya, Penilaian dan Pengendalian Risiko', questions: ['Apakah perusahaan mengidentifikasi bahaya?', 'Apakah perusahaan memiliki penilaian risiko?', 'Apakah ada pengendalian risiko?'] },
    { name: 'C - Safety Training and Education', questions: ['Apakah perusahaan menyediakan pelatihan keselamatan?', 'Apakah terdapat pelatihan rutin untuk karyawan?', 'Apakah ada dokumentasi pelatihan?'] },
    { name: 'D - Safety Campaign and Communication', questions: ['Apakah perusahaan melakukan kampanye keselamatan?', 'Apakah ada komunikasi risiko yang baik?', 'Apakah ada pelaporan insiden?'] },
    { name: 'E - Reporting', questions: ['Apakah perusahaan melakukan pelaporan insiden?', 'Apakah ada pelaporan berkala?', 'Apakah laporan diarsipkan dengan baik?'] },
    { name: 'F - Sertifikasi', questions: ['Apakah perusahaan memiliki sertifikasi OHSAS?', 'Apakah ada audit eksternal?', 'Apakah perusahaan telah memenuhi standar keselamatan terbaru?'] }
  ];

  // Methods to accept and deny file
  acceptFile(question: any, fileIndex: number) {
    console.log(`Accepted file for question: ${question} - Index: ${fileIndex}`);
    // Add logic to handle file acceptance
  }

  denyFile(question: any, fileIndex: number) {
    console.log(`Denied file for question: ${question} - Index: ${fileIndex}`);
    // Add logic to handle file denial
  }
}
