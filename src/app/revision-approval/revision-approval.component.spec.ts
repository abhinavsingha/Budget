import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisionApprovalComponent } from './revision-approval.component';

describe('RevisionApprovalComponent', () => {
  let component: RevisionApprovalComponent;
  let fixture: ComponentFixture<RevisionApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevisionApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevisionApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
