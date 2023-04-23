import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CbVerificationComponent } from './cb-verification.component';

describe('CbVerificationComponent', () => {
  let component: CbVerificationComponent;
  let fixture: ComponentFixture<CbVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CbVerificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CbVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
