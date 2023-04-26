import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedBudgetComponent } from './approved-budget.component';

describe('ApprovedBudgetComponent', () => {
  let component: ApprovedBudgetComponent;
  let fixture: ComponentFixture<ApprovedBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedBudgetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
