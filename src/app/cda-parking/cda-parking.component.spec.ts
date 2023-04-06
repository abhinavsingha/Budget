import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CdaParkingComponent } from './cda-parking.component';

describe('CdaParkingComponent', () => {
  let component: CdaParkingComponent;
  let fixture: ComponentFixture<CdaParkingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CdaParkingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CdaParkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
