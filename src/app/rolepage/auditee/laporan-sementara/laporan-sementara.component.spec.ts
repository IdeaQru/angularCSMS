import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporanSementaraComponent } from './laporan-sementara.component';

describe('LaporanSementaraComponent', () => {
  let component: LaporanSementaraComponent;
  let fixture: ComponentFixture<LaporanSementaraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LaporanSementaraComponent]
    });
    fixture = TestBed.createComponent(LaporanSementaraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
