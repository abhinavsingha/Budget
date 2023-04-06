import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetAllocationSubheadwiseComponent } from './budget-allocation-subheadwise.component';

describe('BudgetAllocationSubheadwiseComponent', () => {
  let component: BudgetAllocationSubheadwiseComponent;
  let fixture: ComponentFixture<BudgetAllocationSubheadwiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetAllocationSubheadwiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetAllocationSubheadwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
