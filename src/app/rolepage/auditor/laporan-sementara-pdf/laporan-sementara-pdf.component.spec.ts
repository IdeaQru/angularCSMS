import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporanSementaraPdfComponent } from './laporan-sementara-pdf.component';

describe('LaporanSementaraPdfComponent', () => {
  let component: LaporanSementaraPdfComponent;
  let fixture: ComponentFixture<LaporanSementaraPdfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LaporanSementaraPdfComponent]
    });
    fixture = TestBed.createComponent(LaporanSementaraPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
