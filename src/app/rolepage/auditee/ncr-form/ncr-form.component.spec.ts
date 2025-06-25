import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NcrFormComponent } from './ncr-form.component';

describe('NcrFormComponent', () => {
  let component: NcrFormComponent;
  let fixture: ComponentFixture<NcrFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NcrFormComponent]
    });
    fixture = TestBed.createComponent(NcrFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
