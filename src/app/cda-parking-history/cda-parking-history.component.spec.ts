import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CdaParkingHistoryComponent } from './cda-parking-history.component';

describe('CdaParkingHistoryComponent', () => {
  let component: CdaParkingHistoryComponent;
  let fixture: ComponentFixture<CdaParkingHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CdaParkingHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CdaParkingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
