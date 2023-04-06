import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetDeleteComponent } from './budget-delete.component';

describe('BudgetDeleteComponent', () => {
  let component: BudgetDeleteComponent;
  let fixture: ComponentFixture<BudgetDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetDeleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
