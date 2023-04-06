import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewContigentBillComponent } from './new-contigent-bill.component';

describe('NewContigentBillComponent', () => {
  let component: NewContigentBillComponent;
  let fixture: ComponentFixture<NewContigentBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewContigentBillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewContigentBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
