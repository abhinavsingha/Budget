import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContigentBillApproverComponent } from './contigent-bill-approver.component';

describe('ContigentBillApproverComponent', () => {
  let component: ContigentBillApproverComponent;
  let fixture: ComponentFixture<ContigentBillApproverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContigentBillApproverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContigentBillApproverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
