import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationTabComponent } from './evaluation-tab.component';

describe('EvaluationTabComponent', () => {
  let component: EvaluationTabComponent;
  let fixture: ComponentFixture<EvaluationTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EvaluationTabComponent]
    });
    fixture = TestBed.createComponent(EvaluationTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
