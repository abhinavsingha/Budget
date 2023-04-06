import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetAllocationReportComponent } from './budget-allocation-report.component';

describe('BudgetAllocationReportComponent', () => {
  let component: BudgetAllocationReportComponent;
  let fixture: ComponentFixture<BudgetAllocationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetAllocationReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetAllocationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
