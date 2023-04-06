import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetApproverComponent } from './budget-approver.component';

describe('BudgetApproverComponent', () => {
  let component: BudgetApproverComponent;
  let fixture: ComponentFixture<BudgetApproverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetApproverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetApproverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
