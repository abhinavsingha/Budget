import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitRebaseReportComponent } from './unit-rebase-report.component';

describe('UnitRebaseReportComponent', () => {
  let component: UnitRebaseReportComponent;
  let fixture: ComponentFixture<UnitRebaseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitRebaseReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitRebaseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
