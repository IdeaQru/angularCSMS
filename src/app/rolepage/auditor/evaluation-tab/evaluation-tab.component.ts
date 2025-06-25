import { Component } from '@angular/core';

@Component({
  selector: 'app-evaluation-tab',
  templateUrl: './evaluation-tab.component.html',
  styleUrls: ['./evaluation-tab.component.css']
})
export class EvaluationTabComponent {
  activeTab: string = 'evaluasi';
  laporanData: any = null;

  setLaporan(laporan: any) {
    this.laporanData = laporan;
  }
}
