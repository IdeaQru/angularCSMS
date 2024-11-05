import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  companiesRegistered: number = 120; // Example data, replace with API calls or data service
  certificatesReleased: number = 45; // Example data, replace with API calls or data service
  reportsReleased: number = 60; // Example data, replace with API calls or data service

  // Simulate pending evaluations data with details
  pendingEvaluations = [
    { id: 1, companyName: 'PT. Alpha', details: 'Menunggu evaluasi bagian audit.' },
    { id: 2, companyName: 'PT. Beta', details: 'Menunggu evaluasi keselamatan.' },
    { id: 3, companyName: 'PT. Gamma', details: 'Menunggu evaluasi dokumen sertifikasi.' }
  ];

  // Track if details section is collapsed
  detailsCollapsed = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Fetch data for companies, certificates, and reports here
  }

  // Method to navigate to the evaluation page for a specific company
  goToEvaluation(companyId: number): void {
    console.log(`Navigating to evaluation for company ID: ${companyId}`);
    this.router.navigate(['/evaluation'], { queryParams: { companyId } });
  }
}
