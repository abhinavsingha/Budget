import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CdaParkingReportComponent } from './cda-parking-report.component';

describe('CdaParkingReportComponent', () => {
  let component: CdaParkingReportComponent;
  let fixture: ComponentFixture<CdaParkingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CdaParkingReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CdaParkingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
