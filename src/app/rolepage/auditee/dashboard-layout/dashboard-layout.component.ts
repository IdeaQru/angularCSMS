import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css']
})
export class DashboardLayoutComponent {
    @Input() prequalification: any; // <--- Tambahkan ini

  activeTab: 'laporan' | 'ncr' = 'laporan';
}
