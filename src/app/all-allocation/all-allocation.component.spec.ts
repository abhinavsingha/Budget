import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAllocationComponent } from './all-allocation.component';

describe('AllAllocationComponent', () => {
  let component: AllAllocationComponent;
  let fixture: ComponentFixture<AllAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllAllocationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
